import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useStore } from '../lib/store'
import Mark from './Mark'

const LINKS = [
  { to: '/overview', label: 'My week' },
  { to: '/log', label: 'Add activity' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/tips', label: 'How to improve' },
]

export default function AppShell() {
  const { carbonMass, you } = useStore()

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line bg-[#f4f1ea]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link to="/" className="font-semibold tracking-tight">
            <Mark />
          </Link>
          <nav className="hidden sm:flex flex-1 justify-center gap-1">
            {LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <p className="ml-auto mono text-xs text-mute">
            {carbonMass.toFixed(1)} kg this week · #{you?.rank ?? '—'}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 pb-24">
        <Outlet />
      </main>

      <nav className="sm:hidden fixed bottom-0 inset-x-0 border-t border-line bg-[#f4f1ea]">
        <div className="grid grid-cols-4">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `px-1 py-3 text-center text-[11px] font-semibold ${isActive ? 'text-good' : 'text-mute'}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
