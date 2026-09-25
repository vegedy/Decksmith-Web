export type CitationStyle = 'author-year' | 'numeric' | 'short-footnote'
export interface ReferenceEntry {
  id: string
  type: 'article' | 'book' | 'web' | 'dataset' | 'image' | 'software'
  authors?: string[]
  year?: number
  title: string
  containerTitle?: string
  publisher?: string
  doi?: string
  url?: string
  accessedAt?: string
  license?: string
}
export interface ScientificManifest {
  references: ReferenceEntry[]
  used: string[]
  assets: string[]
  equations: Record<string, number>
}
export interface NotationEntry {
  symbol: string
  meaning: string
  domain?: string
}
