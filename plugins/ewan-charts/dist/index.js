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
  var d3Promise = null;

  function loadD3() {
    if (window.d3) return Promise.resolve(window.d3);
    if (d3Promise) return d3Promise;
    d3Promise = new Promise(function(resolve, reject) {
      var existing = document.querySelector('script[data-ewan-d3]');
      var script = existing || document.createElement("script");
      if (!existing) {
        script.src = "https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js";
        script.defer = true;
        script.dataset.ewanD3 = "true";
        document.head.appendChild(script);
      }
      script.addEventListener("load", function() { resolve(window.d3); }, { once: true });
      script.addEventListener("error", function() { reject(new Error("failed to load D3")); }, { once: true });
    });
    return d3Promise;
  }

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

  function initCalPlot(container) {
    if (container.dataset.calplotReady === "true") return;
    container.dataset.calplotReady = "true";
    var cfg = JSON.parse(container.getAttribute("data-calplot") || "{}");
    var grid = container.querySelector(".calplot-grid");
    var profile = container.querySelector(".calplot-profile");
    var stats = container.querySelector(".calplot-day-stats");
    var label = container.querySelector(".calplot-selected-label");
    var monthLabel = container.querySelector(".calplot-month-label");
    var tabs = container.querySelector(".calplot-shot-tabs");
    var year = Number(cfg.year), month = Number(cfg.month), allData = {}, activeShot = null;
    var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    function monthData() {
      var prefix = year + "-" + String(month).padStart(2, "0");
      return Object.fromEntries(Object.entries(allData).filter(function(entry) { return entry[0].startsWith(prefix); }));
    }
    function renderProfile(points) {
      profile.innerHTML = "";
      if (!Array.isArray(points) || points.length === 0) { profile.innerHTML = '<div class="chart-error">No profile data</div>'; return; }
      var width = Math.max(360, profile.clientWidth || 640), height = 340;
      var m = { top: 18, right: 58, bottom: 38, left: 48 };
      var iw = width - m.left - m.right, ih = height - m.top - m.bottom;
      var svg = window.d3.select(profile).append("svg").attr("viewBox", "0 0 " + width + " " + height).attr("role", "img").attr("aria-label", "Espresso extraction profile");
      var g = svg.append("g").attr("transform", "translate(" + m.left + "," + m.top + ")");
      var x = window.d3.scaleLinear().domain(window.d3.extent(points, function(d) { return d.t; })).range([0, iw]);
      var yl = window.d3.scaleLinear().domain([0, (window.d3.max(points, function(d) { return Math.max(d.p || 0, (d.f || 0) * 3); }) || 1) * 1.1]).nice().range([ih, 0]);
      var yr = window.d3.scaleLinear().domain([0, (window.d3.max(points, function(d) { return Math.max(d.w || 0, d.c || 0); }) || 1) * 1.05]).nice().range([ih, 0]);
      g.append("g").attr("class", "chart-grid").call(window.d3.axisLeft(yl).ticks(5).tickSize(-iw).tickFormat(""));
      g.append("g").attr("class", "chart-axis").attr("transform", "translate(0," + ih + ")").call(window.d3.axisBottom(x).ticks(8).tickFormat(function(d) { return d + "s"; }));
      g.append("g").attr("class", "chart-axis").call(window.d3.axisLeft(yl).ticks(5));
      g.append("g").attr("class", "chart-axis").attr("transform", "translate(" + iw + ",0)").call(window.d3.axisRight(yr).ticks(5));
      var series = [
        ["p", "Pressure (bar)", "slate", yl, 1], ["f", "Flow x3 (ml/s)", "ochre", yl, 3],
        ["w", "Weight (g)", "sage", yr, 1], ["c", "Temp (°C)", "rust", yr, 1]
      ];
      series.forEach(function(s, index) {
        var line = window.d3.line().x(function(d) { return x(d.t); }).y(function(d) { return s[3]((d[s[0]] || 0) * s[4]); }).curve(window.d3.curveMonotoneX);
        g.append("path").datum(points).attr("fill", "none").attr("stroke", resolveColor(s[2])).attr("stroke-width", index === 0 ? 2.5 : 2).attr("stroke-dasharray", index % 2 ? "5,3" : null).attr("d", line);
      });
    }
    function selectShot(shot) {
      activeShot = shot; stats.innerHTML = "";
      [["Time", shot.time, "slate"], ["Rating", shot.rating + "/5", "rust"], ["EY", Number(shot.ey).toFixed(1) + "%", "sage"], ["TDS", Number(shot.tds).toFixed(2) + "%", "pine"]].forEach(function(item) {
        var card = document.createElement("div"); card.className = "stat-card";
        card.style.setProperty("--stat-accent", "var(--" + item[2] + ")");
        card.innerHTML = '<div class="stat-card-value">' + item[1] + '</div><div class="stat-card-label">' + item[0] + '</div>';
        stats.appendChild(card);
      });
      renderProfile(shot.profile);
    }
    function selectDay(date, day) {
      label.textContent = new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) + " · " + day.shots.length + " shot" + (day.shots.length === 1 ? "" : "s");
      tabs.innerHTML = "";
      day.shots.forEach(function(shot, index) {
        var button = document.createElement("button"); button.className = "calplot-shot-tab" + (index === 0 ? " active" : "");
        button.textContent = "Shot " + (index + 1) + " · " + shot.time;
        button.addEventListener("click", function() { tabs.querySelectorAll("button").forEach(function(t) { t.classList.remove("active"); }); button.classList.add("active"); selectShot(shot); });
        tabs.appendChild(button);
      });
      if (day.shots[0]) selectShot(day.shots[0]);
    }
    function renderCalendar() {
      grid.innerHTML = ""; monthLabel.textContent = monthNames[month - 1] + " " + year;
      var data = monthData(), days = new Date(year, month, 0).getDate(), first = new Date(year, month - 1, 1).getDay();
      var cells = Array.from({ length: days }, function(_, i) { var day = i + 1; var date = year + "-" + String(month).padStart(2,"0") + "-" + String(day).padStart(2,"0"); return { day: day, date: date, value: data[date], slot: first + i }; });
      var max = window.d3.max(cells, function(d) { return d.value?.shots?.length || 0; }) || 1;
      var color = window.d3.scaleLinear().domain([0,1,max]).range([resolveColor("lightgray"), resolveColor("ochre"), resolveColor("rust")]);
      var svg = window.d3.select(grid).append("svg").attr("viewBox", "0 0 294 " + (28 + Math.ceil((days + first) / 7) * 42)).attr("role", "grid");
      svg.selectAll(".dow").data(["Su","Mo","Tu","We","Th","Fr","Sa"]).enter().append("text").attr("x", function(_,i) { return i * 42 + 19; }).attr("y",14).attr("text-anchor","middle").attr("fill",resolveColor("gray")).attr("font-size",10).text(function(d){ return d; });
      var g = svg.append("g").attr("transform","translate(0,24)");
      g.selectAll("rect").data(cells).enter().append("rect").attr("x",function(d){return(d.slot%7)*42;}).attr("y",function(d){return Math.floor(d.slot/7)*42;}).attr("width",38).attr("height",38).attr("rx",4).attr("fill",function(d){return color(d.value?.shots?.length||0);}).attr("opacity",function(d){return d.value?.shots?.length?1:0.3;}).attr("cursor",function(d){return d.value?.shots?.length?"pointer":"default";}).on("click",function(event,d){if(d.value?.shots?.length)selectDay(d.date,d.value);});
      g.selectAll("text").data(cells).enter().append("text").attr("x",function(d){return(d.slot%7)*42+19;}).attr("y",function(d){return Math.floor(d.slot/7)*42+23;}).attr("text-anchor","middle").attr("pointer-events","none").attr("fill",resolveColor("darkgray")).attr("font-size",11).text(function(d){return d.day;});
      var last = Object.keys(data).filter(function(k){return data[k]?.shots?.length;}).sort().pop(); if(last)selectDay(last,data[last]);
    }
    container.querySelector(".calplot-prev").addEventListener("click",function(){month--;if(month<1){month=12;year--;}renderCalendar();});
    container.querySelector(".calplot-next").addEventListener("click",function(){month++;if(month>12){month=1;year++;}renderCalendar();});
    fetch(cfg.source).then(function(r){if(!r.ok)throw new Error(r.status);return r.json();}).then(function(data){allData=data;container.querySelector(".calplot-loading")?.remove();renderCalendar();}).catch(function(error){container.querySelector(".calplot-loading").innerHTML='<div class="chart-error">Failed to load extraction data</div>';console.error("[calplot]",error);});
    if(window.ResizeObserver){observers[container.id]=new ResizeObserver(function(){if(activeShot)renderProfile(activeShot.profile);});observers[container.id].observe(profile);}
  }

  async function init() {
    var containers = document.querySelectorAll(".chart-container[data-chart-config]");
    var calendars = document.querySelectorAll("[data-calplot]");
    if (containers.length === 0 && calendars.length === 0) return;
    try { await loadD3(); } catch (error) { console.error("[charts]", error); return; }
    containers.forEach(function(container) {
      if (container.dataset.chartReady === "true") return;
      container.dataset.chartReady = "true";
      hydrate(container);
      if (window.ResizeObserver) {
        observers[container.id] = new ResizeObserver(function() { hydrate(container); });
        observers[container.id].observe(container);
      }
    });
    calendars.forEach(initCalPlot);
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
