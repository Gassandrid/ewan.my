import { loadMapbox, applyMonochromeMapPalette } from "./mapboxClient"
import { resolveRelative, FullSlug } from "../../util/path"

interface MarkerData {
  lat: number
  lon: number
  title: string
  slug: string
  icon?: string
  color?: string
  popupFields: Record<string, any>
}

interface MapConfig {
  defaultZoom: number
  defaultCenter?: [number, number]
  clustering: boolean
}

function formatPropertyValue(value: any): string {
  if (value === undefined || value === null) return ""
  if (Array.isArray(value)) {
    return value.map((item) => formatPropertyValue(item)).join(", ")
  }
  if (value instanceof Date) {
    return value.toISOString().split("T")[0]
  }
  if (typeof value === "string") {
    return value
  }
  return String(value)
}

function createPopupContent(
  marker: MarkerData,
  currentSlug: FullSlug,
  properties?: Record<string, { displayName?: string }>,
): string {
  const href = resolveRelative(currentSlug, marker.slug as FullSlug)

  let content = `<div class="base-map-popup">`
  content += `<a href="${href}" class="base-map-popup-title" data-slug="${marker.slug}">${marker.title}</a>`

  if (Object.keys(marker.popupFields).length > 0) {
    content += `<div class="base-map-popup-meta">`
    for (const [key, value] of Object.entries(marker.popupFields)) {
      const displayName =
        properties?.[key]?.displayName ||
        key
          .replace(/^(note|file)\./, "")
          .split(".")
          .pop()
          ?.replace(/-/g, " ")
          .replace(/_/g, " ") ||
        key

      const formattedValue = formatPropertyValue(value)
      if (formattedValue) {
        content += `<div class="base-map-popup-field"><span class="base-map-popup-label">${displayName}:</span> <span class="base-map-popup-value">${formattedValue}</span></div>`
      }
    }
    content += `</div>`
  }

  content += `</div>`
  return content
}

async function initializeMap(container: HTMLElement) {
  const markersData = JSON.parse(container.getAttribute("data-markers") || "[]") as MarkerData[]
  const config = JSON.parse(container.getAttribute("data-config") || "{}") as MapConfig
  const currentSlug = container.getAttribute("data-current-slug") as FullSlug
  const properties = container.getAttribute("data-properties")
    ? JSON.parse(container.getAttribute("data-properties")!)
    : undefined

  if (markersData.length === 0) {
    container.innerHTML = `<div class="base-map-empty">no locations to display</div>`
    return
  }

  const mapboxgl = await loadMapbox()
  if (!mapboxgl) {
    container.innerHTML = `<div class="base-map-empty">map unavailable</div>`
    return
  }

  // calculate bounds to fit all markers
  let bounds: any = null
  if (markersData.length > 0) {
    bounds = new mapboxgl.LngLatBounds()
    markersData.forEach((marker) => {
      bounds.extend([marker.lon, marker.lat])
    })
  }

  // determine initial center and zoom
  let center: [number, number]
  let zoom: number

  if (config.defaultCenter) {
    center = [config.defaultCenter[1], config.defaultCenter[0]] // [lon, lat]
    zoom = config.defaultZoom
  } else if (bounds) {
    center = bounds.getCenter().toArray() as [number, number]
    zoom = config.defaultZoom
  } else {
    center = [0, 0]
    zoom = 2
  }

  // initialize map
  const map = new mapboxgl.Map({
    container: container,
    style: "mapbox://styles/mapbox/light-v11",
    center: center,
    zoom: zoom,
    attributionControl: false,
  })

  // apply monochrome styling once loaded
  map.once("load", () => {
    applyMonochromeMapPalette(map)

    // fit to bounds if we have markers and no explicit center
    if (bounds && !config.defaultCenter && markersData.length > 1) {
      map.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 15,
      })
    }
  })

  // add markers
  if (config.clustering && markersData.length > 10) {
    // use clustering for many markers
    const geojson: any = {
      type: "FeatureCollection",
      features: markersData.map((marker) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [marker.lon, marker.lat],
        },
        properties: {
          title: marker.title,
          slug: marker.slug,
          icon: marker.icon,
          color: marker.color,
          popupFields: marker.popupFields,
        },
      })),
    }

    map.on("load", () => {
      map.addSource("markers", {
        type: "geojson",
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      })

      // cluster circles
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "markers",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#2b2418",
          "circle-radius": ["step", ["get", "point_count"], 20, 10, 30, 30, 40],
          "circle-opacity": 0.8,
        },
      })

      // cluster count labels
      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "markers",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: {
          "text-color": "#fff9f3",
        },
      })

      // unclustered points
      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "markers",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#2b2418",
          "circle-radius": 8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff9f3",
        },
      })

      // click on cluster to zoom
      map.on("click", "clusters", (e: any) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        })
        const clusterId = features[0].properties.cluster_id
        map.getSource("markers").getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
          if (err) return
          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
          })
        })
      })

      // show popup on unclustered point click
      map.on("click", "unclustered-point", (e: any) => {
        const coordinates = e.features[0].geometry.coordinates.slice()
        const props = e.features[0].properties

        const marker: MarkerData = {
          lat: coordinates[1],
          lon: coordinates[0],
          title: props.title,
          slug: props.slug,
          icon: props.icon,
          color: props.color,
          popupFields: JSON.parse(props.popupFields || "{}"),
        }

        const popupContent = createPopupContent(marker, currentSlug, properties)

        new mapboxgl.Popup().setLngLat(coordinates).setHTML(popupContent).addTo(map)
      })

      // change cursor on hover
      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer"
      })
      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = ""
      })
      map.on("mouseenter", "unclustered-point", () => {
        map.getCanvas().style.cursor = "pointer"
      })
      map.on("mouseleave", "unclustered-point", () => {
        map.getCanvas().style.cursor = ""
      })
    })
  } else {
    // no clustering - individual markers
    markersData.forEach((marker) => {
      const el = document.createElement("div")
      el.className = "base-map-marker"

      if (marker.icon) {
        el.innerHTML = marker.icon
      }

      if (marker.color) {
        el.style.color = marker.color
      }

      const popupContent = createPopupContent(marker, currentSlug, properties)

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent)

      new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([marker.lon, marker.lat])
        .setPopup(popup)
        .addTo(map)
    })
  }

  // store map instance for cleanup
  // @ts-ignore
  container._mapInstance = map
}

function initBaseMaps() {
  const containers = document.querySelectorAll<HTMLElement>(".base-map")
  containers.forEach((container) => {
    // @ts-ignore
    if (container._mapInitialized) return
    // @ts-ignore
    container._mapInitialized = true
    initializeMap(container)
  })
}

function cleanupBaseMaps() {
  const containers = document.querySelectorAll<HTMLElement>(".base-map")
  containers.forEach((container) => {
    // @ts-ignore
    const map = container._mapInstance
    if (map && typeof map.remove === "function") {
      try {
        map.remove()
      } catch (error) {
        console.error(error)
      }
    }
    // @ts-ignore
    container._mapInstance = null
    // @ts-ignore
    container._mapInitialized = false
  })
}

// initialize on nav event
document.addEventListener("nav", () => {
  setTimeout(() => {
    initBaseMaps()
  }, 100)
  // cleanup before navigation
  window.addCleanup(() => {
    cleanupBaseMaps()
  })
})
