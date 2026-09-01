export function formatKg(value, { signed = true } = {}) {
  const n = Number(value) || 0
  const abs = Math.abs(n)
  const body = abs >= 100 ? abs.toFixed(0) : abs >= 10 ? abs.toFixed(1) : abs.toFixed(1)
  if (!signed) return `${body} kg`
  if (n > 0) return `+${body} kg`
  if (n < 0) return `−${body} kg`
  return `${body} kg`
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value)
}

export function relativeTime(iso) {
  const delta = Date.now() - new Date(iso).getTime()
  const minutes = Math.round(delta / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}
