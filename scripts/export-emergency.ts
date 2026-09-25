import { execFileSync } from 'node:child_process'
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from 'node:fs'
import deck from '../deck.config.ts'
const args = process.argv.slice(2)
if (args.some((a) => a !== '--images'))
  throw new Error('Usage: npm run export:emergency -- [--images]')
for (const task of [
  'build',
  'export:pdf',
  ...(args.includes('--images') ? ['export:png'] : []),
])
  execFileSync('npm', ['run', task], { stdio: 'inherit' })
mkdirSync('output', { recursive: true })
const destination = mkdtempSync('output/emergency-')
cpSync('dist', `${destination}/site`, { recursive: true })
cpSync(
  `output/${deck.export.pdfFileName}`,
  `${destination}/${deck.export.pdfFileName}`,
)
if (deck.export.includeNotes)
  cpSync(
    `output/${deck.export.pdfFileName.replace(/\.pdf$/, '-notes.pdf')}`,
    `${destination}/notes.pdf`,
  )
if (args.includes('--images')) {
  const { directory } = JSON.parse(
    readFileSync('output/latest-png.json', 'utf8'),
  ) as { directory: string }
  cpSync(directory, `${destination}/images`, { recursive: true })
}
writeFileSync(
  `${destination}/README.txt`,
  `Emergency presentation: ${deck.meta.title}\n\nOpen ${deck.export.pdfFileName} in any PDF viewer, without JavaScript or network.\nFor the interactive website run:\n  python3 -m http.server 8080 --directory site\nThen open http://localhost:8080. No npm or internet required.\nAppendix: http://localhost:8080/appendix/\nThe website uses browser modules and needs HTTP rather than file://.\n`,
)
writeFileSync(
  'output/latest-emergency.json',
  JSON.stringify({ directory: destination }),
)
console.log(`Emergency package: ${destination}`)
