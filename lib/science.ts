import manifest from 'virtual:decksmith-science'
import deck from '../deck.config'
import { formatCitation } from './citations'
import type { CitationStyle } from '../types/science'
export { manifest }
export function reference(id: string) {
  const entry = manifest.references.find((entry) => entry.id === id)
  if (!entry) throw new Error(`Unknown reference: ${id}`)
  return entry
}
export function citation(
  id: string,
  style: CitationStyle = deck.citations.style,
) {
  const ids = [...new Set([...manifest.used, ...manifest.assets])]
  const number = ids.indexOf(id) + 1
  if (!number) throw new Error(`Reference not declared in deck: ${id}`)
  return formatCitation(reference(id), style, number)
}
