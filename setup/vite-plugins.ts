import { defineVitePluginsSetup } from '@slidev/types'
import { validateImage } from '../scripts/assets.ts'
export default defineVitePluginsSetup(({ data, userRoot }) => [
  {
    name: 'decksmith-foundation-assets',
    buildStart() {
      for (const slide of data.slides)
        for (const url of slide.images ?? [])
          validateImage(url, slide.source.filepath, userRoot)
    },
  },
])
