import assert from 'node:assert/strict'
import type { Page } from 'playwright-chromium'

/** Exercise the compiled deck offline, using Slidev navigation rather than a mock. */
export async function verifyInteraction(
  page: Page,
  origin: string,
  slides: { content: string }[],
) {
  const index = (fragment: string) =>
    slides.findIndex((s) => s.content.includes(fragment)) + 1
  const goto = async (n: number) => {
    await page.goto(`${origin}/#/${n}`)
    await page.locator(`.slidev-page-${n} .deck-frame`).waitFor()
    return page.locator(`.slidev-page-${n} .deck-frame`).first()
  }
  if (!index('Controlled explanation')) return
  const revealPage = index('Controlled explanation')
  let frame = await goto(revealPage)
  for (const reducedMotion of ['no-preference', 'reduce'] as const) {
    await page.emulateMedia({ reducedMotion })
    await frame.getByRole('button', { name: 'Reset steps' }).click()
    await frame.locator('h1').click()
    assert.equal(
      await frame.locator('.reveal-gate[aria-hidden="true"]').count(),
      2,
    )
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(350)
    assert.equal(
      await frame.locator('.reveal-gate[aria-hidden="true"]').count(),
      1,
    )
    assert.equal(
      await frame
        .locator('.motion-target')
        .first()
        .evaluate((el) => getComputedStyle(el).opacity),
      '1',
    )
    if (reducedMotion === 'reduce')
      assert.equal(
        await frame
          .locator('.motion-target')
          .first()
          .evaluate((el) => getComputedStyle(el).transform),
        'none',
      )
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(350)
    assert.equal(
      await frame.locator('.reveal-gate[aria-hidden="true"]').count(),
      0,
    )
    await page.keyboard.press('ArrowLeft')
    await page.waitForTimeout(100)
    assert.equal(
      await frame.locator('.reveal-gate[aria-hidden="true"]').count(),
      1,
    )
    await frame.getByRole('button', { name: 'Reset steps' }).click()
    await frame.locator('h1').click()
    await page.screenshot({ path: `output/smoke/reveal-${reducedMotion}.png` })
  }
  const presetsPage = index('Reusable motion vocabulary')
  frame = await goto(presetsPage)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  for (let i = 1; i <= 5; i++) {
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(650)
    assert.equal(
      await frame.locator('.interactive-reveal[data-active="true"]').count(),
      i,
    )
  }
  await page.screenshot({ path: 'output/smoke/motion-final.png' })
  const comparePage = index('Compare before and after')
  frame = await goto(comparePage)
  const slider = frame.getByRole('slider')
  assert.equal(await slider.inputValue(), '50')
  await slider.fill('80')
  assert.match(
    (await frame.locator('.compare-after').getAttribute('style')) ?? '',
    /80%/,
  )
  await slider.press('ArrowRight')
  assert.equal(await slider.inputValue(), '81')
  await frame.getByRole('button', { name: 'Reset comparison' }).click()
  assert.equal(await slider.inputValue(), '50')
  await slider.fill('15')
  await goto(comparePage + 1)
  frame = await goto(comparePage)
  assert.equal(await frame.getByRole('slider').inputValue(), '50')
  await page.screenshot({ path: 'output/smoke/compare-interactive.png' })
  const chartPage = index('Compare measured outcomes')
  frame = await goto(chartPage)
  await frame.locator('summary').click()
  assert.equal(
    await frame
      .locator('details')
      .evaluate((el) => (el as HTMLDetailsElement).open),
    true,
  )
  await goto(chartPage + 1)
  frame = await goto(chartPage)
  assert.equal(
    await frame
      .locator('details')
      .evaluate((el) => (el as HTMLDetailsElement).open),
    false,
  )
  await page.goto(`${origin}/?print=true#/print`)
  await page.locator('#print-content .image-compare').first().waitFor()
  assert.equal(await page.locator('.interaction-controls:visible').count(), 0)
  assert.equal(
    await page.locator('.reveal-gate[aria-hidden="true"]').count(),
    0,
  )
  assert.equal(
    await page.locator('.image-compare:not(.compare-static)').count(),
    0,
  )
  for (const target of await page.locator('.motion-target').all()) {
    assert.equal(
      await target.evaluate((el) => getComputedStyle(el).opacity),
      '1',
    )
  }
  console.log(
    'Interactions passed: native clicks, reverse/reset, motion modes, slider keyboard/reset/re-entry, optional details, static final states.',
  )
}
