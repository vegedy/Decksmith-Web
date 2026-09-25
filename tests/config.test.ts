import assert from 'node:assert/strict'
import { test } from 'node:test'
import deck from '../deck.config.ts'
import { pdfEntry, slidevConfig } from '../scripts/config.ts'

test('talk identity and aspect ratio flow into Slidev', () => {
  const config = structuredClone(deck)
  config.meta.title = 'Another talk'
  config.meta.author = 'Another author'
  assert.equal(slidevConfig(config).title, 'Another talk')
  assert.equal(slidevConfig(config).author, 'Another author')
  assert.equal(
    slidevConfig({
      ...config,
      display: { ...config.display, aspectRatio: '4:3' },
    }).aspectRatio,
    4 / 3,
  )
})
test('PDF selection respects appendix inclusion without changing the main deck', () => {
  assert.equal(
    pdfEntry({ ...deck, export: { ...deck.export, includeAppendix: true } }),
    '.export.md',
  )
  assert.equal(
    pdfEntry({ ...deck, export: { ...deck.export, includeAppendix: false } }),
    'slides.md',
  )
})
test('runtime font fetching and remote features are disabled', () => {
  const config = slidevConfig()
  assert.equal(config.fonts.provider, 'none')
  assert.equal(config.monaco, false)
  assert.equal(config.remoteAssets, false)
})
