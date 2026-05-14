export function formatNumber(val) {
  const n = Number(String(val).replace(/,/g, ''))
  if (!val || isNaN(n) || n === 0) return ''
  return n.toLocaleString('ko-KR')
}

export function parseNumber(val) {
  return Number(String(val).replace(/,/g, '')) || 0
}

export function defaultOrderNumber() {
  const now = new Date()
  const yy = String(now.getFullYear()).slice(2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${yy}${mm}-${dd}-00`
}

export function todayDisplay() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd}`
}
