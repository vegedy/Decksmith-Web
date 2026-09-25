import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readdirSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import deck from '../deck.config.ts'
function run(script: string, args: string[] = []) {
  execFileSync(
    process.execPath,
    ['--experimental-strip-types', `scripts/${script}.ts`, ...args],
    { stdio: 'inherit' },
  )
}
const directory = join(
  mkdtempSync(join(tmpdir(), 'decksmith-starter-')),
  'acceptance-deck',
)
run('new-deck', ['--name', 'acceptance-deck', '--output', directory])
assert.ok(
  readFileSync(`${directory}/deck.config.ts`, 'utf8').includes(
    "title: 'acceptance-deck'",
  ),
)
for (const file of [
  'components/Chart.vue',
  'setup/main.ts',
  'scripts/config.ts',
])
  assert.equal(
    readFileSync(`${directory}/${file}`, 'utf8'),
    readFileSync(file, 'utf8'),
  )
assert.ok(!existsSync(`${directory}/node_modules`))
assert.notEqual(
  spawnSync(process.execPath, [
    '--experimental-strip-types',
    'scripts/new-deck.ts',
    '--name',
    'acceptance-deck',
    '--output',
    directory,
  ]).status,
  0,
)
run('export-png', ['--slide', '1'])
let pointer = JSON.parse(readFileSync('output/latest-png.json', 'utf8')) as {
  directory: string
}
assert.equal(
  readdirSync(`${pointer.directory}/slides`).filter((f) => f.endsWith('.png'))
    .length,
  1,
)
run('export-emergency', ['--images'])
pointer = JSON.parse(readFileSync('output/latest-emergency.json', 'utf8')) as {
  directory: string
}
for (const file of [
  'site/index.html',
  'site/appendix/index.html',
  deck.export.pdfFileName,
  'README.txt',
  'images/manifest.json',
])
  assert.ok(existsSync(`${pointer.directory}/${file}`), file)
const manifest = JSON.parse(
  readFileSync(`${pointer.directory}/images/manifest.json`, 'utf8'),
) as { slides: number[] }
assert.equal(
  readdirSync(`${pointer.directory}/images/slides`).filter((f) =>
    f.endsWith('.png'),
  ).length,
  manifest.slides.length,
)
execFileSync(
  process.execPath,
  ['--experimental-strip-types', 'scripts/smoke.ts'],
  {
    stdio: 'inherit',
    env: { ...process.env, SMOKE_ROOT: `${pointer.directory}/site` },
  },
)
console.log(
  `Starter non-overwrite, isolated content, PNG selection/series and offline emergency package passed. Starter fixture: ${directory}`,
)
