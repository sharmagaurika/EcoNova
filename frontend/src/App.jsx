import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell'
import Landing from './pages/Landing'
import Overview from './pages/Overview'
import Log from './pages/Log'
import Leaderboard from './pages/Leaderboard'
import Tips from './pages/Tips'
import { StoreProvider } from './lib/store'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<AppShell />}>
            <Route path="/overview" element={<Overview />} />
            <Route path="/log" element={<Log />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/tips" element={<Tips />} />
          </Route>
          <Route path="/command" element={<Navigate to="/overview" replace />} />
          <Route path="/galaxy" element={<Navigate to="/leaderboard" replace />} />
          <Route path="/race" element={<Navigate to="/leaderboard" replace />} />
          <Route path="/coach" element={<Navigate to="/tips" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
