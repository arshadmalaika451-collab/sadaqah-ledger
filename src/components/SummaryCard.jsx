import React, { useState } from 'react'

export default function SummaryCard({ month, donations, expenses }) {
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function generate() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, donations, expenses }),
      })
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      setSummary(data.summary)
    } catch (e) {
      setError('Could not generate the summary right now — try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-teal-900 text-paper rounded-md p-6 relative overflow-hidden">
      <div className="text-xs tracking-widest uppercase text-brass-100/70 mb-2">
        Community notice — {month}
      </div>
      {summary ? (
        <p className="font-display text-lg leading-relaxed">{summary}</p>
      ) : (
        <p className="text-sm text-paper/60">
          Generate a plain-language summary of this month's donations and expenses — written
          fresh from the actual numbers, for anyone who doesn't want to read the raw table.
        </p>
      )}
      {error && <p className="text-clay-100 text-xs mt-2">{error}</p>}
      <button
        onClick={generate}
        disabled={loading}
        className="mt-4 text-sm bg-brass-600 hover:bg-brass-400 text-teal-900 font-medium px-4 py-2 rounded-sm transition-colors disabled:opacity-50"
      >
        {loading ? 'Writing summary…' : summary ? 'Regenerate' : 'Generate summary'}
      </button>
    </div>
  )
}
