import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import {
  collectScience,
  scientificManifest,
  normalizeMath,
  parseReferences,
  withoutExamples,
} from '../scripts/science.ts'
import { formatCitation } from '../lib/citations.ts'
const refs = parseReferences(`
- id: paper
  type: article
  title: Example paper
  authors: [A, B, C]
  year: 2024
- id: image
  type: image
  title: Example figure
`)
function collect(content: string, citations: string[] = []) {
  return collectScience(
    [{ content, frontmatter: { citations }, file: 'fixture.md' }],
    refs,
    process.cwd(),
  )
}
test('collection is stable, deduplicated, separates assets and resolves forward equations', () => {
  const result = collect(
    '<Cite id="paper" /><Cite id="paper" /><Cite id="image" /><EquationRef id="eq" /><Equation id="eq" />',
    ['paper'],
  )
  assert.deepEqual(result.used, ['paper'])
  assert.deepEqual(result.assets, ['image'])
  assert.equal(result.equations.eq, 1)
})
test('invalid references, equations, dynamic keys and missing figures fail with diagnostics', () => {
  for (const [content, message] of [
    ['<Cite id="missing" />', /Unknown reference/],
    [
      '<ImageCompare before="/missing.svg" after="/missing.svg" before-alt="Before" after-alt="After" caption="Comparison" />',
      /Missing image/,
    ],
    [
      '<ImageCompare :before="dynamic" after="/images/documents.svg" />',
      /literal attributes/,
    ],
    ['<source-footer ids="missing" />', /Unknown reference/],
    ['<EquationRef id="missing" />', /Unknown equation/],
    ['<Equation id="eq" /><Equation id="eq" />', /duplicate equation/],
    ['<Cite :id="variable" />', /literal attributes/],
    ['<SourceFooter v-bind="props" />', /literal attributes/],
    ['<Figure src="/missing.svg" alt="a" caption="b" />', /Missing image/],
  ] as const)
    assert.throws(() => collect(content), message)
  assert.throws(() => collect('', ['missing']), /fixture.md.*Unknown reference/)
})
test('code examples and comments are not citations', () => {
  const source =
    '<!-- <Cite id="missing" /> -->\n```vue\n<Cite id="missing" />\n```\n`<Cite id="missing" />`'
  assert.equal(withoutExamples(source).trim(), '')
  assert.deepEqual(collect(source).used, [])
})
test('reference schema validates duplicates, URLs, metadata and authors', () => {
  for (const source of [
    '- {id: a, type: web, title: A}\n- {id: a, type: web, title: B}',
    '- {id: a, type: web, title: A, url: "javascript:alert(1)"}',
    '- {id: a, type: web, title: A, year: yesterday}',
    '- {id: a, type: web, title: A, authors: [42]}',
    '- {id: a, type: web, title: A, license: 42}',
  ])
    assert.throws(() => parseReferences(source))
})
test('all citation formats are deterministic', () => {
  const entry = refs[0]!
  assert.equal(formatCitation(entry, 'author-year', 2), '(A et al., 2024)')
  assert.equal(formatCitation(entry, 'numeric', 2), '[2]')
  assert.equal(
    formatCitation(entry, 'short-footnote', 2),
    '2. A et al., 2024, Example paper',
  )
})
test('specification math delimiters adapt outside code only', () => {
  assert.equal(
    normalizeMath('Inline \\(x\\) and \\[y\\]'),
    'Inline $x$ and \n$$\ny\n$$\n',
  )
  assert.equal(
    normalizeMath('`\\(x\\)`\n```tex\n\\[y\\]\n```'),
    '`\\(x\\)`\n```tex\n\\[y\\]\n```',
  )
})

test('native HTML figure/cite are not mistaken for Vue components', () => {
  assert.deepEqual(
    collect(
      '<figure><figcaption>Caption</figcaption></figure><cite>A title</cite>',
    ).used,
    [],
  )
})

test('entry loader validates imported slide references and missing imports', async () => {
  const root = mkdtempSync(resolve(tmpdir(), 'decksmith-science-'))
  try {
    mkdirSync(resolve(root, 'data'))
    writeFileSync(
      resolve(root, 'data/references.yaml'),
      '- {id: paper, type: article, title: Paper}',
    )
    writeFileSync(
      resolve(root, 'slides.md'),
      '---\nlayout: default\n---\n\n# Main\n\n---\nsrc: ./part.md\n---\n',
    )
    writeFileSync(resolve(root, 'appendix.md'), '# Appendix')
    writeFileSync(resolve(root, 'part.md'), '<Cite id="unknown" />')
    await assert.rejects(scientificManifest(root), /part.md.*Unknown reference/)
    writeFileSync(resolve(root, 'part.md'), '<Cite id="paper" />')
    assert.deepEqual((await scientificManifest(root)).used, ['paper'])
    writeFileSync(resolve(root, 'part.md'), '![Missing image](/missing.svg)')
    await assert.rejects(scientificManifest(root), /Missing image/)
    writeFileSync(resolve(root, 'slides.md'), '---\nsrc: ./missing.md\n---\n')
    await assert.rejects(scientificManifest(root), /missing.md/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
