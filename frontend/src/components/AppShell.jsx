import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useStore } from '../lib/store'
import Mark from './Mark'

const LINKS = [
  { to: '/', label: 'My week', end: true },
  { to: '/log', label: 'Add activity' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/tips', label: 'How to improve' },
]

export default function AppShell() {
  const { carbonMass, you } = useStore()

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line bg-[#07030f]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link to="/" className="font-semibold tracking-tight">
            <Mark />
          </Link>
          <nav className="hidden sm:flex flex-1 justify-center gap-1">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <p className="ml-auto mono text-xs text-paper">
            {carbonMass.toFixed(1)} kg this week · <span className="hl" style={{ color: '#ffb4dc' }}>#{you?.rank ?? '—'}</span>
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 pb-24">
        <Outlet />
      </main>

      <nav className="sm:hidden fixed bottom-0 inset-x-0 border-t border-line bg-[#07030f]/90 backdrop-blur-xl">
        <div className="grid grid-cols-4">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `px-1 py-3 text-center text-[11px] font-semibold ${isActive ? 'text-brand' : 'text-mute'}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
