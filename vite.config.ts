import { defineConfig } from 'vite'

export default defineConfig({
  server: { strictPort: true },
  build: { sourcemap: false },
  plugins: [
    {
      name: 'decksmith-reset-layer',
      enforce: 'pre',
      transform(code, id) {
        // Slidev imports this reset unlayered; put it below our semantic layers.
        if (id.endsWith('/@unocss/reset/tailwind.css'))
          return { code: `@layer reset { ${code} }`, map: null }
      },
    },
  ],
})
