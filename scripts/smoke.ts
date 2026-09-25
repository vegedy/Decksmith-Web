import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile, stat, mkdir } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'
import { chromium } from 'playwright-chromium'
import { load } from '@slidev/parser/fs'
import deck from '../deck.config.ts'
import { chromiumPath } from './browser.ts'

const root = resolve('dist')
const mime: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.png': 'image/png',
}
const server = createServer(async (req, res) => {
  try {
    let file = resolve(
      root,
      `.${decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname)}`,
    )
    assert.ok(file === root || file.startsWith(root + sep))
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html')
    res.setHeader(
      'Content-Type',
      mime[extname(file)] ?? 'application/octet-stream',
    )
    res.end(await readFile(file))
  } catch {
    res.writeHead(404).end('Not found')
  }
})
await new Promise<void>((done) => server.listen(0, '127.0.0.1', done))
const address = server.address()
assert.ok(address && typeof address === 'object')
const origin = process.env.SMOKE_URL ?? `http://127.0.0.1:${address.port}`
const browser = await chromium.launch({
  executablePath: chromiumPath(),
})
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
  const failures: string[] = []
  const warnings: string[] = []
  page.on('pageerror', (e) => failures.push(e.message))
  page.on('console', (msg) => {
    if (msg.type() === 'error') failures.push(msg.text())
    if (msg.type() === 'warning') warnings.push(msg.text())
  })
  page.on('response', (res) => {
    if (res.status() >= 400) failures.push(`${res.status()} ${res.url()}`)
  })
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url())
    if (
      ['127.0.0.1', 'localhost'].includes(url.hostname) ||
      ['data:', 'blob:'].includes(url.protocol)
    )
      return route.continue()
    failures.push(`External request: ${url}`)
    return route.abort()
  })
  await mkdir('output/smoke', { recursive: true })
  const data = await load(
    { roots: [resolve('.')], userRoot: resolve('.') },
    resolve('slides.md'),
  )
  const total = data.slides.length
  for (let i = 0; i < total; i++) {
    await page.goto(`${origin}/#/${i + 1}`)
    const frame = page.locator(`.slidev-page-${i + 1} .deck-frame`).first()
    await frame.waitFor()
    await page.waitForFunction(() => document.fonts.status === 'loaded')
    if (i === 0)
      assert.equal(await frame.locator('h1').innerText(), deck.meta.title)
    if (deck.display.showSlideNumbers)
      assert.ok(
        (await frame.locator('.deck-footer').innerText()).includes(
          `${i + 1} / ${total}`,
        ),
      )
    assert.equal(
      await page.evaluate(
        (font) => document.fonts.check(`24px "${font}"`),
        deck.display.fonts.sans,
      ),
      true,
    )
    const code = frame.locator('code').first()
    if (await code.count()) {
      assert.ok(
        (await code.evaluate((el) => getComputedStyle(el).fontFamily)).includes(
          deck.display.fonts.mono,
        ),
      )
      assert.equal(
        await page.evaluate(
          (font) => document.fonts.check(`18px "${font}"`),
          deck.display.fonts.mono,
        ),
        true,
      )
    }
    assert.deepEqual(
      await frame
        .locator('img')
        .evaluateAll((imgs) =>
          imgs
            .filter((img) => !(img as HTMLImageElement).naturalWidth)
            .map((img) => img.getAttribute('src')),
        ),
      [],
    )
    const overflow = await frame.evaluate((el) => {
      const footer = el.querySelector('.deck-footer')!.getBoundingClientRect()
      return [...el.querySelectorAll('h1, p, li, img')]
        .filter((child) => child.getBoundingClientRect().bottom > footer.top)
        .map((child) => child.textContent)
    })
    assert.deepEqual(overflow, [], `Content overlaps footer on slide ${i + 1}`)
    await page.screenshot({ path: `output/smoke/slide-${i + 1}.png` })
  }
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(200)
  assert.equal(
    await page
      .locator('.appendix-marker')
      .filter({ hasText: 'Appendix · Optional detail' })
      .count(),
    0,
  )
  await page.goto(`${origin}/#/${total}`)
  const appendixLink = page.locator('[data-deck-target="appendix"]:visible')
  if (await appendixLink.count()) {
    await appendixLink.first().click()
    await page.locator('.appendix-marker:visible').waitFor()
    await page.screenshot({ path: 'output/smoke/appendix.png' })
    await page.locator('[data-deck-target="main"]:visible').first().click()
    await page.locator('.slidev-page-1 .deck-frame').waitFor()
  } else {
    await page.goto(`${origin}/#/1`)
    await page.locator('.slidev-page-1 .deck-frame').waitFor()
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({ path: 'output/smoke/narrow.png' })
  assert.ok(await page.locator('.slidev-page-1 .deck-frame').isVisible())
  assert.deepEqual(failures, [])
  assert.deepEqual(warnings, [])
  console.log(
    `Verified ${total} main slides, appendix links when present, local fonts/assets, narrow viewport and blocked external requests.`,
  )
} finally {
  await browser.close()
  server.close()
}
