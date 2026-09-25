import { defineAppSetup } from '@slidev/types'
import deck from '../deck.config'
export default defineAppSetup(() => {
  const root = document.documentElement
  root.lang = deck.meta.language
  for (const [name, value] of Object.entries(deck.display.colors))
    root.style.setProperty(
      `--color-${name === 'muted' ? 'text-muted' : name}`,
      value,
    )
  for (const [name, value] of Object.entries(deck.display.fonts))
    root.style.setProperty(`--font-${name}`, `"${value}"`)
})
