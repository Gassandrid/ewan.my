export interface StatCardProps {
  label: string
  value: string
  color?: string
}

export function StatCard({ label, value, color = "secondary" }: StatCardProps) {
  return (
    <div class="stat-card" style={`--stat-accent: var(--${color})`}>
      <div class="stat-card-value">{value}</div>
      <div class="stat-card-label">{label}</div>
    </div>
  )
}
