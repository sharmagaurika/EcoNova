const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request(path, options = {}, timeoutMs = 8000) {
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
    return await response.json()
  } finally {
    clearTimeout(timer)
  }
}

export async function checkApiHealth() {
  try {
    return await request('/', { method: 'GET' }, 2500)
  } catch {
    return null
  }
}

export async function parseBank(text) {
  return request('/parse/bank', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
}

export async function parseReceiptText(text) {
  return request('/parse/receipt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
}

export async function parseReceiptImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request('/parse/receipt/image', {
    method: 'POST',
    body: formData,
  }, 20000)
}

export async function logMovement(distanceKm, speedKmh) {
  return request('/log/movement', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ distance_km: distanceKm, speed_kmh: speedKmh }),
  })
}
