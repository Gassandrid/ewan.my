import { ComponentChildren } from "preact"

export interface DataGridProps {
  cols?: number
  children?: ComponentChildren
}

export function DataGrid({ cols = 3, children }: DataGridProps) {
  return (
    <div
      class="data-grid"
      style={`--grid-cols: ${cols}`}
    >
      {children}
    </div>
  )
}
