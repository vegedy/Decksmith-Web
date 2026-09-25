import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { resolve } from 'node:path'
import { load } from '@slidev/parser/fs'
import deck from '../deck.config.ts'
import { chromiumPath } from './browser.ts'
import { pdfEntry } from './config.ts'
const args = process.argv.slice(2)
if (
  args.length &&
  (args.length !== 2 || args[0] !== '--slide' || !/^[1-9]\d*$/.test(args[1]!))
)
  throw new Error('Usage: npm run export:png -- [--slide N]')
const entry = pdfEntry()
if (deck.export.includeAppendix)
  writeFileSync(
    entry,
    readFileSync('slides.md', 'utf8') + '\n---\nsrc: ./appendix.md\n---\n',
  )
const data = await load(
  { roots: [resolve('.')], userRoot: resolve('.') },
  resolve(entry),
)
if (args[1] && Number(args[1]) > data.slides.length)
  throw new Error('Slide exceeds deck length')
mkdirSync('output', { recursive: true })
const staging = mkdtempSync('output/png-')
execFileSync(
  'node_modules/.bin/slidev',
  [
    'export',
    entry,
    '--format',
    'png',
    '--output',
    `${staging}/slides`,
    '--with-clicks',
    'false',
    '--executable-path',
    chromiumPath(),
    ...(args[1] ? ['--range', args[1]] : []),
  ],
  { stdio: 'inherit' },
)
// A unique directory prevents stale images from a previous, longer deck.
writeFileSync(
  `${staging}/manifest.json`,
  JSON.stringify(
    {
      slides: args[1] ? [Number(args[1])] : data.slides.map((_, i) => i + 1),
      finalAnimationState: true,
    },
    null,
    2,
  ),
)
writeFileSync('output/latest-png.json', JSON.stringify({ directory: staging }))
console.log(`PNG images: ${staging}/slides`)
