import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { after, test } from 'node:test'
import { validateImage } from '../scripts/assets.ts'
const root = mkdtempSync(resolve(tmpdir(), 'decksmith-assets-'))
const source = resolve(root, 'slides/fixture.md')
mkdirSync(resolve(root, 'public/images'), { recursive: true })
writeFileSync(
  resolve(root, 'public/images/local.svg'),
  '<svg xmlns="http://www.w3.org/2000/svg"/>',
)
after(() => rmSync(root, { recursive: true }))
test('local images resolve from public and relative content paths', () => {
  assert.doesNotThrow(() => validateImage('/images/local.svg', source, root))
  assert.doesNotThrow(() =>
    validateImage('../public/images/local.svg', source, root),
  )
})
test('missing and remote images fail with the source filename', () => {
  assert.throws(
    () => validateImage('/missing.svg', source, root),
    /Missing image:.*fixture/,
  )
  assert.throws(
    () => validateImage('https://example.com/image.svg', source, root),
    /Remote runtime image/,
  )
})
