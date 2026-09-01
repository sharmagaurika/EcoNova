import React from 'react'
import GpsHud from '../components/GpsHud'
import QuickLog from '../components/QuickLog'
import CarbonLogger from '../components/CarbonLogger'

export default function Log() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-good">Add to this week</p>
        <h1 className="serif mt-1 text-4xl">What did you do?</h1>
        <p className="mt-3 max-w-2xl text-mute">
          Pick the simplest option. A tap is enough. GPS is for a live commute. Receipts are for shopping or fuel.
        </p>
      </div>
      <QuickLog />
      <GpsHud />
      <CarbonLogger />
    </div>
  )
}
