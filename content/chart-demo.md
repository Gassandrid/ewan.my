---
title: Chart Demo
draft: false
---

## HRV Time Series (Line)

```chart
type: line
source: /static/data/demo-hrv.json
x: date
y: hrv_ms
title: Heart Rate Variability
color: sage
xLabel: Date
yLabel: HRV (ms)
height: 340
```

## HRV + Resting HR (Multi-series Line)

```chart
type: line
source: /static/data/demo-hrv.json
x: date
y: hrv_ms, resting_hr
title: HRV vs Resting Heart Rate
color: sage, rust
xLabel: Date
height: 340
dots: true
```

## Extraction Yield (Scatter)

```chart
type: scatter
source: /static/data/demo-extraction.csv
x: grind_size
y: extraction_yield
title: Grind Size vs Extraction Yield
color: ochre
xLabel: Grind Size (μm)
yLabel: Extraction Yield (%)
height: 360
```

## HRV Area Chart

```chart
type: area
source: /static/data/demo-hrv.json
x: date
y: hrv_ms
title: HRV Trend
color: pine
xLabel: Date
yLabel: HRV (ms)
height: 320
```
