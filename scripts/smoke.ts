import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
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
    await page.screenshot({ path: `output/smoke/slide-${i + 1}.png` })
    assert.deepEqual(overflow, [], `Content overlaps footer on slide ${i + 1}`)
    assert.equal(await frame.locator('.katex-error').count(), 0)
    const bounds = await frame.evaluate((el) => {
      const area = el.getBoundingClientRect()
      const footer = el.querySelector('.deck-footer')!.getBoundingClientRect()
      return [
        ...el.querySelectorAll(
          '.equation, .katex-html, .notation-table, .source-footer, .scientific-code, .scientific-figure, .callout, .takeaway, .references-list',
        ),
      ]
        .filter((node) => {
          const rect = node.getBoundingClientRect()
          return (
            rect.width &&
            (rect.right > area.right + 1 ||
              rect.left < area.left - 1 ||
              rect.bottom > footer.top + 1)
          )
        })
        .map((node) => node.className)
    })
    assert.deepEqual(
      bounds,
      [],
      `Scientific content overflow on slide ${i + 1}`,
    )
    const hiddenSteps = frame.locator('.equation .slidev-vclick-hidden')
    if (await hiddenSteps.count()) {
      await page.keyboard.press('ArrowRight')
      await page.waitForTimeout(100)
      assert.equal(
        await frame.locator('.equation .slidev-vclick-hidden').count(),
        0,
      )
      await page.keyboard.press('ArrowLeft')
      await page.waitForTimeout(100)
      assert.ok(await frame.locator('.equation .slidev-vclick-hidden').count())
    }
    const zoom = frame.locator('.figure-zoom')
    if (await zoom.count()) {
      await zoom.click()
      assert.ok(
        await frame
          .locator('dialog')
          .evaluate((el) => (el as HTMLDialogElement).open),
      )
      await page.keyboard.press('Escape')
      assert.equal(
        await frame
          .locator('dialog')
          .evaluate((el) => (el as HTMLDialogElement).open),
        false,
      )
      await zoom.click()
      await page.goto(`${origin}/#/${i + 2}`)
      await page.waitForTimeout(100)
      assert.equal(await page.locator('dialog[open]').count(), 0)
      await page.goto(`${origin}/#/${i + 1}`)
    }
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
  if (!process.env.SMOKE_URL) {
    await page.goto(`${origin}/?print=true#/print`)
    await page.waitForFunction(
      (count) =>
        document.querySelectorAll('#print-content .deck-frame').length ===
        count,
      total,
    )
    await page.waitForFunction(() => document.fonts.status === 'loaded')
    assert.equal(await page.locator('.deck-frame').count(), total)
    assert.equal(
      await page
        .locator(
          '.figure-zoom:visible, .slidev-nav:visible, .deck-progress:visible',
        )
        .count(),
      0,
    )
    assert.equal(await page.locator('.katex-error').count(), 0)
    for (const frame of await page.locator('.deck-frame').all()) {
      const overflow = await frame.evaluate((el) => {
        const footer = el.querySelector('.deck-footer')!.getBoundingClientRect()
        const area = el.getBoundingClientRect()
        return [
          ...el.querySelectorAll(
            'h1, p, li, .equation, .katex-html, .notation-table, .source-footer, .scientific-code, .scientific-figure, .callout, .takeaway',
          ),
        ]
          .filter((node) => {
            const r = node.getBoundingClientRect()
            return (
              r.width && (r.bottom > footer.top + 1 || r.right > area.right + 1)
            )
          })
          .map((node) => node.className || node.textContent)
      })
      assert.deepEqual(overflow, [], 'Print content overflow')
    }
    await page.emulateMedia({ media: 'print' })
    await page.pdf({
      path: 'output/smoke/browser-print.pdf',
      preferCSSPageSize: true,
      printBackground: true,
    })
    const printInfo = execFileSync(
      'pdfinfo',
      ['output/smoke/browser-print.pdf'],
      { encoding: 'utf8' },
    )
    assert.equal(
      Number(printInfo.match(/Pages:\s+(\d+)/)?.[1]),
      total,
      'Browser print page count',
    )
    await page.emulateMedia({ media: 'screen' })
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
