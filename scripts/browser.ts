import { existsSync } from 'node:fs'
import { chromium } from 'playwright-chromium'

/** Prefer Playwright's matching browser; allow a documented Linux fallback. */
export function chromiumPath(): string {
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH)
    return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  const bundled = chromium.executablePath()
  if (existsSync(bundled)) return bundled
  if (existsSync('/usr/bin/chromium')) return '/usr/bin/chromium'
  throw new Error(
    'Chromium is missing. Run npx playwright install chromium or set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH.',
  )
}
