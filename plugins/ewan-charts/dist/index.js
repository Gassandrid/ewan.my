import { visit } from "unist-util-visit"

function chartId() {
  return `chart-${Math.random().toString(36).slice(2, 10)}`
}

function escapeHtmlAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function parseConfig(raw) {
  const config = {}
  for (const line of raw.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const match = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(trimmed)
    if (!match) continue

    const [, key, value] = match
    const normalized = value.replace(/^["']|["']$/g, "")
    if (/^-?\d+(\.\d+)?$/.test(normalized)) {
      config[key] = Number(normalized)
    } else if (normalized === "true" || normalized === "false") {
      config[key] = normalized === "true"
    } else {
      config[key] = normalized
    }
  }
  return {
    type: "line",
    y: "",
    color: "",
    height: 320,
    tooltip: true,
    ...config,
  }
}

const CHART_RUNTIME = `
(function() {
  if (window.EwanCharts) return;

  var dataCache = {};
  var observers = {};

  function resolveColor(name) {
    var value = String(name || "").trim();
    if (!value) value = "secondary";
    if (value[0] === "#" || value.startsWith("rgb") || value.startsWith("hsl")) return value;
    var css = getComputedStyle(document.documentElement).getPropertyValue("--" + value).trim();
    return css || getComputedStyle(document.documentElement).getPropertyValue("--secondary").trim() || "#8b7f73";
  }

  function palette(config) {
    if (config.color) return String(config.color).split(",").map(resolveColor);
    return ["rust", "clay", "ochre", "sage", "pine", "slate", "mauve"].map(resolveColor);
  }

  function valuesFor(config) {
    return String(config.y || "").split(",").map(function(s) { return s.trim(); }).filter(Boolean);
  }

  function asNumber(value) {
    var number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function parseX(value, config) {
    if (config.xType === "number") return asNumber(value);
    if (config.xType === "date" || /date|time/i.test(config.x || "")) {
      var date = config.dateFormat && window.d3.timeParse(config.dateFormat)(value);
      if (!date) date = window.d3.isoParse(value) || new Date(value);
      return isNaN(date.getTime()) ? value : date;
    }
    var numeric = asNumber(value);
    return numeric === null ? value : numeric;
  }

  function formatValue(value) {
    if (value instanceof Date) return window.d3.timeFormat("%b %d, %Y")(value);
    if (typeof value === "number") return Math.abs(value) >= 1000 ? window.d3.format(",.0f")(value) : window.d3.format(".2f")(value);
    return value;
  }

  async function loadData(config) {
    if (!config.source) throw new Error("missing chart source");
    if (!dataCache[config.source]) {
      dataCache[config.source] = fetch(config.source).then(function(res) {
        if (!res.ok) throw new Error("failed to fetch " + config.source + ": " + res.status);
        return res.json();
      });
    }
    var data = await dataCache[config.source];
    return Array.isArray(data) ? data : data.data || [];
  }

  function ensureTooltip(container) {
    var tip = container.querySelector(".chart-tooltip");
    if (!tip) {
      tip = document.createElement("div");
      tip.className = "chart-tooltip";
      container.appendChild(tip);
    }
    return tip;
  }

  function showTip(tip, html, x, y) {
    tip.innerHTML = html;
    tip.style.left = x + "px";
    tip.style.top = y + "px";
    tip.classList.add("visible");
  }

  function hideTip(tip) {
    tip.classList.remove("visible");
  }

  function renderLegend(container, keys, colors) {
    var existing = container.querySelector(".chart-legend");
    if (existing) existing.remove();
    if (keys.length <= 1) return;
    var legend = document.createElement("div");
    legend.className = "chart-legend";
    keys.forEach(function(key, index) {
      var item = document.createElement("div");
      item.className = "chart-legend-item";
      var swatch = document.createElement("span");
      swatch.className = "chart-legend-swatch";
      swatch.style.background = colors[index % colors.length];
      item.appendChild(swatch);
      item.appendChild(document.createTextNode(key));
      legend.appendChild(item);
    });
    container.appendChild(legend);
  }

  function renderChart(container, data, config) {
    var wrapper = container.querySelector(".chart-svg-wrapper");
    wrapper.innerHTML = "";
    var keys = valuesFor(config);
    if (!config.x || keys.length === 0) throw new Error("chart requires x and y fields");

    var width = Math.max(320, wrapper.clientWidth || container.clientWidth || 640);
    var height = Number(config.height) || 320;
    var margin = { top: config.title ? 42 : 18, right: 26, bottom: config.xLabel ? 52 : 34, left: config.yLabel ? 62 : 46 };
    var innerWidth = Math.max(160, width - margin.left - margin.right);
    var innerHeight = Math.max(120, height - margin.top - margin.bottom);
    var colors = palette(config);

    var rows = data.map(function(row) {
      var copy = { __x: parseX(row[config.x], config), __raw: row };
      keys.forEach(function(key) { copy[key] = Number(row[key]); });
      return copy;
    }).filter(function(row) {
      return row.__x !== null && keys.some(function(key) { return Number.isFinite(row[key]); });
    });
    if (rows.length === 0) throw new Error("chart data has no renderable rows");

    var svg = window.d3.select(wrapper).append("svg").attr("viewBox", "0 0 " + width + " " + height).attr("role", "img");
    if (config.title) svg.attr("aria-label", config.title);
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var sampleX = rows[0].__x;
    var xScale;
    if (sampleX instanceof Date) {
      xScale = window.d3.scaleTime().domain(window.d3.extent(rows, function(d) { return d.__x; })).range([0, innerWidth]);
    } else if (typeof sampleX === "number") {
      xScale = window.d3.scaleLinear().domain(window.d3.extent(rows, function(d) { return d.__x; })).nice().range([0, innerWidth]);
    } else {
      xScale = window.d3.scaleBand().domain(rows.map(function(d) { return d.__x; })).range([0, innerWidth]).padding(0.1);
    }

    var allY = [];
    rows.forEach(function(row) { keys.forEach(function(key) { if (Number.isFinite(row[key])) allY.push(row[key]); }); });
    var yExtent = window.d3.extent(allY);
    var yScale = window.d3.scaleLinear().domain([Math.min(0, yExtent[0]), yExtent[1]]).nice().range([innerHeight, 0]);

    g.append("g").attr("class", "chart-grid").call(window.d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth).tickFormat(""));
    g.append("g").attr("class", "chart-axis").attr("transform", "translate(0," + innerHeight + ")").call(window.d3.axisBottom(xScale).ticks ? window.d3.axisBottom(xScale).ticks(6) : window.d3.axisBottom(xScale));
    g.append("g").attr("class", "chart-axis").call(window.d3.axisLeft(yScale).ticks(5));

    if (config.title) {
      svg.append("text").attr("class", "chart-title").attr("x", width / 2).attr("y", 22).text(config.title);
    }
    if (config.xLabel) {
      svg.append("text").attr("class", "chart-axis-label").attr("x", margin.left + innerWidth / 2).attr("y", height - 8).attr("text-anchor", "middle").text(config.xLabel);
    }
    if (config.yLabel) {
      svg.append("text").attr("class", "chart-axis-label").attr("transform", "rotate(-90)").attr("x", -(margin.top + innerHeight / 2)).attr("y", 14).attr("text-anchor", "middle").text(config.yLabel);
    }

    var curveMap = {
      linear: window.d3.curveLinear,
      monotone: window.d3.curveMonotoneX,
      step: window.d3.curveStep,
      basis: window.d3.curveBasis,
    };
    var curve = curveMap[config.curve] || window.d3.curveMonotoneX;
    var tip = ensureTooltip(container);

    keys.forEach(function(key, index) {
      var color = colors[index % colors.length];
      var points = rows.filter(function(row) { return Number.isFinite(row[key]); });
      if (config.type === "scatter") {
        g.selectAll(".chart-point-" + index)
          .data(points)
          .enter()
          .append("circle")
          .attr("cx", function(d) { return xScale(d.__x) + (xScale.bandwidth ? xScale.bandwidth() / 2 : 0); })
          .attr("cy", function(d) { return yScale(d[key]); })
          .attr("r", Number(config.radius) || 4)
          .attr("fill", color)
          .attr("opacity", 0.85)
          .on("mouseenter", function(event, d) { if (config.tooltip !== false) showTip(tip, "<div class='tooltip-label'>" + formatValue(d.__x) + "</div><div class='tooltip-value'>" + key + ": " + formatValue(d[key]) + "</div>", event.offsetX + 12, event.offsetY + 12); })
          .on("mouseleave", function() { hideTip(tip); });
        return;
      }

      if (config.type === "area") {
        var area = window.d3.area()
          .defined(function(d) { return Number.isFinite(d[key]); })
          .x(function(d) { return xScale(d.__x) + (xScale.bandwidth ? xScale.bandwidth() / 2 : 0); })
          .y0(innerHeight)
          .y1(function(d) { return yScale(d[key]); })
          .curve(curve);
        g.append("path").datum(points).attr("fill", color).attr("opacity", 0.18).attr("d", area);
      }

      var line = window.d3.line()
        .defined(function(d) { return Number.isFinite(d[key]); })
        .x(function(d) { return xScale(d.__x) + (xScale.bandwidth ? xScale.bandwidth() / 2 : 0); })
        .y(function(d) { return yScale(d[key]); })
        .curve(curve);
      g.append("path").datum(points).attr("fill", "none").attr("stroke", color).attr("stroke-width", 2).attr("d", line);
    });

    renderLegend(container, keys, colors);
  }

  async function hydrate(container) {
    if (!window.d3) {
      setTimeout(function() { hydrate(container); }, 50);
      return;
    }
    var config = JSON.parse(container.getAttribute("data-chart-config") || "{}");
    var wrapper = container.querySelector(".chart-svg-wrapper");
    wrapper.innerHTML = "<div class='chart-loading'><span class='chart-loading-spinner'></span></div>";
    try {
      var data = await loadData(config);
      renderChart(container, data, config);
      var caption = container.querySelector(".chart-caption");
      if (caption) caption.textContent = config.caption || "";
    } catch (error) {
      wrapper.innerHTML = "<div class='chart-error'>" + String(error.message || error) + "</div>";
    }
  }

  function init() {
    document.querySelectorAll(".chart-container[data-chart-config]").forEach(function(container) {
      if (container.dataset.chartReady === "true") return;
      container.dataset.chartReady = "true";
      hydrate(container);
      if (window.ResizeObserver) {
        observers[container.id] = new ResizeObserver(function() { hydrate(container); });
        observers[container.id].observe(container);
      }
    });
  }

  window.EwanCharts = { init: init };
  document.addEventListener("DOMContentLoaded", init);
  document.addEventListener("nav", function() { setTimeout(init, 50); });
  if (document.readyState !== "loading") init();
})();
`

export default function EwanCharts() {
  return {
    name: "EwanCharts",
    markdownPlugins() {
      return [
        () => (tree) => {
          visit(tree, "code", (node, index, parent) => {
            if (node.lang !== "chart" || !parent?.children || index === undefined) return

            const config = parseConfig(node.value)
            const id = chartId()
            parent.children.splice(index, 1, {
              type: "html",
              value: `<div class="chart-container" id="${id}" data-chart-config="${escapeHtmlAttr(JSON.stringify(config))}"><div class="chart-svg-wrapper"></div><div class="chart-caption"></div></div>`,
            })
          })
        },
      ]
    },
    externalResources() {
      return {
        js: [
          {
            src: "https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js",
            loadTime: "beforeDOMReady",
            contentType: "external",
            spaPreserve: true,
          },
          {
            script: CHART_RUNTIME,
            loadTime: "afterDOMReady",
            contentType: "inline",
            spaPreserve: true,
          },
        ],
      }
    },
  }
}
