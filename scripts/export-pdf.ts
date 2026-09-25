import { spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import deck from '../deck.config.ts'
import { chromiumPath } from './browser.ts'
import { pdfEntry } from './config.ts'
if (!/^[\w.-]+\.pdf$/.test(deck.export.pdfFileName))
  throw new Error('pdfFileName must be a simple .pdf filename')
mkdirSync('output', { recursive: true })
const entry = pdfEntry()
if (deck.export.includeAppendix)
  writeFileSync(
    entry,
    readFileSync('slides.md', 'utf8') + '\n---\nsrc: ./appendix.md\n---\n',
  )
const browser = chromiumPath()
const common = browser ? ['--executable-path', browser] : []
function run(args: string[]) {
  const result = spawnSync('node_modules/.bin/slidev', args, {
    stdio: 'inherit',
  })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}
run([
  'export',
  entry,
  '--output',
  `output/${deck.export.pdfFileName}`,
  '--with-clicks',
  String(!deck.export.renderFinalAnimationState),
  ...common,
  ...process.argv.slice(2),
])
if (deck.export.includeNotes)
  run([
    'export-notes',
    entry,
    '--output',
    `output/${deck.export.pdfFileName.replace(/\.pdf$/, '-notes.pdf')}`,
  ])
