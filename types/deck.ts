export interface DeckConfig {
  meta: {
    title: string
    subtitle?: string
    author: string
    institution?: string
    date: string
    language: 'de' | 'en'
    version?: string
  }
  display: {
    aspectRatio: '16:9' | '4:3'
    showProgress: boolean
    showSlideNumbers: boolean
    showSourceFooters: boolean
    defaultTheme: 'academic-light'
    footer: string
    colors: {
      canvas: string
      surface: string
      text: string
      muted: string
      primary: string
      accent: string
      warning: string
      danger: string
    }
    fonts: { sans: string; mono: string; math: string }
  }
  export: {
    pdfFileName: string
    includeAppendix: boolean
    renderFinalAnimationState: boolean
    includeNotes: boolean
  }
  citations: {
    style: 'author-year' | 'numeric' | 'short-footnote'
    bibliographyFile: string
  }
}
export interface SlideMetadata {
  title: string
  layout: 'default' | 'title' | 'section' | 'two-column' | 'appendix'
  chapter?: string
  citations?: string[]
  tags?: string[]
  timeBudget?: number
  variant?: string
  appendix?: boolean
}
