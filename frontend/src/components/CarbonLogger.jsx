import React, { useEffect, useState } from 'react'
import { estimateFromText, ratingFor, round3 } from '../lib/carbon'
import { looksLikeReceipt, readReceiptPhoto } from '../lib/ocr'
import { newId, useStore } from '../lib/store'
import { formatKg } from '../lib/format'

const SAMPLES = [
  { label: 'Grocery list', text: 'Whole Foods Market\nOat milk 1L $3.49\nSourdough $4.50\nCheddar 200g $5.99\nTOTAL $15.80' },
  { label: 'Gas station', text: 'Shell Service Station\nRegular unleaded\nTOTAL $55.00' },
  { label: 'Flight ticket', text: 'Air Canada YYZ to LHR $860.00' },
]

export default function CarbonLogger() {
  const { dispatch } = useStore()
  const [storeName, setStoreName] = useState('')
  const [amount, setAmount] = useState('')
  const [receiptText, setReceiptText] = useState('')
  const [preview, setPreview] = useState('')
  const [busy, setBusy] = useState(false)
  const [busyLabel, setBusyLabel] = useState('Estimating…')
  const [note, setNote] = useState('')
  const [result, setResult] = useState(null)
  const [source, setSource] = useState('')

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview)
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
    setSource(sourceLabel)
    setNote('')
  }

  const fromTyped = () => {
    const text = `Transaction: ${storeName}, Amount: ${amount}`
    estimate(text, storeName || 'Purchase', 'Estimated on this device')
  }

  const fromText = (text, label = 'Receipt') => {
    estimate(text, label, 'Estimated on this device')
    setReceiptText(text)
  }

  const fromPhoto = async (file) => {
    if (!file) return
    if (preview) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(file))
    setBusy(true)
    setBusyLabel('Reading the photo…')
    setNote('')
    try {
      const text = await readReceiptPhoto(file, setBusyLabel)
      if (looksLikeReceipt(text)) {
        setReceiptText(text)
        estimate(text, file.name || 'Receipt photo', 'Read from the photo on this device')
      } else {
        setNote('Could not read the print clearly. Type the store and the total you see, or paste the lines, then estimate.')
      }
    } catch {
      setNote('Could not read the photo. Type the store and the total you see, or paste the lines, then estimate.')
    } finally {
      setBusy(false)
    }
  }

  const fromSamplePhoto = async () => {
    setBusy(true)
    setBusyLabel('Loading sample receipt…')
    try {
      const response = await fetch('/sample-receipt.png')
      const blob = await response.blob()
      const file = new File([blob], 'sample-receipt.png', { type: 'image/png' })
      await fromPhoto(file)
    } catch {
      fromText(SAMPLES[0].text, 'Sample receipt')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card p-6">
      <p className="font-semibold">Add a receipt</p>
      <p className="mt-1 text-sm text-mute">
        Photo, paste, or type a store and price. Carbon is estimated here — no carbon server needed.
      </p>

      <label className="mt-4 block cursor-pointer rounded-xl border border-dashed border-line p-6 text-center hover:border-brand/50">
        {preview ? (
          <img src={preview} alt="Receipt preview" className="mx-auto max-h-56 rounded-lg" />
        ) : (
          <>
            <p className="font-medium">Upload a receipt photo</p>
            <p className="mt-1 text-sm text-mute">We read the print on this device.</p>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          capture="environment"
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
        className="field mt-3 min-h-28"
        placeholder="Or paste receipt text here"
        value={receiptText}
        onChange={(e) => setReceiptText(e.target.value)}
      />
      <button
        className="btn btn-primary mt-3"
        type="button"
        disabled={busy || !receiptText.trim()}
        onClick={() => fromText(receiptText)}
      >
        {busy ? busyLabel : 'Estimate from text'}
      </button>

      <p className="mt-5 text-sm font-medium">Or type a store and price</p>
      <form
        className="mt-2 grid gap-3 sm:grid-cols-[1fr_8rem_auto]"
        onSubmit={(e) => {
          e.preventDefault()
          fromTyped()
        }}
      >
        <input className="field" placeholder="Where? e.g. Shell, Whole Foods" value={storeName} onChange={(e) => setStoreName(e.target.value)} required />
        <input className="field" placeholder="$55.00" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <button className="btn btn-ghost" disabled={busy} type="submit">Estimate</button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {SAMPLES.map((sample) => (
          <button key={sample.label} type="button" className="btn btn-ghost text-sm" disabled={busy} onClick={() => fromText(sample.text, sample.label)}>
            Try {sample.label}
          </button>
        ))}
        <button type="button" className="btn btn-ghost text-sm" disabled={busy} onClick={fromSamplePhoto}>
          Try a sample photo
        </button>
      </div>

      {note && <p className="mt-4 text-sm text-warn">{note}</p>}

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
