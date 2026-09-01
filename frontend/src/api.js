const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

let apiOnline = null
let lastProbe = 0

async function request(path, options = {}, timeoutMs = 2500) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
    })
    if (!response.ok) {
      const detail = await response.text()
      throw new Error(detail || `HTTP ${response.status}`)
    }
    apiOnline = true
    lastProbe = Date.now()
    return await response.json()
  } catch (err) {
    apiOnline = false
    lastProbe = Date.now()
    throw err
  } finally {
    clearTimeout(timer)
  }
}

export async function isApiOnline() {
  const fresh = Date.now() - lastProbe < 20000
  if (fresh && apiOnline != null) return apiOnline
  try {
    const data = await request('/', { method: 'GET' }, 1200)
    apiOnline = Boolean(data)
  } catch {
    apiOnline = false
  }
  lastProbe = Date.now()
  return apiOnline
}

export async function checkApiHealth() {
  return (await isApiOnline()) ? { status: 'online' } : null
}

export async function parseBank(text) {
  if (!(await isApiOnline())) throw new Error('offline')
  return request('/parse/bank', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
}

export async function parseReceiptText(text) {
  if (!(await isApiOnline())) throw new Error('offline')
  return request('/parse/receipt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
}

export async function parseReceiptImage(file) {
  if (!(await isApiOnline())) throw new Error('offline')
  const formData = new FormData()
  formData.append('file', file)
  return request('/parse/receipt/image', {
    method: 'POST',
    body: formData,
  }, 8000)
}

export async function logMovement(distanceKm, speedKmh) {
  if (!(await isApiOnline())) return null
  try {
    return await request('/log/movement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ distance_km: distanceKm, speed_kmh: speedKmh }),
    })
  } catch {
    return null
  }
}
