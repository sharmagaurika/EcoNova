import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Starfield from './components/Starfield'
import AppShell from './components/AppShell'
import Landing from './pages/Landing'
import Command from './pages/Command'
import Galaxy from './pages/Galaxy'
import Race from './pages/Race'
import Log from './pages/Log'
import Coach from './pages/Coach'
import { StoreProvider } from './lib/store'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Starfield />
        <div className="scanline fixed inset-0 z-[1] opacity-40" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<AppShell />}>
            <Route path="/command" element={<Command />} />
            <Route path="/galaxy" element={<Galaxy />} />
            <Route path="/race" element={<Race />} />
            <Route path="/log" element={<Log />} />
            <Route path="/coach" element={<Coach />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
