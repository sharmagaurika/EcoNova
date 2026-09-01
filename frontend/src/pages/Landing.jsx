import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../lib/store'

const FEATURES = [
  {
    kicker: 'Sensing',
    title: 'Live GPS galaxy tracking',
    copy: 'Passive geolocation classifies walking, cycling, transit, car, and highway from speed thresholds — then applies IPCC factors in real time.',
  },
  {
    kicker: 'Intelligence',
    title: 'Gemini Nova parser',
    copy: 'Receipts, bank lines, and flight confirmations become structured carbon with confidence scores. Offline, the on-device estimator keeps the demo live.',
  },
  {
    kicker: 'Competition',
    title: 'Weekly sprint to Supernova',
    copy: 'Lowest mass in a rolling 7-day window takes the badge. Friend circles, national boards, and a live trash-talk feed keep the race honest.',
  },
]

const STACK = [
  ['Frontend', 'React 18 · Vite · Tailwind · Canvas HUD'],
  ['Motion', 'Framer Motion · Geolocation API'],
  ['Intelligence', 'Gemini 2.0 Flash · IPCC / DEFRA 2024'],
  ['Privacy', 'localStorage first · no credential vault'],
]

export default function Landing() {
  const { carbonMass, ecoScore, you, state } = useStore()
  return (
    <div className="relative z-10">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div>
          <p className="kicker">Hack the Galaxy · 3rd place</p>
          <p className="display text-3xl leading-none">
            ECO<span className="text-signal">NOVA</span>
          </p>
        </div>
        <Link to="/command" className="btn btn-primary">
          Enter the race
        </Link>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="kicker text-signal"
          >
            Competitive sustainability
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="display mt-4 text-6xl leading-[0.9] sm:text-8xl"
          >
            In the race to save the galaxy, your footprint is your speed.
          </motion.h1>
          <p className="mt-6 max-w-xl text-lg text-mute">
            EcoNova turns carbon mass into orbital drag. The lighter you are, the faster you go. GPS, Gemini parsing, and social sprints make the invisible measurable.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/command" className="btn btn-primary">Open command</Link>
            <Link to="/log" className="btn btn-ghost">Log a vector</Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="panel hud-grid p-6"
        >
          <p className="kicker">Telemetry</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Metric label="Weekly mass" value={`${carbonMass.toFixed(1)} kg`} tone="text-gold" />
            <Metric label="Eco score" value={String(ecoScore)} tone="text-signal" />
            <Metric label="Sprint rank" value={`#${you?.rank ?? 4}`} tone="text-ion" />
            <Metric label="Streak" value={`${state.profile.streak} days`} tone="text-paper" />
          </div>
          <p className="mt-5 text-sm text-mute">
            AvaSTAR brightens as mass drops. Debris gathers when the week runs heavy. Supernova is the prize.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="panel p-6">
              <p className="kicker text-signal">{feature.kicker}</p>
              <h2 className="mt-3 text-xl font-semibold">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-mute">{feature.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="panel p-8">
          <p className="kicker">Stack</p>
          <h2 className="display text-4xl">Technically sound, demo-ready</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STACK.map(([label, value]) => (
              <div key={label} className="panel-tight p-4">
                <p className="kicker">{label}</p>
                <p className="mt-2 text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function Metric({ label, value, tone }) {
  return (
    <div className="panel-tight p-4">
      <p className="kicker">{label}</p>
      <p className={`display mt-1 text-3xl ${tone}`}>{value}</p>
    </div>
  )
}
