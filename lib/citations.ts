import type { CitationStyle, ReferenceEntry } from '../types/science.ts'
export function authorLabel(entry: ReferenceEntry): string {
  const names = entry.authors ?? []
  if (!names.length) return entry.title
  return names.length > 2 ? `${names[0]} et al.` : names.join(' & ')
}
export function formatCitation(
  entry: ReferenceEntry,
  style: CitationStyle,
  number: number,
): string {
  if (style === 'numeric') return `[${number}]`
  const authorYear = `${authorLabel(entry)}, ${entry.year ?? 'n.d.'}`
  return style === 'short-footnote'
    ? `${number}. ${authorYear}, ${entry.title}`
    : `(${authorYear})`
}
export function referenceLink(entry: ReferenceEntry): string | undefined {
  return entry.doi ? `https://doi.org/${entry.doi}` : entry.url
}
