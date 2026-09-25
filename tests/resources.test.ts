import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateResources } from '../scripts/resources.ts'
test('external image/font/script declarations fail with a source diagnostic', () => {
  for (const input of [
    '<img src="https://example.com/a.svg">',
    'a { background: url(//example.com/a.png) }',
    '@import "https://example.com/font.css"',
    '<script src="//example.com/script.js">',
    'import x from "https://example.com/x.js"',
    'fetch("https://example.com/data")',
  ])
    assert.throws(
      () => validateResources(input, 'fixture.vue'),
      /External runtime resource in fixture.vue/,
    )
})
test('local resources and scientific navigation links are permitted', () => {
  validateResources(
    '<img src="/images/a.svg"><a href="https://example.com">Paper</a>',
    'fixture.vue',
  )
})
