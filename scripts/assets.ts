import { existsSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

/** Validate literal image URLs extracted by Slidev, not dynamic component data. */
export function validateImage(url: string, source: string, root: string): void {
  if (/^(?:https?:)?\/\//i.test(url))
    throw new Error(`Remote runtime image is not allowed: ${url} (${source})`)
  if (url.startsWith('data:')) return
  const path = decodeURIComponent(url.split(/[?#]/)[0] ?? '')
  const file = path.startsWith('/')
    ? resolve(root, 'public', `.${path}`)
    : resolve(dirname(source), path)
  if (!existsSync(file) || !statSync(file).isFile())
    throw new Error(`Missing image: ${url} (${source})`)
}
