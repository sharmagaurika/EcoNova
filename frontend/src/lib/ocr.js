let workerPromise = null

async function getWorker(onStatus) {
  if (!workerPromise) {
    workerPromise = (async () => {
      onStatus?.('Loading the photo reader…')
      const { createWorker } = await import('tesseract.js')
      return createWorker('eng', 1, {
        logger: (message) => {
          if (message.status === 'recognizing text' && typeof message.progress === 'number') {
            onStatus?.(`Reading the photo… ${Math.round(message.progress * 100)}%`)
          }
        },
      })
    })()
  }
  return workerPromise
}

export async function readReceiptPhoto(file, onStatus) {
  const worker = await getWorker(onStatus)
  onStatus?.('Reading the photo…')
  const { data } = await worker.recognize(file)
  return (data.text || '').replace(/\u0000/g, '').trim()
}

export function looksLikeReceipt(text) {
  const compact = (text || '').replace(/\s+/g, ' ').trim()
  if (compact.length < 8) return false
  return /\$|\d+\.\d{2}|total|market|grocery|shell|fuel|flight/i.test(compact)
}
