export interface ChartProps {
  id: string
  type: "line" | "scatter" | "bar" | "area"
  source: string
  x: string
  y: string
  title?: string
  caption?: string
  color?: string
  xLabel?: string
  yLabel?: string
  height?: number
  curve?: "linear" | "monotone" | "step"
  dots?: boolean
  grid?: boolean
  animate?: boolean
}

export function Chart(props: ChartProps) {
  const config = JSON.stringify({
    type: props.type,
    source: props.source,
    x: props.x,
    y: props.y,
    title: props.title || "",
    caption: props.caption || "",
    color: props.color || "secondary",
    xLabel: props.xLabel || "",
    yLabel: props.yLabel || "",
    height: props.height || 320,
    xType: "auto",
    yType: "linear",
    curve: props.curve || "monotone",
    dots: props.dots || false,
    grid: props.grid !== false,
    animate: props.animate !== false,
    tooltip: true,
    dateFormat: "",
    tickFormat: "",
  })

  return (
    <figure class="chart-container" id={props.id} data-chart-config={config}>
      <div class="chart-loading">
        <div class="chart-loading-spinner"></div>
      </div>
      <div class="chart-svg-wrapper"></div>
      <figcaption class="chart-caption"></figcaption>
    </figure>
  )
}
