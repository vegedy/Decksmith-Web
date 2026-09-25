import { spawn } from 'node:child_process'
const processes = [
  ['slides.md', '3030'],
  ['appendix.md', '3031'],
].map(([entry, port]) =>
  spawn('node_modules/.bin/slidev', [entry!, '--port', port!], {
    stdio: 'inherit',
  }),
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
