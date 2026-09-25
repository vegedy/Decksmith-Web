import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import { load } from '@slidev/parser/fs'
import deck from '../deck.config.ts'
import { scientificManifest } from './science.ts'

// Export fresh output; never pass against a stale PDF.
execFileSync(
  process.execPath,
  ['--experimental-strip-types', 'scripts/export-pdf.ts'],
  { stdio: 'inherit' },
)
const file = `output/${deck.export.pdfFileName}`
const info = execFileSync('pdfinfo', [file], { encoding: 'utf8' })
const text = execFileSync('pdftotext', ['-layout', file, '-'], {
  encoding: 'utf8',
})
const fonts = execFileSync('pdffonts', [file], { encoding: 'utf8' })
const entry = deck.export.includeAppendix ? '.export.md' : 'slides.md'
const data = await load(
  { roots: [resolve('.')], userRoot: resolve('.') },
  resolve(entry),
)
if (deck.export.renderFinalAnimationState)
  assert.equal(Number(info.match(/Pages:\s+(\d+)/)?.[1]), data.slides.length)
assert.ok(
  text.replace(/\s+/g, ' ').includes(deck.meta.title),
  'Title missing from PDF text',
)
assert.ok(!text.includes('undefined'), 'Unresolved content in PDF')
const manifest = await scientificManifest()
if (Object.keys(manifest.equations).length)
  assert.match(
    fonts,
    /KaTeX/,
    'Math fonts must remain embedded text/vector output',
  )
// Verify expected scientific content when the bundled showcase is present.
if (data.slides.some((s) => s.content.includes('id="entropy"'))) {
  for (const expected of [
    'Entropy and notation',
    'Probability of outcome',
    'Traceable figures',
    'Probability domain',
    'Expected information',
    'Takeaway',
    'A Mathematical Theory of Communication',
    '10.1002/j.1538-7305.1948.tb01338.x',
    'Original repository artwork',
    'Accessed 2026-09-25',
    'I(1/2)',
  ])
    assert.ok(
      text.toLowerCase().includes(expected.toLowerCase()),
      `Missing PDF content: ${expected}`,
    )
  assert.ok(
    !text.includes('Enlarge figure'),
    'Interactive chrome leaked into PDF',
  )
  assert.ok(
    !text.includes('Unused records'),
    'Unused bibliography entry leaked into PDF',
  )
}
if (data.slides.some((s) => s.content.includes('Controlled explanation'))) {
  for (const expected of [
    'Then state the conclusion',
    'Trusted local device',
    'Protocol',
    'Illustrative accuracy',
    'Illustrative error',
    'Illustrative latency',
    'Illustrative assessment',
    'Actual',
    'Reviewed',
    'Static fallback',
    'https://sli.dev/',
  ])
    assert.ok(
      text.includes(expected),
      `Missing visualization PDF content: ${expected}`,
    )
  for (const chrome of ['Reset steps', 'Reset comparison', 'Data details'])
    assert.ok(!text.includes(chrome), `Interactive chrome in PDF: ${chrome}`)
}
console.log(
  `PDF regression passed: ${data.slides.length} slides, selectable scientific content and local math fonts.`,
)
