import assert from 'node:assert/strict'
import type { Page } from 'playwright-chromium'

export async function verifyAccessibility(
  page: Page,
  origin: string,
  total: number,
) {
  await page.goto(`${origin}/?print=true#/print`)
  await page.locator('#print-content .deck-frame').first().waitFor()
  await page.waitForFunction(() => document.fonts.status === 'loaded')
  for (const theme of ['academic-light', 'academic-dark', 'minimal-print']) {
    await page.evaluate((value) => {
      document.documentElement.dataset.theme = value
      document.documentElement.classList.toggle(
        'dark',
        value === 'academic-dark',
      )
    }, theme)
    const contrasts = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement)
      const rgb = (token: string) => {
        const color = style.getPropertyValue(token).trim().replace('#', '')
        const hex =
          color.length === 3 ? [...color].map((c) => c + c).join('') : color
        return [0, 2, 4].map((i) => {
          const n = parseInt(hex.slice(i, i + 2), 16) / 255
          return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4
        })
      }
      const luminance = (token: string) => {
        const c = rgb(token)
        return c[0]! * 0.2126 + c[1]! * 0.7152 + c[2]! * 0.0722
      }
      return ['canvas', 'surface'].flatMap((background) =>
        ['text', 'text-muted', 'primary', 'accent', 'warning', 'danger'].map(
          (foreground) => {
            const a = luminance(`--color-${foreground}`),
              b = luminance(`--color-${background}`)
            return {
              foreground,
              background,
              ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
            }
          },
        ),
      )
    })
    for (const pair of contrasts)
      assert.ok(pair.ratio >= 4.5, `${theme}: ${JSON.stringify(pair)}`)
    const codeRatios = await page
      .locator('.scientific-code pre')
      .evaluateAll((blocks) => {
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = 1
        const ctx = canvas.getContext('2d', { willReadFrequently: true })!
        const luminance = (color: string) => {
          ctx.clearRect(0, 0, 1, 1)
          ctx.fillStyle = color
          ctx.fillRect(0, 0, 1, 1)
          const channels = [...ctx.getImageData(0, 0, 1, 1).data]
            .slice(0, 3)
            .map((n) => {
              const s = n / 255
              return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
            })
          return (
            channels[0]! * 0.2126 +
            channels[1]! * 0.7152 +
            channels[2]! * 0.0722
          )
        }
        return blocks.flatMap((block) => {
          const background = luminance(getComputedStyle(block).backgroundColor)
          return [...block.querySelectorAll('span')]
            .filter((el) => el.children.length === 0 && el.textContent?.trim())
            .map((el) => {
              const style = getComputedStyle(el)
              const foreground = luminance(style.color)
              return {
                text: el.textContent,
                ratio:
                  (Math.max(foreground, background) + 0.05) /
                  (Math.min(foreground, background) + 0.05),
                size: parseFloat(style.fontSize),
              }
            })
        })
      })
    for (const token of codeRatios) {
      assert.ok(
        token.ratio >= 4.5,
        `${theme} code contrast: ${JSON.stringify(token)}`,
      )
      assert.ok(token.size >= 18, `${theme}: code below secondary text size`)
    }
    for (const frame of await page
      .locator('#print-content .deck-frame')
      .all()) {
      const issues = await frame.evaluate((el) => {
        const area = el.getBoundingClientRect()
        const footer = el.querySelector('.deck-footer')!.getBoundingClientRect()
        return [...el.querySelectorAll('h1,p,li,table,figure,svg')]
          .filter((node) => {
            const r = node.getBoundingClientRect()
            return (
              r.width &&
              (r.right > area.right + 1 ||
                r.left < area.left - 1 ||
                r.bottom > footer.top + 1)
            )
          })
          .map((node) => node.className || node.textContent)
      })
      assert.deepEqual(issues, [], `${theme}: layout overflow`)
    }
    for (const slide of [1, Math.min(18, total), Math.min(26, total)]) {
      await page
        .locator(`#print-content .slidev-page-${slide}`)
        .first()
        .screenshot({ path: `output/smoke/${theme}-${slide}.png` })
    }
    console.log(
      `${theme}: all text tokens >= 4.5:1 on canvas/surface; ${total} final layouts fit.`,
    )
  }
  // Check controls in the live route, including their accessible names and keyboard activation.
  for (let slide = 1; slide <= total; slide++) {
    await page.goto(`${origin}/#/${slide}`)
    const frame = page.locator(`.slidev-page-${slide} .deck-frame`).first()
    await frame.waitFor()
    for (const control of await frame
      .locator('button, input, summary, a[href]')
      .all()) {
      if (!(await control.isVisible())) continue
      assert.ok(
        await control.evaluate((el) =>
          (
            el.textContent?.trim() ||
            el.getAttribute('aria-label') ||
            (el as HTMLInputElement).labels?.[0]?.textContent
          )?.trim(),
        ),
        'Unnamed control',
      )
      await control.focus()
      assert.equal(
        await control.evaluate((el) => document.activeElement === el),
        true,
      )
      assert.notEqual(
        await control.evaluate((el) => getComputedStyle(el).outlineStyle),
        'none',
        'Missing keyboard focus indicator',
      )
      if (await control.evaluate((el) => el.tagName === 'SUMMARY')) {
        await control.press('Enter')
        assert.equal(
          await control.evaluate(
            (el) => (el.parentElement as HTMLDetailsElement).open,
          ),
          true,
        )
        await control.press('Enter')
      }
      if (await control.evaluate((el) => el.tagName === 'BUTTON')) {
        await control.press('Enter')
        await page.keyboard.press('Escape')
      }
    }
    for (const image of await frame.locator('img').all())
      assert.ok(await image.getAttribute('alt'), 'Missing image description')
  }
  console.log(
    'Keyboard names, focus, button/details activation and image alternatives passed.',
  )
}
