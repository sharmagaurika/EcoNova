import React from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useStore } from '../lib/store'

const LINKS = [
  { to: '/command', label: 'Command', hint: 'AvaSTAR + mass' },
  { to: '/galaxy', label: 'Galaxy', hint: 'Friend constellation' },
  { to: '/race', label: 'Race', hint: 'Sprint + feed' },
  { to: '/log', label: 'Logger', hint: 'GPS · receipts · AI' },
  { to: '/coach', label: 'Nova', hint: 'Nudges + report' },
]

export default function AppShell() {
  const { state, ecoScore, you } = useStore()
  const location = useLocation()

  return (
    <div className="relative z-10 min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-6 px-5 py-6">
          <a href="/" className="block">
            <p className="kicker">Hack the Galaxy</p>
            <h1 className="display text-4xl leading-none">
              ECO<span className="text-signal">NOVA</span>
            </h1>
          </a>

          <nav className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : 'hover:bg-white/5'}`}>
                <span className="flex-1">
                  <span className="block">{link.label}</span>
                  <span className="block text-[11px] opacity-70">{link.hint}</span>
                </span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto panel-tight p-4">
            <p className="kicker mb-2">Pilot</p>
            <p className="font-semibold">{state.profile.name}</p>
            <p className="mono text-xs text-mute mt-1">
              LVL {state.profile.level} · SCORE {ecoScore} · RANK {you?.rank ?? '—'}
            </p>
          </div>
        </aside>

        <div className="flex-1 px-4 pb-24 pt-5 sm:px-6 lg:pb-8 lg:pr-6">
          <header className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="kicker">{pageKicker(location.pathname)}</p>
              <h2 className="display text-4xl sm:text-5xl text-paper">{pageTitle(location.pathname)}</h2>
            </div>
            <div className="hidden sm:flex items-center gap-3 panel-tight px-4 py-2">
              <span className={`h-2 w-2 rounded-full ${state.gps.active ? 'bg-signal' : 'bg-mute'}`} />
              <span className="mono text-xs">{state.gps.active ? `${state.gps.mode} · ${state.gps.speedKmh.toFixed(0)} km/h` : 'GPS idle'}</span>
            </div>
          </header>
          <Outlet />
        </div>
      </div>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-20 border-t border-white/10 bg-[#05070c]/90 backdrop-blur-xl">
        <div className="grid grid-cols-5">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `py-3 text-center text-[11px] ${isActive ? 'text-signal' : 'text-mute'}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

function pageTitle(path) {
  return ({
    '/command': 'Command',
    '/galaxy': 'Galaxy',
    '/race': 'Race',
    '/log': 'Carbon log',
    '/coach': 'Nova coach',
  })[path] || 'EcoNova'
}

function pageKicker(path) {
  return ({
    '/command': 'Orbital mass / live score',
    '/galaxy': 'Friend circles & focus',
    '/race': 'Weekly sprint window',
    '/log': 'Estimate · parse · track',
    '/coach': 'Behavioral intelligence',
  })[path] || 'EcoNova'
}
