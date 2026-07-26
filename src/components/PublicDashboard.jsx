import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabase.js'
import { verifyChain } from '../utils/hashChain.js'
import LedgerTable from './LedgerTable.jsx'
import SummaryCard from './SummaryCard.jsx'

const fmt = (n) => new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(n)

export default function PublicDashboard() {
  const [entries, setEntries] = useState([])
  const [verifyState, setVerifyState] = useState(null) // null | 'checking' | result

  useEffect(() => {
    let channel

    async function load() {
      const { data } = await supabase.from('ledger').select('*').order('created_at', { ascending: true })
      if (data) setEntries(data.map(normalize))
    }
    load()

    // Live updates: anyone looking at the page sees new entries instantly.
    channel = supabase
      .channel('ledger-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ledger' }, (payload) => {
        setEntries((prev) => [...prev, normalize(payload.new)])
      })
      .subscribe()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  const { totalDonations, totalExpenses, balance } = useMemo(() => {
    let d = 0,
      e = 0
    for (const entry of entries) {
      if (entry.type === 'donation') d += Number(entry.amount)
      else e += Number(entry.amount)
    }
    return { totalDonations: d, totalExpenses: e, balance: d - e }
  }, [entries])

  const currentMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })

  const thisMonthEntries = useMemo(() => {
    const now = new Date()
    return entries.filter((e) => {
      const d = new Date(e.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }, [entries])

  async function handleVerify() {
    setVerifyState('checking')
    const result = await verifyChain(entries)
    setVerifyState(result)
  }

  return (
    <div className="space-y-10">
      {/* Hero: the balance is the single fact everyone came here for */}
      <section>
        <div className="text-xs uppercase tracking-widest text-ink/40 mb-2">Current fund balance</div>
        <div className="font-display text-6xl md:text-7xl text-teal-900 tabular">
          Rs {fmt(balance)}
        </div>
        <div className="mt-4 flex gap-8 text-sm">
          <div>
            <span className="text-teal-600 font-medium tabular">Rs {fmt(totalDonations)}</span>
            <span className="text-ink/40"> total donated</span>
          </div>
          <div>
            <span className="text-clay-600 font-medium tabular">Rs {fmt(totalExpenses)}</span>
            <span className="text-ink/40"> total spent</span>
          </div>
        </div>
      </section>

      <SummaryCard month={currentMonth} donations={thisMonthEntries.filter(e=>e.type==='donation')} expenses={thisMonthEntries.filter(e=>e.type==='expense')} />

      {/* Ledger */}
      <section className="bg-panel rounded-md border border-line p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-teal-900">Full ledger</h2>
          <button
            onClick={handleVerify}
            className="text-xs border border-line hover:border-teal-600 hover:text-teal-600 px-3 py-1.5 rounded-sm transition-colors"
          >
            {verifyState === 'checking' ? 'Verifying…' : 'Verify ledger integrity'}
          </button>
        </div>

        {verifyState && verifyState !== 'checking' && (
          <div
            className={
              'mb-4 text-sm px-4 py-2.5 rounded-sm ' +
              (verifyState.valid
                ? 'bg-teal-50 text-teal-600'
                : 'bg-clay-100 text-clay-600')
            }
          >
            {verifyState.valid
              ? `✓ Verified — all ${verifyState.total} entries are intact and unmodified since they were logged.`
              : `⚠ Chain breaks at entry ${verifyState.brokenEntryId} — this record does not match its original hash and may have been altered.`}
          </div>
        )}

        <LedgerTable entries={[...entries].reverse()} />
      </section>
    </div>
  )
}

// Supabase returns snake_case columns (receipt_image); the rest of the app
// (LedgerTable, hashChain) expects camelCase (receiptImage), so translate here.
function normalize(row) {
  return { ...row, receiptImage: row.receipt_image }
}
