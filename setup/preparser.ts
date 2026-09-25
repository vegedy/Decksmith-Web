import { definePreparserSetup } from '@slidev/types'
import { normalizeMath } from '../scripts/science.ts'
import { slidevConfig } from '../scripts/config.ts'
export default definePreparserSetup(() => [
  {
    async transformSlide(content, frontmatter: Record<string, unknown>) {
      if (frontmatter.decksmith === true)
        Object.assign(
          frontmatter,
          slidevConfig(),
          process.argv.includes('export-notes')
            ? { routerMode: 'history' }
            : {},
        )
      return normalizeMath(content)
    },
  },
])
