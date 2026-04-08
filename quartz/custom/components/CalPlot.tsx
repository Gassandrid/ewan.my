export interface CalPlotProps {
  id: string
  source: string
  year: number
  month: number
}

export function CalPlot({ id, source, year, month }: CalPlotProps) {
  const config = JSON.stringify({ source, year, month })
  return (
    <div class="calplot-container" id={id} data-calplot={config}>
      <div class="calplot-loading">
        <div class="chart-loading-spinner"></div>
      </div>
      <div class="calplot-month-nav">
        <button class="calplot-nav-btn calplot-prev" aria-label="Previous month">
          &#8592;
        </button>
        <span class="calplot-month-label"></span>
        <button class="calplot-nav-btn calplot-next" aria-label="Next month">
          &#8594;
        </button>
      </div>
      <div class="calplot-grid"></div>
      <div class="calplot-detail">
        <div class="calplot-selected-label"></div>
        <div class="calplot-day-stats data-grid" style="--grid-cols: 4"></div>
        <div class="calplot-shot-tabs"></div>
        <div class="calplot-profile"></div>
      </div>
    </div>
  )
}
