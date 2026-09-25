import { defineVitePluginsSetup } from '@slidev/types'
import { scientificManifest } from '../scripts/science.ts'
export default defineVitePluginsSetup(() => [
  {
    name: 'decksmith-science',
    async buildStart() {
      await scientificManifest()
    },
    resolveId(id) {
      if (id === 'virtual:decksmith-science') return '\0' + id
    },
    async load(id) {
      if (id === '\0virtual:decksmith-science')
        return `export default ${JSON.stringify(await scientificManifest())}`
    },
    handleHotUpdate({ server, file }) {
      if (/\.(md|ya?ml|json)$/.test(file)) {
        const module = server.moduleGraph.getModuleById(
          '\0virtual:decksmith-science',
        )
        if (module) server.moduleGraph.invalidateModule(module)
        server.ws.send({ type: 'full-reload' })
      }
    },
  },
])
