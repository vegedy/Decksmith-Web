import { spawn } from 'node:child_process'
const npmCli = process.env.npm_execpath
if (!npmCli) throw new Error('Run this script with npm run dev.')

const processes = [
  ['slides.md', '3030'],
  ['appendix.md', '3031'],
].map(([entry, port]) =>
  spawn(
    process.execPath,
    [npmCli, 'exec', '--', 'slidev', entry!, '--port', port!, '--remote'],
    { stdio: 'inherit' },
  ),
)
function stop() {
  for (const child of processes) child.kill('SIGTERM')
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
for (const child of processes) {
  child.on('error', (error) => {
    console.error(error)
    process.exitCode = 1
    stop()
  })
  child.on('exit', (code) => {
    if (code) process.exitCode = code
    stop()
  })
}
