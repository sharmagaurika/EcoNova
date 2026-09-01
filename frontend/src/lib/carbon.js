/**
 * IPCC / ICAO / DEFRA 2024 emission factors used for client-side estimates.
 * Backend Gemini parsing is preferred when the API is online.
 */

export const TRANSPORT_FACTORS = [
  { mode: 'Walking', minSpeed: 0, maxSpeed: 6, factor: 0.0, signal: 'green' },
  { mode: 'Cycling', minSpeed: 6, maxSpeed: 25, factor: 0.005, signal: 'green' },
  { mode: 'Transit / e-bike', minSpeed: 25, maxSpeed: 60, factor: 0.089, signal: 'gold' },
  { mode: 'Car', minSpeed: 60, maxSpeed: 120, factor: 0.171, signal: 'alert' },
  { mode: 'Train / Highway', minSpeed: 120, maxSpeed: Infinity, factor: 0.041, signal: 'ion' },
]

export const FACTORS = {
  fuelKgPerL: 2.31,
  fuelPricePerL: 1.65,
  rideshareKgPerKm: 0.171,
  rideshareCostPerKm: 1.8,
  groceryKgPerUsd: 0.45,
  amazonKgPerUsd: 0.12,
  fashionKgPerItem: 33,
  fashionAvgPrice: 35,
  streamingKgPerHr: 0.036,
  beefKgPerMeal: 7.2,
  chickenKgPerMeal: 1.8,
  plantKgPerMeal: 0.4,
  shortHaulFlight: 180,
  longHaulFlight: 650,
}

export const QUICK_ACTIONS = [
  { id: 'walk', label: 'Walk the trip', hint: 'Replace a short car hop', kg: -1.8, xp: 70, category: 'transport', kind: 'green' },
  { id: 'bike', label: 'Bike commute', hint: 'Door to door, zero tailpipe', kg: -3.2, xp: 90, category: 'transport', kind: 'green' },
  { id: 'transit', label: 'Public transit', hint: 'Bus, metro, or rail', kg: -1.5, xp: 55, category: 'transport', kind: 'green' },
  { id: 'skip-meat', label: 'Skip meat tonight', hint: 'Plant plate instead of beef', kg: -2.1, xp: 80, category: 'food', kind: 'green' },
  { id: 'wfh', label: 'Remote session', hint: 'Skip the meeting flight', kg: -12, xp: 140, category: 'transport', kind: 'green' },
  { id: 'local', label: 'Buy local / used', hint: 'Skip last-mile logistics', kg: -0.9, xp: 40, category: 'shopping', kind: 'green' },
  { id: 'uber', label: 'Rideshare hop', hint: 'Typical 8 km city trip', kg: 1.4, xp: 10, category: 'transport', kind: 'cost' },
  { id: 'beef', label: 'Beef dinner', hint: 'High-intensity meal', kg: 7.2, xp: 8, category: 'food', kind: 'cost' },
  { id: 'flight', label: 'Long-haul flight', hint: 'IPCC multiplier applied', kg: 650, xp: 5, category: 'transport', kind: 'cost' },
]

const MERCHANT_RULES = [
  { test: /shell|esso|bp|petro|chevron|exxon|gas station|petrol|fuel/i, category: 'transport', kgFromAmount: (usd) => (usd / FACTORS.fuelPricePerL) * FACTORS.fuelKgPerL },
  { test: /uber|lyft|taxi|bolt/i, category: 'transport', kgFromAmount: (usd) => (usd / FACTORS.rideshareCostPerKm) * FACTORS.rideshareKgPerKm },
  { test: /airline|air canada|delta|united|jetblue|flight|airport/i, category: 'transport', kgFromAmount: (usd) => (usd > 250 ? FACTORS.longHaulFlight : FACTORS.shortHaulFlight) },
  { test: /whole foods|grocery|trader joe|safeway|loblaws|walmart|tesco/i, category: 'food', kgFromAmount: (usd) => usd * FACTORS.groceryKgPerUsd },
  { test: /amazon|shopify|parcel|fedex|ups/i, category: 'shopping', kgFromAmount: (usd) => usd * FACTORS.amazonKgPerUsd },
  { test: /nike|zara|h&m|uniqlo|gap|fashion/i, category: 'shopping', kgFromAmount: (usd) => (usd / FACTORS.fashionAvgPrice) * FACTORS.fashionKgPerItem },
  { test: /netflix|spotify|youtube|streaming/i, category: 'digital', kgFromAmount: () => FACTORS.streamingKgPerHr * 2 },
  { test: /steak|beef|burger|ribeye/i, category: 'food', kgFromAmount: () => FACTORS.beefKgPerMeal },
  { test: /chicken|poultry/i, category: 'food', kgFromAmount: () => FACTORS.chickenKgPerMeal },
  { test: /salad|tofu|oat|veg|plant/i, category: 'food', kgFromAmount: () => FACTORS.plantKgPerMeal },
  { test: /restaurant|dining|cafe|starbucks/i, category: 'food', kgFromAmount: (usd) => usd * 0.32 },
]

export function classifyTransport(speedKmh) {
  const speed = Math.max(0, Number(speedKmh) || 0)
  return TRANSPORT_FACTORS.find((entry) => speed >= entry.minSpeed && speed < entry.maxSpeed) ?? TRANSPORT_FACTORS[0]
}

export function transportEmissions(speedKmh, distanceKm) {
  const entry = classifyTransport(speedKmh)
  return {
    mode: entry.mode,
    factorUsed: entry.factor,
    emissionsKg: round4(distanceKm * entry.factor),
    signal: entry.signal,
  }
}

export function haversineKm(a, b) {
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function ratingFor(kg, itemCount = 1) {
  const avg = kg / Math.max(1, itemCount)
  if (avg <= 1) return { label: 'Low intensity', tone: 'green' }
  if (avg <= 5) return { label: 'Moderate intensity', tone: 'gold' }
  return { label: 'High intensity', tone: 'alert' }
}

export function ecoScoreFromMass(weeklyKg) {
  return clamp(Math.round(100 - weeklyKg * 0.46), 12, 99)
}

export function estimateFromText(raw) {
  const text = (raw || '').trim()
  if (!text) {
    return emptyParse('empty')
  }

  const amount = parseAmount(text)
  const rule = MERCHANT_RULES.find((rule) => rule.test.test(text))
  const description = text.split('\n')[0].slice(0, 80) || 'Logged activity'
  const category = rule?.category ?? inferCategory(text)
  const kg = round3(rule ? rule.kgFromAmount(amount || 25) : fallbackKg(text, amount))
  const items = [{ description, category, kg_co2: kg, confidence: rule ? 'medium' : 'low' }]

  const extraLines = text
    .split('\n')
    .slice(1)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 6)

  extraLines.forEach((line) => {
    const nested = estimateFromText(line)
    if (nested.items[0]) items.push(nested.items[0])
  })

  const unique = extraLines.length ? items : items.slice(0, 1)
  const total = round3(unique.reduce((sum, item) => sum + item.kg_co2, 0))
  const rating = ratingFor(total, unique.length)

  return {
    items: unique,
    total_kg_co2: total,
    rating: rating.label,
    tone: rating.tone,
    source: 'local-estimator',
  }
}

export function swapSuggestions(breakdown) {
  const suggestions = []
  if ((breakdown.food ?? 0) >= 8) {
    suggestions.push({
      title: 'Swap 2 beef meals for chicken',
      detail: 'Drops about 11 kg this week — enough to reclaim a podium slot.',
      kg: -10.8,
    })
  }
  if ((breakdown.transport ?? 0) >= 10) {
    suggestions.push({
      title: 'Replace two car hops with transit',
      detail: 'Same commute window, ~3 kg lighter orbital mass.',
      kg: -3.4,
    })
  }
  if ((breakdown.shopping ?? 0) >= 4) {
    suggestions.push({
      title: 'Batch deliveries and buy used',
      detail: 'Cuts last-mile logistics without changing what you actually need.',
      kg: -1.6,
    })
  }
  if (!suggestions.length) {
    suggestions.push({
      title: 'Hold the line',
      detail: 'Your mass is already light. One more green action locks the Supernova.',
      kg: -1.2,
    })
  }
  return suggestions
}

function inferCategory(text) {
  if (/flight|uber|car|bike|train|bus/i.test(text)) return 'transport'
  if (/food|meal|grocery|dinner|lunch/i.test(text)) return 'food'
  if (/shop|amazon|order/i.test(text)) return 'shopping'
  return 'other'
}

function fallbackKg(text, amount) {
  if (/flight/.test(text.toLowerCase())) return amount > 250 ? FACTORS.longHaulFlight : FACTORS.shortHaulFlight
  if (amount) return amount * 0.28
  return 1.2
}

function parseAmount(text) {
  const money = text.replace(/,/g, '').match(/\$\s*(\d+(\.\d+)?)/)
  if (money) return Number(money[1])
  const match = text.replace(/,/g, '').match(/(\d+(\.\d{1,2})?)/)
  return match ? Number(match[1]) : 0
}

function emptyParse(source) {
  return { items: [], total_kg_co2: 0, rating: 'Low intensity', tone: 'green', source }
}

function toRad(value) {
  return (value * Math.PI) / 180
}

export function round3(value) {
  return Math.round(Number(value) * 1000) / 1000
}

export function round4(value) {
  return Math.round(Number(value) * 10000) / 10000
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function breakdownFromLogs(logs) {
  return logs.reduce(
    (acc, log) => {
      const key = log.category || 'other'
      acc[key] = round3((acc[key] || 0) + Math.max(0, log.kg))
      acc.saved = round3((acc.saved || 0) + Math.max(0, -log.kg))
      return acc
    },
    { food: 0, transport: 0, shopping: 0, energy: 0, digital: 0, other: 0, saved: 0 },
  )
}
