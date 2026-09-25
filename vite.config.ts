import { defineConfig } from 'vite'

export default defineConfig({
  server: { strictPort: true },
  // Keep Slidev's native print route without build-time PDF auto-download.
  define: { __SLIDEV_FEATURE_PRINT__: true },
  build: { sourcemap: false },
  plugins: [
    {
      name: 'decksmith-reset-layer',
      enforce: 'pre',
      transform(code, id) {
        // Slidev imports this reset unlayered; put it below our semantic layers.
        if (
          id.endsWith('/@unocss/reset/tailwind.css') ||
          /markdown-it-github-alerts\/styles\/github-colors-.*\.css$/.test(id)
        )
          return { code: `@layer reset { ${code} }`, map: null }
      },
    },
  ],
})
