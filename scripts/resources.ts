import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/** Runtime dependency declarations only: normal bibliography/QR hyperlinks are allowed. */
export function validateResources(content: string, source: string) {
  const patterns = [
    /\b(?:src|srcset|poster)\s*=\s*["'][^"']*(?:https?:)?\/\//i,
    /url\(\s*["']?\s*(?:https?:)?\/\//i,
    /@import\s*["'](?:https?:)?\/\//i,
    /\b(?:import|export)\s+(?:[^;\n]*?\sfrom\s*)?["'](?:https?:)?\/\//i,
    /\b(?:fetch|import|Worker)\s*\(\s*["'](?:https?:)?\/\//i,
    /<link\b[^>]*href\s*=\s*["'](?:https?:)?\/\//i,
  ]
  if (patterns.some((pattern) => pattern.test(content)))
    throw new Error(
      `External runtime resource in ${source}; bundle images, fonts and scripts locally`,
    )
}
export function scanResources(root = process.cwd()) {
  const excluded = new Set([
    'node_modules',
    '.git',
    '.slidev',
    'dist',
    'output',
    'docs',
    'tests',
    'scripts',
  ])
  function walk(directory: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (excluded.has(entry.name)) continue
      const file = resolve(directory, entry.name)
      if (entry.isDirectory()) walk(file)
      else if (
        /\.(css|vue|ts|js|html|svg|md)$/.test(entry.name) &&
        !['README.md', 'PLAN.md', 'AGENTS.md'].includes(entry.name)
      ) {
        let content = readFileSync(file, 'utf8')
        if (entry.name.endsWith('.md'))
          content = content.replace(
            /^\s*(`{3,}|~{3,})[^\n]*\n[^]*?^\s*\1\s*$/gm,
            '',
          )
        validateResources(content, file)
      }
    }
  }
  walk(root)
}
