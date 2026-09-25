import type { ChartSeries, ChartType } from '../types/visualization.ts'
export function chartDomain(series: ChartSeries[], type: ChartType) {
  if (!series.length || series.some((s) => !s.points.length))
    throw new Error('Chart needs non-empty series')
  const points = series.flatMap((s) => s.points)
  if (points.some((p) => !Number.isFinite(p.x) || !Number.isFinite(p.y)))
    throw new Error('Chart values must be finite')
  if (
    type === 'radar' &&
    (points.some((p) => p.y < 0) ||
      series.some(
        (s) =>
          s.points.length < 3 ||
          s.points.length !== series[0]!.points.length ||
          s.points.some((p, i) => p.label !== series[0]!.points[i]!.label),
      ))
  )
    throw new Error(
      'Radar needs matching labels and at least three non-negative axes',
    )
  const xs = points.map((p) => p.x),
    ys = points.map((p) => p.y)
  const minX = Math.min(...xs),
    maxX = Math.max(...xs)
  const minY = Math.min(0, ...ys),
    maxY = Math.max(0, ...ys)
  return {
    minX,
    maxX: maxX === minX ? minX + 1 : maxX,
    minY,
    maxY: maxY === minY ? minY + 1 : maxY,
  }
}
