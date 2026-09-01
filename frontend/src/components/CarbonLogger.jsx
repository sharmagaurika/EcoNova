import React, { useState } from 'react'
import { estimateFromText, ratingFor, round3 } from '../lib/carbon'
import { parseBank, parseReceiptImage, parseReceiptText } from '../api'
import { newId, useStore } from '../lib/store'
import { formatKg } from '../lib/format'

const SAMPLES = [
  { label: 'Grocery', text: 'Whole Foods Market\nOat milk 1L $3.49\nSourdough $4.50\nCheddar 200g $5.99' },
  { label: 'Fuel', text: 'Shell Service Station $55.00' },
  { label: 'Flight', text: 'Air Canada YYZ to LHR $860.00' },
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
          setSource('Gemini Nova parser')
        } catch {
          parsed = estimateFromText(payload)
          setSource('On-device estimator')
        }
        commit(parsed, name || parsed.items?.[0]?.description || 'Bank transaction')
      } else if (kind === 'text') {
        try {
          parsed = await parseReceiptText(payload)
          setSource('Gemini Nova parser')
        } catch {
          parsed = estimateFromText(payload)
          setSource('On-device estimator')
        }
        commit(parsed, 'Receipt scan')
      } else {
        try {
          parsed = await parseReceiptImage(payload)
          setSource('Gemini vision')
          commit(parsed, payload.name || 'Receipt image')
        } catch (err) {
          setError('Vision parser is offline. Drop in receipt text or a sample instead.')
          throw err
        }
      }
    } catch (err) {
      setError(err.message || 'Parse failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="panel p-6">
      <p className="kicker">Nova parser</p>
      <h3 className="display text-3xl">Unstructured intake</h3>
      <p className="mt-2 text-sm text-mute">
        Bank lines and receipts are classified with Gemini when the API is live, otherwise IPCC keyword estimates.
      </p>

      <div className="mt-5 inline-flex rounded-full border border-white/10 p-1">
        {['transaction', 'receipt'].map((item) => (
          <button
            key={item}
            className={`rounded-full px-4 py-2 text-sm ${mode === item ? 'bg-signal text-void' : 'text-mute'}`}
            onClick={() => setMode(item)}
          >
            {item === 'transaction' ? 'Transaction' : 'Receipt'}
          </button>
        ))}
      </div>

      {mode === 'transaction' ? (
        <form
          className="mt-5 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            runParse('bank', `Transaction: ${name}, Amount: ${amount}`)
          }}
        >
          <input className="field" placeholder="Merchant or activity" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="field" placeholder="Amount (e.g. $55.00)" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Parsing…' : 'Estimate carbon'}</button>
        </form>
      ) : (
        <div className="mt-5 space-y-4">
          <label className="block cursor-pointer rounded-2xl border border-dashed border-white/15 p-8 text-center hover:border-signal/50">
            <p className="font-medium">Drop a receipt image</p>
            <p className="text-xs text-mute mt-1">JPG or PNG · Gemini vision when available</p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && runParse('image', e.target.files[0])}
            />
          </label>
          <textarea
            className="field min-h-28"
            placeholder="Or paste receipt text"
            value={receiptText}
            onChange={(e) => setReceiptText(e.target.value)}
          />
          <button className="btn btn-primary w-full" disabled={busy || !receiptText} onClick={() => runParse('text', receiptText)}>
            Parse text
          </button>
          <div className="flex flex-wrap gap-2">
            {SAMPLES.map((sample) => (
              <button key={sample.label} className="btn btn-ghost text-xs" onClick={() => runParse('text', sample.text)}>
                Sample: {sample.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-flare">{error}</p>}

      {result && (
        <div className="mt-5 panel-tight p-4">
          <p className="kicker">{source}</p>
          <p className="mt-1 text-2xl display">
            {formatKg(result.total_kg_co2, { signed: true })} <span className="text-base text-mute">{result.rating}</span>
          </p>
          <ul className="mt-3 space-y-1 text-sm text-mute">
            {(result.items || []).map((item, i) => (
              <li key={i} className="flex justify-between gap-3">
                <span>{item.description}</span>
                <span className="mono text-paper">{item.kg_co2} kg · {item.category}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
