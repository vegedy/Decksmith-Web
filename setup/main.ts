import { defineAppSetup } from '@slidev/types'
import deck from '../deck.config'
export default defineAppSetup(() => {
  const root = document.documentElement
  const printStyle = document.createElement('style')
  const height = 980 / (deck.display.aspectRatio === '16:9' ? 16 / 9 : 4 / 3)
  printStyle.textContent = `@page { size: 980px ${height}px; margin: 0; }`
  document.head.appendChild(printStyle)
  root.dataset.theme = deck.display.defaultTheme
  root.dataset.aspect = deck.display.aspectRatio
  root.lang = deck.meta.language
  for (const [name, value] of Object.entries(deck.display.colors ?? {}))
    root.style.setProperty(
      `--color-${name === 'muted' ? 'text-muted' : name}`,
      value,
    )
  for (const [name, value] of Object.entries(deck.display.fonts))
    root.style.setProperty(`--font-${name}`, `"${value}"`)
})
