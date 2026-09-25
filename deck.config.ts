import type { DeckConfig } from './types/deck.ts'

export default {
  meta: {
    title: 'Ideas, clearly presented.',
    subtitle: 'A local foundation for technical talks',
    author: 'Your Name',
    institution: 'Your Institution',
    date: '2026-09-24',
    language: 'en',
    version: '0.1',
  },
  display: {
    aspectRatio: '16:9',
    showProgress: true,
    showSlideNumbers: true,
    showSourceFooters: true,
    defaultTheme: 'academic-light',
    footer: 'Decksmith Web · Foundation',
    colors: {
      canvas: '#f8fafc',
      surface: '#ffffff',
      text: '#172b3a',
      muted: '#526575',
      primary: '#174e7a',
      accent: '#12665a',
      warning: '#805200',
      danger: '#a12435',
    },
    fonts: {
      sans: 'Inter Variable',
      mono: 'JetBrains Mono',
      math: 'KaTeX_Main',
    },
  },
  export: {
    pdfFileName: 'decksmith-foundation.pdf',
    includeAppendix: true,
    renderFinalAnimationState: true,
    includeNotes: false,
  },
  citations: { style: 'author-year', bibliographyFile: 'data/references.yaml' },
} satisfies DeckConfig
