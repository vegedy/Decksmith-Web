import assert from 'node:assert/strict'
import { test } from 'node:test'
import { resolve } from 'node:path'
import { load } from '@slidev/parser/fs'
import deck from '../deck.config.ts'
import { scientificManifest } from '../scripts/science.ts'

test(
  'active Kassendaten talk has 14 timed slides and a complete four-page appendix',
  {
    skip:
      deck.citations.bibliographyFile !== 'data/kassendaten-references.yaml',
  },
  async () => {
    const options = { roots: [resolve('.')], userRoot: resolve('.') }
    const main = await load(options, resolve('slides.md'))
    const appendix = await load(options, resolve('appendix.md'))
    assert.equal(main.slides.length, 14)
    assert.equal(appendix.slides.length, 4)
    assert.equal(
      main.slides.reduce(
        (sum, slide) => sum + Number(slide.frontmatter.timeBudget),
        0,
      ),
      900,
    )
    for (const slide of main.slides) {
      assert.ok(slide.note?.trim(), 'Every main slide needs presenter notes')
      assert.ok(Number(slide.frontmatter.timeBudget) > 0)
    }
    for (const slide of appendix.slides) {
      assert.equal(slide.frontmatter.appendix, true)
      assert.ok(
        !/^src:/m.test(slide.content),
        'Imports must not become visible slide content',
      )
    }
    const references = appendix.slides.filter((s) =>
      s.content.includes('<ReferencesSlide'),
    )
    assert.equal(references.length, 3)
    assert.ok(references.every((s) => s.content.includes(':limit="3"')))
    const manifest = await scientificManifest()
    assert.equal(manifest.used.length, 8)
  },
)
