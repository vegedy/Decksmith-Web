import assert from 'node:assert/strict'
import { test } from 'node:test'
import { chartDomain } from '../lib/chart.ts'
import { qrMatrix } from '../lib/qr.ts'
test('chart domains preserve negatives, zero baseline, and constant data', () => {
  const series = [
    {
      name: 'sample',
      points: [
        { x: 2, y: -4, label: 'A' },
        { x: 2, y: 8, label: 'B' },
      ],
    },
  ]
  assert.deepEqual(chartDomain(series, 'bar'), {
    minX: 2,
    maxX: 3,
    minY: -4,
    maxY: 8,
  })
  assert.throws(() => chartDomain([], 'line'), /non-empty/)
  assert.throws(
    () =>
      chartDomain(
        [{ name: 'invalid', points: [{ x: 0, y: NaN, label: 'A' }] }],
        'scatter',
      ),
    /finite/,
  )
  assert.throws(() => chartDomain(series, 'radar'), /matching labels/)
})
test('QR encodes canonical URLs with quiet zone and rejects executable links', () => {
  const code = qrMatrix('https://example.com/ä')
  assert.equal(code.href, 'https://example.com/%C3%A4')
  assert.ok(code.size >= 29)
  assert.ok(code.path.startsWith('M4 4'))
  assert.throws(() => qrMatrix('javascript:alert(1)'), /absolute/)
})
