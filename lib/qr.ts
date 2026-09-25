import qrcode from 'qrcode-generator'
/** Encode a canonical ASCII URL, including Unicode domains/paths via URL encoding. */
export function qrMatrix(href: string) {
  const url = new URL(href)
  if (!['https:', 'http:', 'mailto:'].includes(url.protocol))
    throw new Error('QrLink expects an absolute HTTP(S) or mailto URL')
  const qr = qrcode(0, 'M')
  qr.addData(url.href)
  qr.make()
  const count = qr.getModuleCount()
  const path: string[] = []
  for (let row = 0; row < count; row++)
    for (let col = 0; col < count; col++)
      if (qr.isDark(row, col)) path.push(`M${col + 4} ${row + 4}h1v1h-1z`)
  return { size: count + 8, path: path.join(''), href: url.href }
}
