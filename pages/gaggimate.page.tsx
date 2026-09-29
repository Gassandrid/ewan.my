/** @jsxImportSource react */
import { definePage, PageLink } from "../quartz/custom-pages/api"

export const page = definePage({
  slug: "pages/gaggimate-extractions",
  title: "GaggiMate Extractions",
  description: "Espresso extraction tracking and analysis via GaggiMate",
  tags: ["coffee", "data", "quantified-self"],
  date: "2026-03-28",
  updated: "2026-09-28",
  cssclasses: ["gaggimate-page"],
  hydrate: false,
})

// This composition keeps the existing calendar controller and data intact.
// The compiler owns its page metadata, search text, links and normal Quartz shell.
export default function GaggiMate() {
  const config = { source: "/static/data/gaggimate-calendar.json", year: 2025, month: 2 }
  return (
    <>
      <p>
        Extraction data from a Gaggia Classic Pro with GaggiMate mod. Choose a day to compare
        pressure, flow, weight, and temperature.
      </p>
      <div className="calplot-container" id="gaggimate-cal" data-calplot={JSON.stringify(config)}>
        <div className="calplot-loading">
          <div className="chart-loading-spinner" />
        </div>
        <div className="calplot-month-nav">
          <button className="calplot-nav-btn calplot-prev" aria-label="Previous month">
            ←
          </button>
          <span className="calplot-month-label" />
          <button className="calplot-nav-btn calplot-next" aria-label="Next month">
            →
          </button>
        </div>
        <div className="calplot-grid" />
        <div className="calplot-detail">
          <div className="calplot-selected-label" />
          <div
            className="calplot-day-stats data-grid"
            style={{ "--grid-cols": 4 } as React.CSSProperties}
          />
          <div className="calplot-shot-tabs" />
          <div className="calplot-profile" />
        </div>
      </div>
      <p>
        <PageLink to="thoughts/chart-demo">Chart Demo</PageLink>
      </p>
    </>
  )
}
