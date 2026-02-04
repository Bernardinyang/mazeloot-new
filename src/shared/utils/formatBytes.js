const BYTES_UNITS = [
  [1e12, 'TB'],
  [1e9, 'GB'],
  [1e6, 'MB'],
  [1e3, 'KB'],
  [1, 'B'],
]

/**
 * @param {number | string | null} bytes
 * @returns {string} e.g. "5.00 GB", "1.50 MB", "0 B", "—"
 */
export function formatBytes(bytes) {
  if (bytes == null || bytes === '' || Number.isNaN(Number(bytes)) || bytes < 0) return '—'
  const n = Number(bytes)
  if (n === 0) return '0 B'
  for (const [size, unit] of BYTES_UNITS) {
    if (n >= size) return `${(n / size).toFixed(2)} ${unit}`
  }
  return `${n} B`
}
