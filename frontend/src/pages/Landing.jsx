import React from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import Mark from '../components/Mark'
import MiniStar from '../components/MiniStar'

export default function Landing() {
  const { carbonMass, you, deltaPct, ecoScore } = useStore()

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <p className="font-semibold"><Mark /></p>
        <Link to="/overview" className="btn btn-primary">Open my week</Link>
      </header>

      <section className="mx-auto max-w-5xl px-5 pb-16 pt-8">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-good">Weekly carbon race</p>
            <h1 className="serif mt-3 text-5xl leading-tight sm:text-6xl">
              Lowest CO₂ this week wins.
            </h1>
            <p className="mt-5 text-lg leading-7 text-mute">
              EcoNova turns everyday stuff — commutes, groceries, flights — into kilograms of CO₂.
              You log what you did. We estimate the carbon. Friends compete to stay lightest.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/log" className="btn btn-primary">Add an activity</Link>
              <Link to="/overview" className="btn btn-ghost">See this week’s score</Link>
            </div>
          </div>
          <MiniStar ecoScore={ecoScore} className="hidden sm:block" />
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <Stat label="Your CO₂ this week" value={`${carbonMass.toFixed(1)} kg`} />
          <Stat label="Your rank" value={`#${you?.rank ?? 4} of 8`} />
          <Stat label="vs last week" value={deltaPct <= 0 ? `${deltaPct}%` : `+${deltaPct}%`} />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16">
        <h2 className="serif text-3xl">What you do in the app</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          <Step n="1" title="Log something real" body="A bike ride, a receipt, a flight, or tap a common activity. GPS can classify a commute from speed." />
          <Step n="2" title="See the kilogram number" body="Each item gets a CO₂ estimate from IPCC / DEFRA factors. Lower total is better." />
          <Step n="3" title="Beat the week" body="The leaderboard is a 7-day race. Tips tell you the one swap that would move you up." />
        </ol>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-20">
        <div className="card p-6 sm:p-8">
          <h2 className="serif text-3xl">What gets measured</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 text-sm leading-6">
            <li><strong>Trips.</strong> Walking, bike, transit, car, or highway from GPS speed, or a tap.</li>
            <li><strong>Purchases.</strong> Paste a bank line or receipt. Gemini reads it when the API is on; otherwise a local estimate.</li>
            <li><strong>Food.</strong> Beef vs plant meals are the biggest weekly swing besides flights.</li>
            <li><strong>Friends.</strong> Same week, same rules. Lightest total is first.</li>
          </ul>
          <p className="mt-6 text-xs text-mute">
            EcoNova started as a Hack the Galaxy project. The race metaphor stays; the app is just a carbon tracker.
          </p>
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-mute">{label}</p>
      <p className="mt-1 text-3xl font-semibold">{value}</p>
    </div>
  )
}

function Step({ n, title, body }) {
  return (
    <li className="card p-5">
      <p className="mono text-sm text-good">{n}</p>
      <p className="mt-2 font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6 text-mute">{body}</p>
    </li>
  )
}
