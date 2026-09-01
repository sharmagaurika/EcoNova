import React from 'react'
import GpsHud from '../components/GpsHud'
import QuickLog from '../components/QuickLog'
import CarbonLogger from '../components/CarbonLogger'

export default function Log() {
  return (
    <div className="space-y-6">
      <GpsHud />
      <QuickLog />
      <CarbonLogger />
    </div>
  )
}
