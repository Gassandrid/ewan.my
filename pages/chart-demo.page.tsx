/** @jsxImportSource react */
import { useState } from "react"
import { definePage, PageLink, Section, type PageProps } from "../quartz/custom-pages/api"
import { SeriesChart, type Series } from "./components/SeriesChart"
import "./chart-demo.css"
export const page = definePage({
  slug: "thoughts/chart-demo",
  title: "Chart Demo",
  description: "Interactive line, area and scatter plots using the website's shared palette.",
  tags: ["art/design", "data"],
  aliases: ["chart-demo"],
  date: "2026-03-28T14:04:15-04:00",
  updated: "2026-09-28",
  replaces: ["Thoughts/Chart Demo.md", "chart-demo.md"],
})
type Data = {
  hrv: { date: string; hrv_ms: number; resting_hr: number }[]
  extraction: { grind_size: number; extraction_yield: number }[]
}
export default function ChartDemo({ data }: PageProps<Data>) {
  const [window, setWindow] = useState("all"),
    [compare, setCompare] = useState(true)
  const rows = window === "all" ? data.hrv : data.hrv.slice(-Number(window))
  const series = (
    key: "hrv_ms" | "resting_hr",
    name: string,
    color: string,
    dashed = false,
  ): Series => ({
    name,
    color,
    dashed,
    points: rows.map((r, i) => ({ x: i, y: r[key], label: r.date })),
  })
  return (
    <div className="rp-chart-demo">
      <div className="rp-chart-controls">
        <label>
          Time window{" "}
          <select value={window} onChange={(e) => setWindow(e.target.value)}>
            <option value="all">All samples</option>
            <option value="30">Last 30</option>
            <option value="14">Last 14</option>
          </select>
        </label>
        <span>{rows.length} samples · demonstration data</span>
      </div>
      <Section id="hrv-time-series-line" title="HRV time series">
        <SeriesChart series={[series("hrv_ms", "HRV", "pine")]} xLabel="Date" yLabel="HRV (ms)" />
      </Section>
      <Section id="hrv--resting-hr-multi-series-line" title="HRV and resting heart rate">
        <label className="rp-toggle">
          <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} />
          Show resting heart rate
        </label>
        <SeriesChart
          series={[
            series("hrv_ms", "HRV (ms)", "pine"),
            ...(compare ? [series("resting_hr", "Resting HR (beats/min)", "rust", true)] : []),
          ]}
          xLabel="Date"
          yLabel="Value (series units)"
        />
      </Section>
      <Section id="extraction-yield-scatter" title="Extraction yield">
        <SeriesChart
          scatter
          series={[
            {
              name: "Extraction yield",
              color: "ochre",
              points: data.extraction.map((r) => ({
                x: r.grind_size,
                y: r.extraction_yield,
                label: String(r.grind_size),
              })),
            },
          ]}
          xLabel="Grind size (µm)"
          yLabel="Extraction yield (%)"
        />
      </Section>
      <Section id="hrv-area-chart" title="HRV area chart">
        <SeriesChart
          area
          series={[series("hrv_ms", "HRV", "pine")]}
          xLabel="Date"
          yLabel="HRV (ms)"
        />
      </Section>
      <p>
        <PageLink to="pages/gaggimate-extractions">GaggiMate Extractions</PageLink> ·{" "}
        <PageLink to="pages/morris-lecar">Morris–Lecar Phase Plane</PageLink>
      </p>
    </div>
  )
}
