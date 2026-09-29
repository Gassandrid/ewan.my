/** @jsxImportSource react */
import { useState } from "react"
export interface Point {
  x: number
  y: number
  label: string
}
export interface Series {
  name: string
  color: string
  points: Point[]
  dashed?: boolean
}
export function SeriesChart({
  series,
  xLabel,
  yLabel,
  scatter = false,
  area = false,
}: {
  series: Series[]
  xLabel: string
  yLabel: string
  scatter?: boolean
  area?: boolean
}) {
  const [selectedIndex, setSelected] = useState<number | null>(null)
  if (!series.length || series.some((s) => !s.points.length)) return <p>No samples available.</p>
  const selected =
    selectedIndex === null ? null : Math.min(selectedIndex, series[0].points.length - 1)
  const all = series.flatMap((s) => s.points),
    xs = all.map((p) => p.x),
    ys = all.map((p) => p.y)
  const xmin = Math.min(...xs),
    xmax = Math.max(...xs),
    ymin = area ? 0 : Math.floor(Math.min(...ys) * 0.95),
    ymax = Math.ceil(Math.max(...ys) * 1.05)
  const x = (v: number) => 78 + ((v - xmin) / (xmax - xmin || 1)) * 594,
    y = (v: number) => 244 - ((v - ymin) / (ymax - ymin || 1)) * 210
  const line = (p: Point[]) =>
    p.map((p, i) => (i ? "L" : "M") + x(p.x).toFixed(2) + "," + y(p.y).toFixed(2)).join(" ")
  return (
    <figure className="rp-chart">
      <svg viewBox="0 0 700 300" role="img" aria-label={`${yLabel} against ${xLabel}`}>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <g key={t}>
            <line
              x1={78}
              x2={672}
              y1={244 - t * 210}
              y2={244 - t * 210}
              stroke="var(--lightgray)"
            />
            <text x={68} y={248 - t * 210} textAnchor="end">
              {(ymin + t * (ymax - ymin)).toFixed(scatter ? 1 : 0)}
            </text>
          </g>
        ))}
        <text x={78} y={20}>
          {yLabel}
        </text>
        <text x={375} y={292} textAnchor="middle">
          {xLabel}
        </text>
        <text x={78} y={268}>
          {all[0]?.label}
        </text>
        <text x={672} y={268} textAnchor="end">
          {series[0].points.at(-1)?.label}
        </text>
        {series.map((s) => (
          <g key={s.name} style={{ color: `var(--${s.color})` }}>
            {area && (
              <path
                d={line(s.points) + `L${x(s.points.at(-1)!.x)},244 L${x(s.points[0].x)},244 Z`}
                fill="currentColor"
                opacity={0.15}
              />
            )}
            {!scatter && (
              <path
                d={line(s.points)}
                stroke="currentColor"
                strokeWidth={2}
                strokeDasharray={s.dashed ? "6 4" : undefined}
                fill="none"
              />
            )}
            {scatter &&
              s.points.map((p, i) => (
                <circle
                  key={i}
                  cx={x(p.x)}
                  cy={y(p.y)}
                  r={4}
                  fill="currentColor"
                  stroke="var(--darkgray)"
                  strokeWidth={0.75}
                >
                  <title>{`${p.label}: ${p.y}`}</title>
                </circle>
              ))}
            {selected !== null && s.points[selected] && (
              <circle
                cx={x(s.points[selected].x)}
                cy={y(s.points[selected].y)}
                r={4}
                fill="currentColor"
              />
            )}
          </g>
        ))}
      </svg>
      <figcaption>
        {series.map((s) => (
          <span key={s.name}>
            <i style={{ background: `var(--${s.color})` }} />
            {s.name}
            {selected !== null && s.points[selected] ? `: ${s.points[selected].y}` : ""}
          </span>
        ))}
      </figcaption>
      <label className="rp-inspect">
        Inspect sample{" "}
        <input
          type="range"
          min={0}
          max={Math.max(0, series[0].points.length - 1)}
          value={selected ?? 0}
          onChange={(e) => setSelected(+e.target.value)}
        />
        <output>{selected === null ? "—" : series[0].points[selected]?.label}</output>
      </label>
    </figure>
  )
}
