import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell'
import Overview from './pages/Overview'
import Log from './pages/Log'
import Leaderboard from './pages/Leaderboard'
import Tips from './pages/Tips'
import StarDust from './components/StarDust'
import SpaceCursor from './components/SpaceCursor'
import { StoreProvider } from './lib/store'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <StarDust />
        <SpaceCursor />
        <div className="relative z-10">
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<Overview />} />
              <Route path="/log" element={<Log />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/tips" element={<Tips />} />
            </Route>
            <Route path="/overview" element={<Navigate to="/" replace />} />
            <Route path="/command" element={<Navigate to="/" replace />} />
            <Route path="/galaxy" element={<Navigate to="/leaderboard" replace />} />
            <Route path="/race" element={<Navigate to="/leaderboard" replace />} />
            <Route path="/coach" element={<Navigate to="/tips" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </StoreProvider>
  )
}
