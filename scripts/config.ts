import deck from '../deck.config.ts'
import type { DeckConfig } from '../types/deck.ts'

export function slidevConfig(config: DeckConfig = deck) {
  return {
    theme: 'none',
    title: config.meta.title,
    author: config.meta.author,
    titleTemplate: '%s',
    lang: config.meta.language,
    aspectRatio: config.display.aspectRatio === '16:9' ? 16 / 9 : 4 / 3,
    canvasWidth: 980,
    colorSchema: 'light',
    routerMode: 'hash',
    fonts: {
      sans: config.display.fonts.sans,
      mono: config.display.fonts.mono,
      local: [config.display.fonts.sans, config.display.fonts.mono],
      provider: 'none',
    },
    favicon: './favicon.svg',
    remoteAssets: false,
    monaco: false,
    twoslash: false,
    record: false,
    wakeLock: false,
    drawings: { enabled: false },
    browserExporter: false,
    transition: undefined,
    exportFilename: config.export.pdfFileName,
  }
}
export function pdfEntry(config: DeckConfig = deck) {
  return config.export.includeAppendix ? '.export.md' : 'slides.md'
}
