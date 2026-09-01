import React, { useEffect, useState } from 'react'
import { estimateFromText, ratingFor, round3 } from '../lib/carbon'
import { looksLikeReceipt, readReceiptPhoto } from '../lib/ocr'
import { newId, useStore } from '../lib/store'
import { formatKg } from '../lib/format'

const DEMO_TEXT = `WHOLE FOODS MARKET
Toronto, ON
Oat milk 1L              $3.49
Sourdough                 $4.50
Cheddar 200g             $5.99
Subtotal                 $13.98
Tax                       $1.82
TOTAL                    $15.80`

export default function CarbonLogger() {
  const { dispatch } = useStore()
  const [receiptText, setReceiptText] = useState(DEMO_TEXT)
  const [preview, setPreview] = useState('/sample-receipt.png')
  const [busy, setBusy] = useState(false)
  const [busyLabel, setBusyLabel] = useState('Estimating…')
  const [note, setNote] = useState('')
  const [result, setResult] = useState(null)
  const [source, setSource] = useState('')

  useEffect(() => () => {
    if (preview.startsWith('blob:')) URL.revokeObjectURL(preview)
  }, [preview])

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

  const estimate = (text, label, sourceLabel) => {
    const parsed = estimateFromText(text)
    commit(parsed, label)
    setReceiptText(text)
    setSource(sourceLabel)
    setNote('')
  }

  const runDemo = () => {
    setPreview('/sample-receipt.png')
    estimate(DEMO_TEXT, 'Whole Foods Market', 'Demo grocery receipt')
  }

  const fromPhoto = async (file) => {
    if (!file) return
    if (preview.startsWith('blob:')) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(file))
    setBusy(true)
    setBusyLabel('Reading the photo…')
    setNote('')
    try {
      const text = await readReceiptPhoto(file, setBusyLabel)
      if (looksLikeReceipt(text)) {
        estimate(text, file.name || 'Receipt photo', 'Read from the photo on this device')
      } else {
        setNote('Could not read the print. Paste the lines below or tap the demo receipt.')
      }
    } catch {
      setNote('Could not read the photo. Paste the lines below or tap the demo receipt.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card p-6">
      <p className="font-semibold">Add a receipt</p>
      <p className="mt-1 text-sm text-mute">
        Tap the demo receipt to log it. You can also upload a photo or paste text.
      </p>

      <div className="mt-4 overflow-hidden rounded-xl border border-line bg-white/5">
        <img src="/sample-receipt.png" alt="Demo Whole Foods receipt" className="mx-auto max-h-72 bg-white" />
      </div>
      <button className="btn btn-primary mt-3 w-full" type="button" disabled={busy} onClick={runDemo}>
        Run this demo receipt
      </button>

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

      <label className="mt-6 block cursor-pointer rounded-xl border border-dashed border-line p-5 text-center hover:border-brand/50">
        <p className="font-medium">Or upload your own photo</p>
        <p className="mt-1 text-sm text-mute">We read the print on this device.</p>
        {preview.startsWith('blob:') && (
          <img src={preview} alt="Your receipt" className="mx-auto mt-3 max-h-40 rounded-lg" />
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) fromPhoto(file)
            e.target.value = ''
          }}
        />
      </label>

      <textarea
        className="field mt-3 min-h-24"
        placeholder="Or paste receipt text here"
        value={receiptText}
        onChange={(e) => setReceiptText(e.target.value)}
      />
      <button
        className="btn btn-ghost mt-3"
        type="button"
        disabled={busy || !receiptText.trim()}
        onClick={() => estimate(receiptText, 'Receipt', 'Estimated from pasted text')}
      >
        {busy ? busyLabel : 'Estimate from text'}
      </button>
    </div>
  )
}
