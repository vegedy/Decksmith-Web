/** Text always carries meaning; colors and optional details only supplement it. */
export interface DiagramStep {
  id: string
  label: string
  detail?: string
}
export interface ArchitectureNode extends DiagramStep {
  x: number
  y: number
}
export interface ArchitectureEdge {
  from: string
  to: string
  label: string
}
export interface TrustBoundary {
  id: string
  label: string
  x: number
  y: number
  width: number
  height: number
}
export interface TimelineEvent extends DiagramStep {
  date: string
}
export interface ComparisonColumn {
  key: string
  label: string
}
export interface ComparisonRow {
  label: string
  values: Record<string, string | number>
}
export type ChartType = 'bar' | 'line' | 'scatter' | 'radar'
export interface ChartPoint {
  x: number
  y: number
  label: string
  detail?: string
}
export interface ChartSeries {
  name: string
  points: ChartPoint[]
}
export type MotionPreset =
  | 'fade'
  | 'slide-up'
  | 'slide-left'
  | 'scale-in'
  | 'highlight'
  | 'draw-path'
  | 'stagger'
