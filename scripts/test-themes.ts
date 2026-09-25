import { execFileSync } from 'node:child_process'
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  constants,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join, resolve } from 'node:path'
const root = resolve('.')
const destination = join(
  mkdtempSync(join(tmpdir(), 'decksmith-themes-')),
  'showcase',
)
execFileSync(
  process.execPath,
  [
    '--experimental-strip-types',
    'scripts/new-deck.ts',
    '--name',
    'theme-showcase',
    '--output',
    destination,
  ],
  { stdio: 'inherit' },
)
cpSync(join(root, 'node_modules'), join(destination, 'node_modules'), {
  recursive: true,
  mode: constants.COPYFILE_FICLONE,
  verbatimSymlinks: true,
  filter: (source) =>
    !['.vite', '.vite-temp', '.cache'].includes(basename(source)),
})
const source = readFileSync(`${destination}/deck.config.ts`, 'utf8')
for (const theme of ['academic-light', 'academic-dark', 'minimal-print']) {
  for (const ratio of ['16:9', '4:3']) {
    writeFileSync(
      `${destination}/deck.config.ts`,
      source
        .replace(/defaultTheme: '[^']+'/, `defaultTheme: '${theme}'`)
        .replace(/aspectRatio: '[^']+'/, `aspectRatio: '${ratio}'`),
    )
    for (const command of [
      'build',
      'test:smoke',
      'test:accessibility',
      'test:pdf',
    ])
      execFileSync('npm', ['run', command], {
        cwd: destination,
        stdio: 'inherit',
      })
    const evidence = `output/themes/${theme}-${ratio.replace(':', '-')}`
    mkdirSync(evidence, { recursive: true })
    cpSync(`${destination}/output/smoke`, `${evidence}/smoke`, {
      recursive: true,
    })
    cpSync(
      `${destination}/output/theme-showcase.pdf`,
      `${evidence}/showcase.pdf`,
    )
    console.log(
      `Verified ${theme} ${ratio}: offline browser, narrow viewport, keyboard, contrast, print and PDF.`,
    )
  }
}
