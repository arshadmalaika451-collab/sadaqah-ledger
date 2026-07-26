import React, { useState, useEffect } from 'react'
import PublicDashboard from './components/PublicDashboard.jsx'
import AdminPanel from './components/AdminPanel.jsx'

// Route purely by URL hash so the two experiences are separate, shareable
// links: yourapp.vercel.app/  (public)  and  yourapp.vercel.app/#admin (committee)
export default function App() {
  const [route, setRoute] = useState(window.location.hash)

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const isAdmin = route === '#admin'

  return (
    <div className="min-h-screen paper-texture">
      <header className="border-b border-line bg-panel">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <SealMark />
            <div>
              <div className="font-display text-xl text-teal-900 leading-tight">Sadaqah Ledger</div>
              <div className="text-xs text-ink/50 tracking-wide">Open books. No questions left unanswered.</div>
            </div>
          </a>
          <nav className="text-sm">
            {isAdmin ? (
              <a href="#" className="text-teal-600 hover:text-teal-900 font-medium">
                ← Back to public ledger
              </a>
            ) : (
              <a href="#admin" className="text-ink/40 hover:text-teal-600 transition-colors">
                Committee sign-in
              </a>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {isAdmin ? <AdminPanel /> : <PublicDashboard />}
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-10 text-xs text-ink/40 border-t border-line mt-10">
        Every entry below is chained to the one before it — edit an old record and the chain shows exactly where. That's the whole point.
      </footer>
    </div>
  )
}

// A small eight-point star seal — a nod to geometric tile work, used as the
// one signature mark rather than scattered decoration.
function SealMark() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <g transform="translate(17,17)">
        <path
          d="M0,-14 L3,-3 14,0 3,3 0,14 -3,3 -14,0 -3,-3 Z"
          fill="#0F3D3E"
        />
        <path
          d="M0,-14 L3,-3 14,0 3,3 0,14 -3,3 -14,0 -3,-3 Z"
          fill="none"
          stroke="#B8892B"
          strokeWidth="0.75"
          transform="rotate(45)"
        />
      </g>
    </svg>
  )
}
