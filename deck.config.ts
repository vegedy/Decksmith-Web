import type { DeckConfig } from './types/deck.ts'

export default {
  meta: {
    title: 'Weltweite Kassendaten',
    subtitle: 'Lokale Berichte und globale Nachfrageprognosen',
    author: 'Benito Zenz',
    date: `Stand: ${new Intl.DateTimeFormat('de-DE', {
      timeZone: 'Europe/Berlin',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date())}`,
    language: 'de',
    version: '0.1',
  },
  display: {
    aspectRatio: '16:9',
    showProgress: true,
    showSlideNumbers: true,
    showSourceFooters: true,
    defaultTheme: 'academic-light',
    footer: 'Benito Zenz',
    fonts: {
      sans: 'Inter Variable',
      mono: 'JetBrains Mono',
      math: 'KaTeX_Main',
    },
  },
  export: {
    pdfFileName: 'weltweite-kassendaten.pdf',
    includeAppendix: true,
    renderFinalAnimationState: true,
    includeNotes: false,
  },
  citations: {
    style: 'author-year',
    bibliographyFile: 'data/kassendaten-references.yaml',
  },
} as DeckConfig
