import { QuartzTransformerPlugin } from "../types"
import { Root } from "mdast"
import { visit } from "unist-util-visit"

const generateChartId = () =>
  `chart-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 10)}`

function parseYamlConfig(raw: string): Record<string, string> {
  const config: Record<string, string> = {}
  for (const line of raw.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const colonIdx = trimmed.indexOf(":")
    if (colonIdx === -1) continue
    const key = trimmed.slice(0, colonIdx).trim()
    const value = trimmed.slice(colonIdx + 1).trim()
    config[key] = value
  }
  return config
}

function buildConfig(raw: Record<string, string>) {
  return {
    type: raw.type || "line",
    source: raw.source || "",
    x: raw.x || "",
    y: raw.y || "",
    title: raw.title || "",
    caption: raw.caption || "",
    color: raw.color || "secondary",
    xLabel: raw.xLabel || "",
    yLabel: raw.yLabel || "",
    height: parseInt(raw.height || "320", 10),
    xType: raw.xType || "auto",
    yType: raw.yType || "linear",
    curve: raw.curve || "monotone",
    dots: raw.dots === "true",
    grid: raw.grid !== "false",
    animate: raw.animate !== "false",
    tooltip: raw.tooltip !== "false",
    dateFormat: raw.dateFormat || "",
    tickFormat: raw.tickFormat || "",
  }
}

const GLOBAL_CHART_SCRIPT = `
(function() {
  if (window.EwanCharts) return;

  var dataCache = {};
  var activeCharts = {};
  var resizeObservers = {};

  function resolveColor(name) {
    var el = document.documentElement;
    var val = getComputedStyle(el).getPropertyValue('--' + name).trim();
    if (val) return val;
    if (name.startsWith('#') || name.startsWith('rgb')) return name;
    return getComputedStyle(el).getPropertyValue('--secondary').trim();
  }

  function getThemeColors() {
    return {
      bg: resolveColor('light'),
      fg: resolveColor('darkgray'),
      grid: resolveColor('lightgray'),
      axis: resolveColor('gray'),
      label: resolveColor('gray'),
      title: resolveColor('dark'),
    };
  }

  function getChartPalette() {
    return ['rust','clay','ochre','sage','pine','slate','mauve'].map(resolveColor);
  }

  function resolveColors(colorStr) {
    var names = colorStr.split(',').map(function(s) { return s.trim(); });
    return names.map(resolveColor);
  }

  function parseDate(str, fmt) {
    if (fmt) {
      var p = d3.timeParse(fmt);
      var result = p(str);
      if (result) return result;
    }
    var iso = d3.isoParse(str);
    if (iso) return iso;
    var d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  }

  function detectXType(data, xKey, config) {
    if (config.xType !== 'auto') return config.xType;
    var sample = data[0][xKey];
    if (sample instanceof Date) return 'time';
    if (typeof sample === 'number') return 'linear';
    if (typeof sample === 'string') {
      var d = parseDate(sample, config.dateFormat);
      if (d) return 'time';
    }
    return 'band';
  }

  function formatValue(v) {
    if (v instanceof Date) return d3.timeFormat('%b %d, %Y')(v);
    if (typeof v === 'number') {
      if (Math.abs(v) >= 1000) return d3.format(',.0f')(v);
      if (Math.abs(v) < 0.01) return d3.format('.4f')(v);
      return d3.format('.2f')(v);
    }
    return String(v);
  }

  function createTooltip(container) {
    var tip = document.createElement('div');
    tip.className = 'chart-tooltip';
    container.appendChild(tip);
    return tip;
  }

  function showTooltip(tip, html, x, y, containerRect) {
    tip.innerHTML = html;
    tip.classList.add('visible');
    var tipRect = tip.getBoundingClientRect();
    var left = x + 12;
    var top = y - tipRect.height / 2;
    if (left + tipRect.width > containerRect.width - 10) {
      left = x - tipRect.width - 12;
    }
    if (top < 5) top = 5;
    if (top + tipRect.height > containerRect.height - 5) {
      top = containerRect.height - tipRect.height - 5;
    }
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  }

  function hideTooltip(tip) {
    tip.classList.remove('visible');
  }

  function getMargins(config, yKeys) {
    var top = config.title ? 42 : 16;
    var right = 16;
    var bottom = config.xLabel ? 52 : 36;
    var left = config.yLabel ? 62 : 48;
    return { top: top, right: right, bottom: bottom, left: left };
  }

  function createSvg(wrapper, width, height) {
    wrapper.innerHTML = '';
    var svg = d3.select(wrapper).append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', '0 0 ' + width + ' ' + height);
    return svg;
  }

  function drawGrid(g, yScale, innerWidth, config) {
    if (!config.grid) return;
    g.append('g')
      .attr('class', 'chart-grid')
      .call(d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickFormat('')
        .ticks(5));
  }

  function drawAxes(g, xScale, yScale, innerHeight, config) {
    var theme = getThemeColors();
    var xAxis = g.append('g')
      .attr('class', 'chart-axis')
      .attr('transform', 'translate(0,' + innerHeight + ')')
      .call(d3.axisBottom(xScale).ticks(6));

    var yAxis = g.append('g')
      .attr('class', 'chart-axis')
      .call(d3.axisLeft(yScale).ticks(5));

    if (config.tickFormat) {
      yAxis.call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(config.tickFormat)));
    }

    return { xAxis: xAxis, yAxis: yAxis };
  }

  function drawTitle(svg, config, width, margins) {
    if (!config.title) return;
    svg.append('text')
      .attr('class', 'chart-title')
      .attr('x', width / 2)
      .attr('y', margins.top - 12)
      .text(config.title);
  }

  function drawAxisLabels(svg, config, width, height, margins, innerWidth, innerHeight) {
    if (config.xLabel) {
      svg.append('text')
        .attr('class', 'chart-axis-label')
        .attr('text-anchor', 'middle')
        .attr('x', margins.left + innerWidth / 2)
        .attr('y', height - 6)
        .text(config.xLabel);
    }
    if (config.yLabel) {
      svg.append('text')
        .attr('class', 'chart-axis-label')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .attr('x', -(margins.top + innerHeight / 2))
        .attr('y', 14)
        .text(config.yLabel);
    }
  }

  function drawLegend(container, yKeys, colors) {
    if (yKeys.length <= 1) return;
    var existing = container.querySelector('.chart-legend');
    if (existing) existing.remove();
    var legend = document.createElement('div');
    legend.className = 'chart-legend';
    yKeys.forEach(function(key, i) {
      var item = document.createElement('span');
      item.className = 'chart-legend-item';
      var swatch = document.createElement('span');
      swatch.className = 'chart-legend-swatch';
      swatch.style.backgroundColor = colors[i % colors.length];
      item.appendChild(swatch);
      item.appendChild(document.createTextNode(key));
      legend.appendChild(item);
    });
    var svgWrapper = container.querySelector('.chart-svg-wrapper');
    if (svgWrapper && svgWrapper.nextSibling) {
      container.insertBefore(legend, svgWrapper.nextSibling);
    } else {
      container.appendChild(legend);
    }
  }

  // --- Chart Renderers ---

  function renderLineChart(container, config, data) {
    var wrapper = container.querySelector('.chart-svg-wrapper');
    var width = wrapper.clientWidth || 600;
    var height = config.height;
    var yKeys = config.y.split(',').map(function(s) { return s.trim(); });
    var colors = resolveColors(config.color);
    if (colors.length < yKeys.length) {
      var palette = getChartPalette();
      colors = yKeys.map(function(_, i) { return palette[i % palette.length]; });
    }
    var margins = getMargins(config, yKeys);
    var innerWidth = width - margins.left - margins.right;
    var innerHeight = height - margins.top - margins.bottom;
    var theme = getThemeColors();

    var xType = detectXType(data, config.x, config);
    var xAccessor = function(d) {
      if (xType === 'time') {
        return d[config.x] instanceof Date ? d[config.x] : parseDate(String(d[config.x]), config.dateFormat);
      }
      return +d[config.x];
    };

    var xScale;
    if (xType === 'time') {
      xScale = d3.scaleTime()
        .domain(d3.extent(data, xAccessor))
        .range([0, innerWidth]);
    } else if (xType === 'band') {
      xScale = d3.scaleBand()
        .domain(data.map(function(d) { return d[config.x]; }))
        .range([0, innerWidth])
        .padding(0.1);
    } else {
      xScale = d3.scaleLinear()
        .domain(d3.extent(data, xAccessor))
        .range([0, innerWidth])
        .nice();
    }

    var allYValues = [];
    yKeys.forEach(function(k) {
      data.forEach(function(d) { allYValues.push(+d[k]); });
    });
    var yMin = d3.min(allYValues);
    var yMax = d3.max(allYValues);
    var yPad = (yMax - yMin) * 0.08;

    var yScale;
    if (config.yType === 'log') {
      yScale = d3.scaleLog()
        .domain([Math.max(0.01, yMin), yMax * 1.05])
        .range([innerHeight, 0]);
    } else {
      yScale = d3.scaleLinear()
        .domain([yMin - yPad, yMax + yPad])
        .range([innerHeight, 0])
        .nice();
    }

    var svg = createSvg(wrapper, width, height);
    var g = svg.append('g').attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

    drawGrid(g, yScale, innerWidth, config);
    drawAxes(g, xScale, yScale, innerHeight, config);
    drawTitle(svg, config, width, margins);
    drawAxisLabels(svg, config, width, height, margins, innerWidth, innerHeight);

    var curveMap = {
      'linear': d3.curveLinear,
      'monotone': d3.curveMonotoneX,
      'step': d3.curveStep,
      'basis': d3.curveBasis,
    };
    var curveFn = curveMap[config.curve] || d3.curveMonotoneX;

    yKeys.forEach(function(yKey, seriesIdx) {
      var color = colors[seriesIdx % colors.length];
      var lineGen = d3.line()
        .x(function(d) { return xScale(xAccessor(d)); })
        .y(function(d) { return yScale(+d[yKey]); })
        .curve(curveFn)
        .defined(function(d) { return d[yKey] != null && !isNaN(+d[yKey]); });

      var path = g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('d', lineGen);

      if (config.animate) {
        var totalLength = path.node().getTotalLength();
        path.attr('stroke-dasharray', totalLength)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(800)
          .ease(d3.easeCubicOut)
          .attr('stroke-dashoffset', 0);
      }

      if (config.dots) {
        var dots = g.selectAll('.dot-' + seriesIdx)
          .data(data.filter(function(d) { return d[yKey] != null && !isNaN(+d[yKey]); }))
          .enter().append('circle')
          .attr('cx', function(d) { return xScale(xAccessor(d)); })
          .attr('cy', function(d) { return yScale(+d[yKey]); })
          .attr('r', 3)
          .attr('fill', color)
          .attr('opacity', 0);

        if (config.animate) {
          dots.transition().delay(800).duration(300).attr('opacity', 0.8);
        } else {
          dots.attr('opacity', 0.8);
        }
      }
    });

    drawLegend(container, yKeys, colors);

    if (config.tooltip) {
      var tip = createTooltip(container);
      var bisector = d3.bisector(function(d) { return xAccessor(d); }).left;
      var overlay = g.append('rect')
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr('fill', 'none')
        .attr('pointer-events', 'all');

      var hoverLine = g.append('line')
        .attr('stroke', theme.axis)
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', '3,3')
        .attr('y1', 0)
        .attr('y2', innerHeight)
        .style('opacity', 0);

      overlay.on('mousemove', function(event) {
        var coords = d3.pointer(event);
        var x0 = xScale.invert ? xScale.invert(coords[0]) : null;
        if (x0 === null) return;
        var idx = bisector(data, x0, 1);
        var d0 = data[idx - 1];
        var d1 = data[idx];
        if (!d0 && !d1) return;
        var d = !d0 ? d1 : !d1 ? d0 : (x0 - xAccessor(d0) > xAccessor(d1) - x0 ? d1 : d0);

        var xPos = xScale(xAccessor(d));
        hoverLine.attr('x1', xPos).attr('x2', xPos).style('opacity', 1);

        var html = '<div class="tooltip-label">' + formatValue(xAccessor(d)) + '</div>';
        yKeys.forEach(function(k, i) {
          var c = colors[i % colors.length];
          html += '<div class="tooltip-value" style="color:' + c + '">' + k + ': ' + formatValue(+d[k]) + '</div>';
        });

        var containerRect = container.getBoundingClientRect();
        var wrapperRect = wrapper.getBoundingClientRect();
        showTooltip(tip, html, xPos + margins.left, coords[1] + margins.top, {
          width: containerRect.width,
          height: containerRect.height
        });
      });

      overlay.on('mouseleave', function() {
        hideTooltip(tip);
        hoverLine.style('opacity', 0);
      });
    }
  }

  function renderScatterChart(container, config, data) {
    var wrapper = container.querySelector('.chart-svg-wrapper');
    var width = wrapper.clientWidth || 600;
    var height = config.height;
    var yKeys = config.y.split(',').map(function(s) { return s.trim(); });
    var colors = resolveColors(config.color);
    if (colors.length < yKeys.length) {
      var palette = getChartPalette();
      colors = yKeys.map(function(_, i) { return palette[i % palette.length]; });
    }
    var margins = getMargins(config, yKeys);
    var innerWidth = width - margins.left - margins.right;
    var innerHeight = height - margins.top - margins.bottom;

    var xType = detectXType(data, config.x, config);
    var xAccessor = function(d) {
      if (xType === 'time') {
        return d[config.x] instanceof Date ? d[config.x] : parseDate(String(d[config.x]), config.dateFormat);
      }
      return +d[config.x];
    };

    var xScale;
    if (xType === 'time') {
      xScale = d3.scaleTime().domain(d3.extent(data, xAccessor)).range([0, innerWidth]);
    } else {
      xScale = d3.scaleLinear().domain(d3.extent(data, xAccessor)).range([0, innerWidth]).nice();
    }

    var allYValues = [];
    yKeys.forEach(function(k) {
      data.forEach(function(d) { if (d[k] != null) allYValues.push(+d[k]); });
    });
    var yMin = d3.min(allYValues);
    var yMax = d3.max(allYValues);
    var yPad = (yMax - yMin) * 0.08;
    var yScale = d3.scaleLinear()
      .domain([yMin - yPad, yMax + yPad])
      .range([innerHeight, 0])
      .nice();

    var svg = createSvg(wrapper, width, height);
    var g = svg.append('g').attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

    drawGrid(g, yScale, innerWidth, config);
    drawAxes(g, xScale, yScale, innerHeight, config);
    drawTitle(svg, config, width, margins);
    drawAxisLabels(svg, config, width, height, margins, innerWidth, innerHeight);

    yKeys.forEach(function(yKey, seriesIdx) {
      var color = colors[seriesIdx % colors.length];
      var circles = g.selectAll('.scatter-' + seriesIdx)
        .data(data.filter(function(d) { return d[yKey] != null && !isNaN(+d[yKey]); }))
        .enter().append('circle')
        .attr('cx', function(d) { return xScale(xAccessor(d)); })
        .attr('cy', function(d) { return yScale(+d[yKey]); })
        .attr('r', 4)
        .attr('fill', color)
        .attr('opacity', 0);

      if (config.animate) {
        circles.transition()
          .delay(function(_, i) { return i * 8; })
          .duration(400)
          .attr('opacity', 0.75);
      } else {
        circles.attr('opacity', 0.75);
      }
    });

    drawLegend(container, yKeys, colors);

    if (config.tooltip) {
      var tip = createTooltip(container);
      g.selectAll('circle').on('mouseenter', function(event, d) {
        var circle = d3.select(this);
        circle.transition().duration(100).attr('r', 6);
        var html = '<div class="tooltip-label">' + config.x + ': ' + formatValue(xAccessor(d)) + '</div>';
        yKeys.forEach(function(k, i) {
          var c = colors[i % colors.length];
          html += '<div class="tooltip-value" style="color:' + c + '">' + k + ': ' + formatValue(+d[k]) + '</div>';
        });
        var containerRect = container.getBoundingClientRect();
        var coords = d3.pointer(event, wrapper);
        showTooltip(tip, html, coords[0], coords[1], {
          width: containerRect.width,
          height: containerRect.height
        });
      }).on('mouseleave', function() {
        d3.select(this).transition().duration(100).attr('r', 4);
        hideTooltip(tip);
      });
    }
  }

  function renderBarChart(container, config, data) {
    var wrapper = container.querySelector('.chart-svg-wrapper');
    var width = wrapper.clientWidth || 600;
    var height = config.height;
    var yKeys = config.y.split(',').map(function(s) { return s.trim(); });
    var colors = resolveColors(config.color);
    if (colors.length < yKeys.length) {
      var palette = getChartPalette();
      colors = yKeys.map(function(_, i) { return palette[i % palette.length]; });
    }
    var margins = getMargins(config, yKeys);
    var innerWidth = width - margins.left - margins.right;
    var innerHeight = height - margins.top - margins.bottom;

    var xScale = d3.scaleBand()
      .domain(data.map(function(d) { return d[config.x]; }))
      .range([0, innerWidth])
      .padding(0.2);

    var allYValues = [];
    yKeys.forEach(function(k) {
      data.forEach(function(d) { if (d[k] != null) allYValues.push(+d[k]); });
    });
    var yMax = d3.max(allYValues);
    var yScale = d3.scaleLinear()
      .domain([0, yMax * 1.05])
      .range([innerHeight, 0])
      .nice();

    var svg = createSvg(wrapper, width, height);
    var g = svg.append('g').attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

    drawGrid(g, yScale, innerWidth, config);
    drawAxes(g, xScale, yScale, innerHeight, config);
    drawTitle(svg, config, width, margins);
    drawAxisLabels(svg, config, width, height, margins, innerWidth, innerHeight);

    var barWidth = xScale.bandwidth() / yKeys.length;

    yKeys.forEach(function(yKey, seriesIdx) {
      var color = colors[seriesIdx % colors.length];
      var bars = g.selectAll('.bar-' + seriesIdx)
        .data(data)
        .enter().append('rect')
        .attr('x', function(d) { return xScale(d[config.x]) + barWidth * seriesIdx; })
        .attr('width', barWidth)
        .attr('fill', color)
        .attr('opacity', 0.85)
        .attr('rx', 2);

      if (config.animate) {
        bars.attr('y', innerHeight).attr('height', 0)
          .transition().duration(600).ease(d3.easeCubicOut)
          .delay(function(_, i) { return i * 20; })
          .attr('y', function(d) { return yScale(+d[yKey]); })
          .attr('height', function(d) { return innerHeight - yScale(+d[yKey]); });
      } else {
        bars.attr('y', function(d) { return yScale(+d[yKey]); })
          .attr('height', function(d) { return innerHeight - yScale(+d[yKey]); });
      }
    });

    drawLegend(container, yKeys, colors);

    if (config.tooltip) {
      var tip = createTooltip(container);
      g.selectAll('rect').filter(function() {
        return !d3.select(this).classed('chart-grid');
      }).on('mouseenter', function(event, d) {
        d3.select(this).attr('opacity', 1);
        var html = '<div class="tooltip-label">' + d[config.x] + '</div>';
        yKeys.forEach(function(k, i) {
          var c = colors[i % colors.length];
          html += '<div class="tooltip-value" style="color:' + c + '">' + k + ': ' + formatValue(+d[k]) + '</div>';
        });
        var containerRect = container.getBoundingClientRect();
        var coords = d3.pointer(event, wrapper);
        showTooltip(tip, html, coords[0], coords[1], {
          width: containerRect.width,
          height: containerRect.height
        });
      }).on('mouseleave', function() {
        d3.select(this).attr('opacity', 0.85);
        hideTooltip(tip);
      });
    }
  }

  function renderAreaChart(container, config, data) {
    var wrapper = container.querySelector('.chart-svg-wrapper');
    var width = wrapper.clientWidth || 600;
    var height = config.height;
    var yKeys = config.y.split(',').map(function(s) { return s.trim(); });
    var colors = resolveColors(config.color);
    if (colors.length < yKeys.length) {
      var palette = getChartPalette();
      colors = yKeys.map(function(_, i) { return palette[i % palette.length]; });
    }
    var margins = getMargins(config, yKeys);
    var innerWidth = width - margins.left - margins.right;
    var innerHeight = height - margins.top - margins.bottom;

    var xType = detectXType(data, config.x, config);
    var xAccessor = function(d) {
      if (xType === 'time') {
        return d[config.x] instanceof Date ? d[config.x] : parseDate(String(d[config.x]), config.dateFormat);
      }
      return +d[config.x];
    };

    var xScale;
    if (xType === 'time') {
      xScale = d3.scaleTime().domain(d3.extent(data, xAccessor)).range([0, innerWidth]);
    } else {
      xScale = d3.scaleLinear().domain(d3.extent(data, xAccessor)).range([0, innerWidth]).nice();
    }

    var allYValues = [];
    yKeys.forEach(function(k) {
      data.forEach(function(d) { if (d[k] != null) allYValues.push(+d[k]); });
    });
    var yMin = d3.min(allYValues);
    var yMax = d3.max(allYValues);
    var yPad = (yMax - yMin) * 0.08;
    var yScale = d3.scaleLinear()
      .domain([Math.min(0, yMin - yPad), yMax + yPad])
      .range([innerHeight, 0])
      .nice();

    var svg = createSvg(wrapper, width, height);
    var g = svg.append('g').attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

    drawGrid(g, yScale, innerWidth, config);
    drawAxes(g, xScale, yScale, innerHeight, config);
    drawTitle(svg, config, width, margins);
    drawAxisLabels(svg, config, width, height, margins, innerWidth, innerHeight);

    var curveMap = {
      'linear': d3.curveLinear,
      'monotone': d3.curveMonotoneX,
      'step': d3.curveStep,
      'basis': d3.curveBasis,
    };
    var curveFn = curveMap[config.curve] || d3.curveMonotoneX;

    yKeys.forEach(function(yKey, seriesIdx) {
      var color = colors[seriesIdx % colors.length];

      var areaGen = d3.area()
        .x(function(d) { return xScale(xAccessor(d)); })
        .y0(innerHeight)
        .y1(function(d) { return yScale(+d[yKey]); })
        .curve(curveFn)
        .defined(function(d) { return d[yKey] != null && !isNaN(+d[yKey]); });

      var lineGen = d3.line()
        .x(function(d) { return xScale(xAccessor(d)); })
        .y(function(d) { return yScale(+d[yKey]); })
        .curve(curveFn)
        .defined(function(d) { return d[yKey] != null && !isNaN(+d[yKey]); });

      var area = g.append('path')
        .datum(data)
        .attr('fill', color)
        .attr('fill-opacity', 0.15)
        .attr('d', areaGen);

      var line = g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('d', lineGen);

      if (config.animate) {
        var clipId = 'clip-' + container.id + '-' + seriesIdx;
        svg.append('defs').append('clipPath').attr('id', clipId)
          .append('rect')
          .attr('x', margins.left)
          .attr('y', 0)
          .attr('height', height)
          .attr('width', 0)
          .transition().duration(800).ease(d3.easeCubicOut)
          .attr('width', innerWidth + margins.right);

        area.attr('clip-path', 'url(#' + clipId + ')');
        line.attr('clip-path', 'url(#' + clipId + ')');
      }
    });

    drawLegend(container, yKeys, colors);

    if (config.tooltip) {
      var tip = createTooltip(container);
      var bisector = d3.bisector(function(d) { return xAccessor(d); }).left;
      var overlay = g.append('rect')
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr('fill', 'none')
        .attr('pointer-events', 'all');

      var theme = getThemeColors();
      var hoverLine = g.append('line')
        .attr('stroke', theme.axis)
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', '3,3')
        .attr('y1', 0)
        .attr('y2', innerHeight)
        .style('opacity', 0);

      overlay.on('mousemove', function(event) {
        var coords = d3.pointer(event);
        var x0 = xScale.invert ? xScale.invert(coords[0]) : null;
        if (x0 === null) return;
        var idx = bisector(data, x0, 1);
        var d0 = data[idx - 1];
        var d1 = data[idx];
        if (!d0 && !d1) return;
        var d = !d0 ? d1 : !d1 ? d0 : (x0 - xAccessor(d0) > xAccessor(d1) - x0 ? d1 : d0);

        var xPos = xScale(xAccessor(d));
        hoverLine.attr('x1', xPos).attr('x2', xPos).style('opacity', 1);

        var html = '<div class="tooltip-label">' + formatValue(xAccessor(d)) + '</div>';
        yKeys.forEach(function(k, i) {
          var c = colors[i % colors.length];
          html += '<div class="tooltip-value" style="color:' + c + '">' + k + ': ' + formatValue(+d[k]) + '</div>';
        });
        var containerRect = container.getBoundingClientRect();
        showTooltip(tip, html, xPos + margins.left, coords[1] + margins.top, {
          width: containerRect.width,
          height: containerRect.height
        });
      });

      overlay.on('mouseleave', function() {
        hideTooltip(tip);
        hoverLine.style('opacity', 0);
      });
    }
  }

  // --- Main render dispatcher ---

  function renderChart(container, config, data) {
    var renderers = {
      'line': renderLineChart,
      'scatter': renderScatterChart,
      'bar': renderBarChart,
      'area': renderAreaChart,
    };
    var fn = renderers[config.type] || renderLineChart;
    fn(container, config, data);
    activeCharts[container.id] = { config: config, data: data };
  }

  function fetchData(source) {
    if (dataCache[source]) {
      return Promise.resolve(dataCache[source]);
    }
    return fetch(source).then(function(resp) {
      if (!resp.ok) throw new Error('Failed to load ' + source + ' (' + resp.status + ')');
      var isCSV = source.endsWith('.csv') || source.endsWith('.tsv');
      return isCSV ? resp.text() : resp.json();
    }).then(function(raw) {
      var parsed;
      if (typeof raw === 'string') {
        parsed = d3.csvParse(raw, d3.autoType);
      } else {
        parsed = raw;
      }
      dataCache[source] = parsed;
      return parsed;
    });
  }

  function initChart(container) {
    if (container.getAttribute('data-chart-initialized')) return;
    container.setAttribute('data-chart-initialized', 'true');

    var configStr = container.getAttribute('data-chart-config');
    if (!configStr) return;
    var config;
    try {
      config = JSON.parse(configStr);
    } catch (e) {
      container.querySelector('.chart-loading').outerHTML =
        '<div class="chart-error">Invalid chart configuration</div>';
      return;
    }

    if (config.caption) {
      var cap = container.querySelector('.chart-caption');
      if (cap) cap.textContent = config.caption;
    }

    fetchData(config.source).then(function(data) {
      var loading = container.querySelector('.chart-loading');
      if (loading) loading.style.display = 'none';
      renderChart(container, config, data);

      var ro = new ResizeObserver(debounce(function() {
        var oldLegend = container.querySelector('.chart-legend');
        if (oldLegend) oldLegend.remove();
        var oldTip = container.querySelector('.chart-tooltip');
        if (oldTip) oldTip.remove();
        renderChart(container, config, data);
      }, 200));
      ro.observe(container);
      resizeObservers[container.id] = ro;
    }).catch(function(err) {
      container.querySelector('.chart-loading').outerHTML =
        '<div class="chart-error">Could not load data from ' + config.source + '</div>';
      console.error('EwanCharts:', err);
    });
  }

  function initAllCharts() {
    if (typeof d3 === 'undefined') return;
    document.querySelectorAll('[data-chart-config]').forEach(function(el) {
      initChart(el);
    });
  }

  function destroyAllCharts() {
    Object.keys(resizeObservers).forEach(function(id) {
      resizeObservers[id].disconnect();
    });
    resizeObservers = {};
    activeCharts = {};
  }

  function reRenderAllCharts() {
    Object.keys(activeCharts).forEach(function(id) {
      var container = document.getElementById(id);
      if (!container) return;
      var info = activeCharts[id];
      var oldLegend = container.querySelector('.chart-legend');
      if (oldLegend) oldLegend.remove();
      var oldTip = container.querySelector('.chart-tooltip');
      if (oldTip) oldTip.remove();
      renderChart(container, info.config, info.data);
    });
  }

  function debounce(fn, ms) {
    var timer;
    return function() {
      clearTimeout(timer);
      timer = setTimeout(fn, ms);
    };
  }

  // --- CalPlot ---

  var calPlotData = {};

  function initCalPlot(containerId, source, initialYear, initialMonth) {
    var container = document.getElementById(containerId);
    if (!container) return;
    if (container.getAttribute('data-calplot-init')) return;
    container.setAttribute('data-calplot-init', 'true');

    var calEl = container.querySelector('.calplot-grid');
    var profileEl = container.querySelector('.calplot-profile');
    var statsEl = container.querySelector('.calplot-day-stats');
    var selectedLabel = container.querySelector('.calplot-selected-label');
    var monthLabel = container.querySelector('.calplot-month-label');
    var shotTabsEl = container.querySelector('.calplot-shot-tabs');
    var prevBtn = container.querySelector('.calplot-prev');
    var nextBtn = container.querySelector('.calplot-next');

    var allData = null;
    var currentYear = initialYear;
    var currentMonth = initialMonth;
    var chart = null;
    var monthNames = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];

    prevBtn.addEventListener('click', function() {
      currentMonth--;
      if (currentMonth < 1) { currentMonth = 12; currentYear--; }
      onMonthChange();
    });
    nextBtn.addEventListener('click', function() {
      currentMonth++;
      if (currentMonth > 12) { currentMonth = 1; currentYear++; }
      onMonthChange();
    });

    fetch(source).then(function(r) { return r.json(); }).then(function(data) {
      allData = data;
      calPlotData[containerId] = { data: data, source: source };
      var loading = container.querySelector('.calplot-loading');
      if (loading) loading.style.display = 'none';
      onMonthChange();
    }).catch(function(err) {
      var loading = container.querySelector('.calplot-loading');
      if (loading) loading.innerHTML = '<div class="chart-error">Failed to load data</div>';
    });

    function getMonthData() {
      var result = {};
      var prefix = currentYear + '-' + String(currentMonth).padStart(2, '0');
      Object.keys(allData).forEach(function(key) {
        if (key.startsWith(prefix)) result[key] = allData[key];
      });
      return result;
    }

    function clearDetail() {
      selectedLabel.textContent = '';
      statsEl.innerHTML = '';
      shotTabsEl.innerHTML = '';
      profileEl.innerHTML = '';
      chart = null;
    }

    function onMonthChange() {
      clearDetail();
      renderCalendar();
      autoSelectLastDay();
    }

    function autoSelectLastDay() {
      var monthData = getMonthData();
      var sorted = Object.keys(monthData).sort();
      var last = sorted[sorted.length - 1];
      if (last && monthData[last]) {
        selectDay(last, monthData[last]);
        var theme = { fg: resolveColor('darkgray') };
        d3.select(calEl).select('g').selectAll('rect').each(function(d) {
          if (d && d.date === last) d3.select(this).attr('stroke', theme.fg).attr('stroke-width', 2);
        });
      }
    }

    function renderCalendar() {
      calEl.innerHTML = '';
      monthLabel.textContent = monthNames[currentMonth - 1] + ' ' + currentYear;

      var monthData = getMonthData();
      var theme = {
        bg: resolveColor('light'), fg: resolveColor('darkgray'), grid: resolveColor('lightgray'),
        empty: resolveColor('lightgray'), low: resolveColor('ochre'), high: resolveColor('rust'),
        text: resolveColor('gray'), accent: resolveColor('sage')
      };

      var daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
      var firstDow = new Date(currentYear, currentMonth - 1, 1).getDay();
      var cellSize = 38;
      var gap = 4;
      var cols = 7;
      var rows = Math.ceil((daysInMonth + firstDow) / 7);
      var width = cols * (cellSize + gap);
      var headerH = 24;
      var height = rows * (cellSize + gap) + headerH;

      var svg = d3.select(calEl).append('svg')
        .attr('width', width).attr('height', height)
        .attr('viewBox', '0 0 ' + width + ' ' + height);

      var dayLabels = ['Su','Mo','Tu','We','Th','Fr','Sa'];
      svg.selectAll('.dow-label').data(dayLabels).enter().append('text')
        .attr('x', function(d,i) { return i * (cellSize + gap) + cellSize / 2; })
        .attr('y', 14).attr('text-anchor', 'middle')
        .attr('fill', theme.text).attr('font-family', 'var(--codeFont)')
        .attr('font-size', '0.65rem').text(function(d) { return d; });

      var maxShots = 1;
      Object.values(monthData).forEach(function(d) {
        var n = d.shots ? d.shots.length : 0;
        if (n > maxShots) maxShots = n;
      });
      var colorScale = d3.scaleLinear()
        .domain([0, 1, maxShots]).range([theme.empty, theme.low, theme.high]);

      var cells = [];
      for (var day = 1; day <= daysInMonth; day++) {
        var dateStr = currentYear + '-' + String(currentMonth).padStart(2,'0') + '-' + String(day).padStart(2,'0');
        var dow = new Date(currentYear, currentMonth - 1, day).getDay();
        var weekRow = Math.floor((day - 1 + firstDow) / 7);
        cells.push({ day: day, date: dateStr, col: dow, row: weekRow, data: monthData[dateStr] || null });
      }

      var g = svg.append('g').attr('transform', 'translate(0,' + headerH + ')');

      g.selectAll('rect').data(cells).enter().append('rect')
        .attr('x', function(d) { return d.col * (cellSize + gap); })
        .attr('y', function(d) { return d.row * (cellSize + gap); })
        .attr('width', cellSize).attr('height', cellSize).attr('rx', 4)
        .attr('fill', function(d) {
          return d.data && d.data.shots ? colorScale(d.data.shots.length) : theme.empty;
        })
        .attr('opacity', function(d) { return d.data && d.data.shots ? 1 : 0.3; })
        .attr('stroke', 'none')
        .attr('cursor', function(d) { return d.data && d.data.shots ? 'pointer' : 'default'; })
        .on('click', function(event, d) {
          if (d.data && d.data.shots) selectDay(d.date, d.data);
          g.selectAll('rect').attr('stroke', 'none').attr('stroke-width', 0);
          if (d.data && d.data.shots) d3.select(this).attr('stroke', theme.fg).attr('stroke-width', 2);
        });

      g.selectAll('.day-num').data(cells).enter().append('text')
        .attr('x', function(d) { return d.col * (cellSize + gap) + cellSize / 2; })
        .attr('y', function(d) { return d.row * (cellSize + gap) + cellSize / 2 + 4; })
        .attr('text-anchor', 'middle')
        .attr('fill', function(d) {
          if (!d.data || !d.data.shots) return theme.text;
          return d.data.shots.length >= maxShots * 0.6 ? theme.bg : theme.fg;
        })
        .attr('font-family', 'var(--codeFont)').attr('font-size', '0.7rem')
        .attr('pointer-events', 'none').text(function(d) { return d.day; });
    }

    function selectDay(dateStr, dayData) {
      var d = new Date(dateStr + 'T00:00:00');
      var label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      var n = dayData.shots.length;
      selectedLabel.textContent = label + ' \u00B7 ' + n + ' shot' + (n > 1 ? 's' : '');

      shotTabsEl.innerHTML = '';
      dayData.shots.forEach(function(shot, idx) {
        var tab = document.createElement('button');
        tab.className = 'calplot-shot-tab';
        tab.textContent = 'Shot ' + (idx + 1) + ' \u00B7 ' + shot.time;
        tab.addEventListener('click', function() {
          shotTabsEl.querySelectorAll('.calplot-shot-tab').forEach(function(t) { t.classList.remove('active'); });
          tab.classList.add('active');
          selectShot(shot);
        });
        shotTabsEl.appendChild(tab);
      });

      // Reset chart so first shot gets fresh render with animation
      chart = null;
      profileEl.innerHTML = '';
      var firstTab = shotTabsEl.querySelector('.calplot-shot-tab');
      if (firstTab) firstTab.classList.add('active');
      if (dayData.shots.length > 0) selectShot(dayData.shots[0]);
    }

    function selectShot(shot) {
      statsEl.innerHTML = '';
      var stats = [
        { label: 'Time', value: shot.time, color: 'slate' },
        { label: 'Rating', value: shot.rating + '/5', color: 'rust' },
        { label: 'EY', value: shot.ey.toFixed(1) + '%', color: 'sage' },
        { label: 'TDS', value: shot.tds.toFixed(2) + '%', color: 'pine' }
      ];
      stats.forEach(function(s) {
        var card = document.createElement('div');
        card.className = 'stat-card';
        card.style.setProperty('--stat-accent', 'var(--' + s.color + ')');
        card.innerHTML = '<div class="stat-card-value">' + s.value + '</div><div class="stat-card-label">' + s.label + '</div>';
        statsEl.appendChild(card);
      });

      var profile = shot.profile;
      if (!profile || !profile.length) {
        profileEl.innerHTML = '<div class="chart-error">No profile data</div>';
        chart = null;
        return;
      }

      if (!chart) {
        renderProfileFresh(profile);
      } else {
        transitionProfile(profile);
      }
    }

    function renderProfileFresh(profile) {
      profileEl.innerHTML = '';
      var theme = {
        bg: resolveColor('light'), fg: resolveColor('darkgray'),
        grid: resolveColor('lightgray'), axis: resolveColor('gray')
      };
      var colors = {
        p: resolveColor('slate'), f: resolveColor('ochre'),
        w: resolveColor('sage'), c: resolveColor('rust')
      };

      var wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      profileEl.appendChild(wrapper);

      var width = profileEl.clientWidth || 600;
      var height = 340;
      var margins = { top: 16, right: 60, bottom: 40, left: 50 };
      var innerW = width - margins.left - margins.right;
      var innerH = height - margins.top - margins.bottom;

      var svg = d3.select(wrapper).append('svg')
        .attr('width', width).attr('height', height)
        .attr('viewBox', '0 0 ' + width + ' ' + height);
      var g = svg.append('g').attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

      var xScale = d3.scaleLinear()
        .domain([0, d3.max(profile, function(d) { return d.t; })]).range([0, innerW]);
      var yLeftMax = Math.max(
        d3.max(profile, function(d) { return d.p; }),
        d3.max(profile, function(d) { return d.f; }) * 3
      ) * 1.1;
      var yLeftScale = d3.scaleLinear().domain([0, yLeftMax]).range([innerH, 0]).nice();
      var yRightMax = d3.max(profile, function(d) { return Math.max(d.w, d.c); }) * 1.05;
      var yRightScale = d3.scaleLinear().domain([0, yRightMax]).range([innerH, 0]).nice();

      var gridG = g.append('g').attr('class', 'chart-grid')
        .call(d3.axisLeft(yLeftScale).tickSize(-innerW).tickFormat('').ticks(5));
      var xAxisG = g.append('g').attr('class', 'chart-axis')
        .attr('transform', 'translate(0,' + innerH + ')')
        .call(d3.axisBottom(xScale).ticks(8).tickFormat(function(d) { return d + 's'; }));
      var yLeftAxisG = g.append('g').attr('class', 'chart-axis')
        .call(d3.axisLeft(yLeftScale).ticks(5));
      var yRightAxisG = g.append('g').attr('class', 'chart-axis')
        .attr('transform', 'translate(' + innerW + ',0)')
        .call(d3.axisRight(yRightScale).ticks(5));

      var curve = d3.curveMonotoneX;
      var pressureLine = d3.line().x(function(d) { return xScale(d.t); }).y(function(d) { return yLeftScale(d.p); }).curve(curve);
      var flowLine = d3.line().x(function(d) { return xScale(d.t); }).y(function(d) { return yLeftScale(d.f * 3); }).curve(curve);
      var weightLine = d3.line().x(function(d) { return xScale(d.t); }).y(function(d) { return yRightScale(d.w); }).curve(curve);
      var tempLine = d3.line().x(function(d) { return xScale(d.t); }).y(function(d) { return yRightScale(d.c); }).curve(curve);

      var pathP = g.append('path').datum(profile).attr('d', pressureLine)
        .attr('fill', 'none').attr('stroke', colors.p).attr('stroke-width', 2.5);
      var pathF = g.append('path').datum(profile).attr('d', flowLine)
        .attr('fill', 'none').attr('stroke', colors.f).attr('stroke-width', 2).attr('stroke-dasharray', '6,3');
      var pathW = g.append('path').datum(profile).attr('d', weightLine)
        .attr('fill', 'none').attr('stroke', colors.w).attr('stroke-width', 2);
      var pathC = g.append('path').datum(profile).attr('d', tempLine)
        .attr('fill', 'none').attr('stroke', colors.c).attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '3,3').attr('opacity', 0.7);

      // Clip-path reveal animation
      var clipId = 'calplot-clip-' + containerId + '-' + Date.now();
      svg.append('defs').append('clipPath').attr('id', clipId)
        .append('rect').attr('x', margins.left).attr('y', 0)
        .attr('height', height).attr('width', 0)
        .transition().duration(600).ease(d3.easeCubicOut)
        .attr('width', innerW + margins.right);
      pathP.attr('clip-path', 'url(#' + clipId + ')');
      pathF.attr('clip-path', 'url(#' + clipId + ')');
      pathW.attr('clip-path', 'url(#' + clipId + ')');
      pathC.attr('clip-path', 'url(#' + clipId + ')');

      // Legend
      var legendData = [
        { label: 'Pressure (bar)', color: colors.p },
        { label: 'Flow x3 (ml/s)', color: colors.f },
        { label: 'Weight (g)', color: colors.w },
        { label: 'Temp (\u00B0C)', color: colors.c }
      ];
      var legend = document.createElement('div');
      legend.className = 'chart-legend';
      legendData.forEach(function(l) {
        var item = document.createElement('span');
        item.className = 'chart-legend-item';
        var swatch = document.createElement('span');
        swatch.className = 'chart-legend-swatch';
        swatch.style.backgroundColor = l.color;
        item.appendChild(swatch);
        item.appendChild(document.createTextNode(l.label));
        legend.appendChild(item);
      });
      wrapper.appendChild(legend);

      // Tooltip
      var tip = document.createElement('div');
      tip.className = 'chart-tooltip';
      wrapper.appendChild(tip);
      var hoverLine = g.append('line')
        .attr('stroke', theme.axis).attr('stroke-width', 0.5)
        .attr('stroke-dasharray', '3,3').attr('y1', 0).attr('y2', innerH).style('opacity', 0);
      var bisector = d3.bisector(function(d) { return d.t; }).left;
      var overlay = g.append('rect')
        .attr('width', innerW).attr('height', innerH)
        .attr('fill', 'none').attr('pointer-events', 'all');

      overlay.on('mousemove', function(event) {
        if (!chart || !chart.profile) return;
        var p = chart.profile;
        var coords = d3.pointer(event);
        var x0 = chart.xScale.invert(coords[0]);
        var idx = bisector(p, x0, 1);
        var d0 = p[idx - 1]; var d1 = p[idx];
        if (!d0 && !d1) return;
        var pt = !d0 ? d1 : !d1 ? d0 : (x0 - d0.t > d1.t - x0 ? d1 : d0);
        var xPos = chart.xScale(pt.t);
        hoverLine.attr('x1', xPos).attr('x2', xPos).style('opacity', 1);
        tip.innerHTML = '<div class="tooltip-label">' + pt.t + 's</div>'
          + '<div class="tooltip-value" style="color:' + colors.p + '">Pressure: ' + pt.p.toFixed(1) + ' bar</div>'
          + '<div class="tooltip-value" style="color:' + colors.f + '">Flow: ' + pt.f.toFixed(1) + ' ml/s</div>'
          + '<div class="tooltip-value" style="color:' + colors.w + '">Weight: ' + pt.w.toFixed(1) + ' g</div>'
          + '<div class="tooltip-value" style="color:' + colors.c + '">Temp: ' + pt.c.toFixed(1) + ' \u00B0C</div>';
        tip.classList.add('visible');
        var left = xPos + margins.left + 12;
        var top = coords[1] + margins.top - 40;
        if (left + 160 > width) left = xPos + margins.left - 170;
        if (top < 5) top = 5;
        tip.style.left = left + 'px';
        tip.style.top = top + 'px';
      });
      overlay.on('mouseleave', function() {
        tip.classList.remove('visible');
        hoverLine.style('opacity', 0);
      });

      chart = {
        svg: svg, g: g, wrapper: wrapper, colors: colors,
        xScale: xScale, yLeftScale: yLeftScale, yRightScale: yRightScale,
        pathP: pathP, pathF: pathF, pathW: pathW, pathC: pathC,
        xAxisG: xAxisG, yLeftAxisG: yLeftAxisG, yRightAxisG: yRightAxisG, gridG: gridG,
        width: width, height: height, margins: margins, innerW: innerW, innerH: innerH,
        profile: profile
      };
    }

    function transitionProfile(profile) {
      var dur = 400;
      var ease = d3.easeCubicInOut;
      var curve = d3.curveMonotoneX;

      // Update scales
      chart.xScale.domain([0, d3.max(profile, function(d) { return d.t; })]);
      var yLeftMax = Math.max(
        d3.max(profile, function(d) { return d.p; }),
        d3.max(profile, function(d) { return d.f; }) * 3
      ) * 1.1;
      chart.yLeftScale.domain([0, yLeftMax]).nice();
      var yRightMax = d3.max(profile, function(d) { return Math.max(d.w, d.c); }) * 1.05;
      chart.yRightScale.domain([0, yRightMax]).nice();

      // Transition axes
      chart.xAxisG.transition().duration(dur).ease(ease)
        .call(d3.axisBottom(chart.xScale).ticks(8).tickFormat(function(d) { return d + 's'; }));
      chart.yLeftAxisG.transition().duration(dur).ease(ease)
        .call(d3.axisLeft(chart.yLeftScale).ticks(5));
      chart.yRightAxisG.transition().duration(dur).ease(ease)
        .call(d3.axisRight(chart.yRightScale).ticks(5));
      chart.gridG.transition().duration(dur).ease(ease)
        .call(d3.axisLeft(chart.yLeftScale).tickSize(-chart.innerW).tickFormat('').ticks(5));

      // Transition paths
      var pLine = d3.line().x(function(d) { return chart.xScale(d.t); }).y(function(d) { return chart.yLeftScale(d.p); }).curve(curve);
      var fLine = d3.line().x(function(d) { return chart.xScale(d.t); }).y(function(d) { return chart.yLeftScale(d.f * 3); }).curve(curve);
      var wLine = d3.line().x(function(d) { return chart.xScale(d.t); }).y(function(d) { return chart.yRightScale(d.w); }).curve(curve);
      var cLine = d3.line().x(function(d) { return chart.xScale(d.t); }).y(function(d) { return chart.yRightScale(d.c); }).curve(curve);

      chart.pathP.datum(profile).transition().duration(dur).ease(ease).attr('d', pLine);
      chart.pathF.datum(profile).transition().duration(dur).ease(ease).attr('d', fLine);
      chart.pathW.datum(profile).transition().duration(dur).ease(ease).attr('d', wLine);
      chart.pathC.datum(profile).transition().duration(dur).ease(ease).attr('d', cLine);

      chart.profile = profile;
    }
  }

  function initAllCalPlots() {
    if (typeof d3 === 'undefined') return;
    document.querySelectorAll('[data-calplot]').forEach(function(el) {
      if (el.getAttribute('data-calplot-init')) return;
      var cfg = JSON.parse(el.getAttribute('data-calplot'));
      initCalPlot(el.id, cfg.source, cfg.year, cfg.month);
    });
  }

  function destroyAllCalPlots() {
    document.querySelectorAll('[data-calplot-init]').forEach(function(el) {
      el.removeAttribute('data-calplot-init');
    });
    calPlotData = {};
  }

  function reRenderAllCalPlots() {
    destroyAllCalPlots();
    initAllCalPlots();
  }


  // --- Lifecycle ---

  function onNav() {
    destroyAllCharts();
    destroyAllCalPlots();
    setTimeout(function() { initAllCharts(); initAllCalPlots(); }, 50);
  }

  document.addEventListener('nav', onNav);
  document.addEventListener('themechange', function() {
    setTimeout(function() { reRenderAllCharts(); reRenderAllCalPlots(); }, 50);
  });

  if (typeof window.addCleanup === 'function') {
    window.addCleanup(function() {
      document.removeEventListener('nav', onNav);
      destroyAllCharts();
      destroyAllCalPlots();
    });
  }

  // Expose namespace
  window.EwanCharts = {
    renderChart: renderChart,
    initAllCharts: initAllCharts,
    initAllCalPlots: initAllCalPlots,
    resolveColor: resolveColor,
    getChartPalette: getChartPalette,
    fetchData: fetchData,
  };

  // Init on first load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { initAllCharts(); initAllCalPlots(); });
  } else {
    setTimeout(function() { initAllCharts(); initAllCalPlots(); }, 50);
  }
})();
`

export const ChartPlugin: QuartzTransformerPlugin = () => ({
  name: "ChartPlugin",

  externalResources() {
    return {
      js: [
        {
          src: "https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js",
          loadTime: "afterDOMReady",
          contentType: "external",
          spaPreserve: true,
        },
        {
          contentType: "inline",
          loadTime: "afterDOMReady",
          spaPreserve: true,
          script: GLOBAL_CHART_SCRIPT,
        },
      ],
      css: [],
    }
  },

  markdownPlugins() {
    return [
      () => (tree: Root, _file) => {
        visit(tree, "code", (node, index, parent) => {
          if (node.lang === "chart" && parent?.children && index !== undefined) {
            const rawConfig = parseYamlConfig(node.value)
            const config = buildConfig(rawConfig)

            if (!config.source || !config.x || !config.y) {
              return
            }

            const id = generateChartId()
            const configJson = JSON.stringify(config).replace(/'/g, "&#39;")

            const htmlContent = `
<figure class="chart-container" id="${id}" data-chart-config='${configJson}'>
  <div class="chart-loading"><div class="chart-loading-spinner"></div></div>
  <div class="chart-svg-wrapper"></div>
  <figcaption class="chart-caption"></figcaption>
</figure>`

            const newNode = { type: "html", value: htmlContent } as any
            parent.children.splice(index, 1, newNode)
            return index + 1
          }
        })
      },
    ]
  },
})
