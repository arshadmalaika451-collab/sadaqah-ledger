import React, { useState } from 'react'
import { supabase } from '../supabase.js'
import { computeNextHash } from '../utils/hashChain.js'

// Simple shared-password gate. Fine for a committee-scale MVP — for a real
// deployment with several members, swap this for Supabase Auth.
const COMMITTEE_PASSWORD = 'MasjidChanda2026'

export default function AdminPanel() {
  const [unlocked, setUnlocked] = useState(false)
  const [password, setPassword] = useState('')

  if (!unlocked) {
    return (
      <div className="max-w-sm mx-auto mt-16 bg-panel border border-line rounded-md p-8">
        <h2 className="font-display text-xl text-teal-900 mb-1">Committee sign-in</h2>
        <p className="text-sm text-ink/50 mb-5">Only for people who log donations and expenses.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Committee password"
          className="w-full border border-line rounded-sm px-3 py-2 mb-3 text-sm focus:border-teal-600 outline-none"
        />
        <button
          onClick={() => password === COMMITTEE_PASSWORD && setUnlocked(true)}
          className="w-full bg-teal-600 hover:bg-teal-400 text-paper text-sm font-medium py-2 rounded-sm transition-colors"
        >
          Sign in
        </button>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <EntryForm type="donation" />
      <EntryForm type="expense" />
    </div>
  )
}

function EntryForm({ type }) {
  const isDonation = type === 'donation'
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [donor, setDonor] = useState('')
  const [category, setCategory] = useState('')
  const [note, setNote] = useState('')
  const [receiptImage, setReceiptImage] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setReceiptImage(reader.result) // stored as a compact base64 data URL
    reader.readAsDataURL(file)
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      // 1. Find the hash of the most recent entry in the whole ledger
      //    (chain is shared across donations + expenses, in time order).
      const { data: lastRows } = await supabase
        .from('ledger')
        .select('hash')
        .order('created_at', { ascending: false })
        .limit(1)
      const prevHash = lastRows && lastRows.length ? lastRows[0].hash : null

      const entry = {
        type,
        amount: Number(amount),
        date,
        donor: isDonation ? donor : null,
        category: isDonation ? null : category,
        note: isDonation ? note : null,
        description: isDonation ? null : note,
        receiptImage: receiptImage || null,
      }

      const hash = await computeNextHash(entry, prevHash)

      await supabase.from('ledger').insert({
        type: entry.type,
        amount: entry.amount,
        date: entry.date,
        donor: entry.donor,
        category: entry.category,
        note: entry.note,
        description: entry.description,
        receipt_image: entry.receiptImage,
        hash,
      })

      setAmount('')
      setDonor('')
      setCategory('')
      setNote('')
      setReceiptImage('')
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-panel border border-line rounded-md p-6 space-y-4"
    >
      <h3 className={'font-display text-lg ' + (isDonation ? 'text-teal-600' : 'text-clay-600')}>
        Log a {isDonation ? 'donation' : 'expense'}
      </h3>

      <Field label="Amount (Rs)">
        <input
          required
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input"
        />
      </Field>

      <Field label="Date">
        <input
          required
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input"
        />
      </Field>

      {isDonation ? (
        <Field label="Donor name (leave blank for anonymous)">
          <input value={donor} onChange={(e) => setDonor(e.target.value)} className="input" />
        </Field>
      ) : (
        <Field label="Category">
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input"
          >
            <option value="">Select…</option>
            <option>Masjid repair</option>
            <option>Electricity</option>
            <option>Water</option>
            <option>Iftar / food</option>
            <option>Cleaning supplies</option>
            <option>Salaries</option>
            <option>Other</option>
          </select>
        </Field>
      )}

      <Field label="Note (optional)">
        <input value={note} onChange={(e) => setNote(e.target.value)} className="input" />
      </Field>

      <Field label="Receipt photo (optional)">
        <input type="file" accept="image/*" onChange={handleFile} className="text-sm" />
        {receiptImage && (
          <img src={receiptImage} alt="Receipt preview" className="mt-2 h-20 rounded-sm border border-line" />
        )}
      </Field>

      <button
        type="submit"
        disabled={saving}
        className={
          'w-full text-paper text-sm font-medium py-2.5 rounded-sm transition-colors disabled:opacity-50 ' +
          (isDonation ? 'bg-teal-600 hover:bg-teal-400' : 'bg-clay-600 hover:bg-clay-400')
        }
      >
        {saving ? 'Saving…' : saved ? 'Saved ✓' : `Save ${type}`}
      </button>
    </form>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs text-ink/50 mb-1">{label}</span>
      {children}
    </label>
  )
}
