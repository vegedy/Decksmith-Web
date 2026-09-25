import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs'
import { resolve } from 'node:path'
const args = process.argv.slice(2)
const name = args[args.indexOf('--name') + 1]
const outputIndex = args.indexOf('--output')
if (
  !args.includes('--name') ||
  !name ||
  !/^[a-z][a-z0-9-]*$/.test(name) ||
  args.length !== (outputIndex >= 0 ? 4 : 2)
)
  throw new Error(
    'Usage: npm run new:deck -- --name seminar-ml [--output /path/to/new-directory]',
  )
const destination = resolve(
  outputIndex >= 0 ? args[outputIndex + 1]! : `output/decks/${name}`,
)
if (existsSync(destination))
  throw new Error(`Refusing to overwrite ${destination}`)
mkdirSync(destination, { recursive: true })
const excluded = new Set([
  '.git',
  'node_modules',
  'dist',
  'output',
  '.slidev',
  '.export.md',
  'components.d.ts',
])
for (const entry of readdirSync('.')) {
  if (!excluded.has(entry) && !entry.endsWith('.log'))
    cpSync(entry, `${destination}/${entry}`, { recursive: true })
}
const config = readFileSync('deck.config.ts', 'utf8')
  .replace(/title: '[^']*'/, `title: '${name}'`)
  .replace(/pdfFileName: '[^']*'/, `pdfFileName: '${name}.pdf'`)
writeFileSync(`${destination}/deck.config.ts`, config)
const pkg = JSON.parse(readFileSync(`${destination}/package.json`, 'utf8')) as {
  name: string
}
pkg.name = name
writeFileSync(
  `${destination}/package.json`,
  JSON.stringify(pkg, null, 2) + '\n',
)
const lock = JSON.parse(
  readFileSync(`${destination}/package-lock.json`, 'utf8'),
) as { name: string; packages: Record<string, { name: string }> }
lock.name = name
lock.packages['']!.name = name
writeFileSync(
  `${destination}/package-lock.json`,
  JSON.stringify(lock, null, 2) + '\n',
)
console.log(
  `Created ${destination}\nRun npm install, edit deck.config.ts and slides/*.md, then npm run dev.\nThe complete showcase is included as editable examples.`,
)
