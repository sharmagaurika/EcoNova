import React, { useState } from 'react'
import { estimateFromText, ratingFor, round3 } from '../lib/carbon'
import { parseBank, parseReceiptImage, parseReceiptText } from '../api'
import { newId, useStore } from '../lib/store'
import { formatKg } from '../lib/format'

const SAMPLES = [
  { label: 'Grocery list', text: 'Whole Foods Market\nOat milk 1L $3.49\nSourdough $4.50\nCheddar 200g $5.99' },
  { label: 'Gas station', text: 'Shell Service Station $55.00' },
  { label: 'Flight ticket', text: 'Air Canada YYZ to LHR $860.00' },
]

export default function CarbonLogger() {
  const { dispatch } = useStore()
  const [mode, setMode] = useState('transaction')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [receiptText, setReceiptText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [source, setSource] = useState('')

  const commit = (parsed, label) => {
    const total = round3(parsed.total_kg_co2 || 0)
    const rating = parsed.rating || ratingFor(total, parsed.items?.length || 1).label
    setResult({ ...parsed, total_kg_co2: total, rating })
    dispatch({
      type: 'add-log',
      log: {
        id: newId('ai'),
        name: label,
        kg: total,
        category: parsed.items?.[0]?.category || 'other',
        type: 'parse',
        at: new Date().toISOString(),
      },
    })
  }

  const runParse = async (kind, payload) => {
    setBusy(true)
    setError('')
    try {
      let parsed
      if (kind === 'bank') {
        try {
          parsed = await parseBank(payload)
          setSource('Estimated with Gemini')
        } catch {
          parsed = estimateFromText(payload)
          setSource('Estimated on this device (API offline)')
        }
        commit(parsed, name || parsed.items?.[0]?.description || 'Purchase')
      } else if (kind === 'text') {
        try {
          parsed = await parseReceiptText(payload)
          setSource('Estimated with Gemini')
        } catch {
          parsed = estimateFromText(payload)
          setSource('Estimated on this device (API offline)')
        }
        commit(parsed, 'Receipt')
      } else {
        try {
          parsed = await parseReceiptImage(payload)
          setSource('Read from photo with Gemini')
          commit(parsed, payload.name || 'Receipt photo')
        } catch (err) {
          setError('Photo reading needs the backend. Paste the receipt text or try a sample.')
          throw err
        }
      }
    } catch (err) {
      setError(err.message || 'Could not estimate this one')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card p-6">
      <p className="font-semibold">Add a purchase</p>
      <p className="mt-1 text-sm text-mute">
        Type a store and amount, or paste a receipt. We guess the CO₂ from what you bought.
      </p>

      <div className="mt-4 inline-flex rounded-full border border-line p-1">
        {['transaction', 'receipt'].map((item) => (
          <button
            key={item}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === item ? 'bg-ink text-paper' : 'text-mute'}`}
            onClick={() => setMode(item)}
          >
            {item === 'transaction' ? 'Store + amount' : 'Receipt'}
          </button>
        ))}
      </div>

      {mode === 'transaction' ? (
        <form
          className="mt-4 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            runParse('bank', `Transaction: ${name}, Amount: ${amount}`)
          }}
        >
          <input className="field" placeholder="Where? e.g. Shell, Whole Foods" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="field" placeholder="How much? e.g. $55.00" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Estimating…' : 'Estimate CO₂'}</button>
        </form>
      ) : (
        <div className="mt-4 space-y-3">
          <label className="block cursor-pointer rounded-xl border border-dashed border-line p-6 text-center">
            <p className="font-medium">Upload a receipt photo</p>
            <p className="mt-1 text-sm text-mute">Needs the backend. If that fails, paste text below.</p>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && runParse('image', e.target.files[0])} />
          </label>
          <textarea className="field min-h-28" placeholder="Paste receipt text here" value={receiptText} onChange={(e) => setReceiptText(e.target.value)} />
          <button className="btn btn-primary" disabled={busy || !receiptText} onClick={() => runParse('text', receiptText)}>
            Estimate from text
          </button>
          <div className="flex flex-wrap gap-2">
            {SAMPLES.map((sample) => (
              <button key={sample.label} className="btn btn-ghost text-sm" onClick={() => runParse('text', sample.text)}>
                Try {sample.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-sm bad">{error}</p>}

      {result && (
        <div className="mt-4 rounded-xl border border-line p-4">
          <p className="text-sm text-mute">{source}</p>
          <p className="mt-1 text-2xl font-semibold">
            {formatKg(result.total_kg_co2)} <span className="text-base font-normal text-mute">{result.rating}</span>
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {(result.items || []).map((item, i) => (
              <li key={i} className="flex justify-between gap-3">
                <span>{item.description}</span>
                <span className="mono text-mute">{item.kg_co2} kg · {item.category}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
