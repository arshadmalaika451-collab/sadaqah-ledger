import React from 'react'

const fmt = (n) =>
  new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(n)

export default function LedgerTable({ entries }) {
  if (!entries.length) {
    return (
      <div className="py-12 text-center text-ink/40 text-sm">
        No entries yet. Once the committee logs a donation or expense, it shows up here — publicly, instantly.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-ink/50 border-b border-line">
            <th className="py-2 pr-4 font-medium">Date</th>
            <th className="py-2 pr-4 font-medium">Type</th>
            <th className="py-2 pr-4 font-medium">Detail</th>
            <th className="py-2 pr-4 font-medium text-right">Amount</th>
            <th className="py-2 pr-4 font-medium">Receipt</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id} className="border-b border-line/60 hover:bg-teal-50/40">
              <td className="py-2.5 pr-4 whitespace-nowrap text-ink/70">{e.date}</td>
              <td className="py-2.5 pr-4">
                <span
                  className={
                    'inline-block px-2 py-0.5 rounded-sm text-xs font-medium ' +
                    (e.type === 'donation'
                      ? 'bg-teal-50 text-teal-600'
                      : 'bg-clay-100 text-clay-600')
                  }
                >
                  {e.type === 'donation' ? 'Donation' : 'Expense'}
                </span>
              </td>
              <td className="py-2.5 pr-4 text-ink/80">
                {e.type === 'donation' ? e.donor || 'Anonymous' : e.category}
                {e.description || e.note ? (
                  <span className="text-ink/40"> — {e.description || e.note}</span>
                ) : null}
              </td>
              <td
                className={
                  'py-2.5 pr-4 text-right tabular font-medium ' +
                  (e.type === 'donation' ? 'text-teal-600' : 'text-clay-600')
                }
              >
                {e.type === 'donation' ? '+' : '−'}Rs {fmt(e.amount)}
              </td>
              <td className="py-2.5 pr-4">
                {e.receiptImage ? (
                  <a
                    href={e.receiptImage}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brass-600 underline underline-offset-2 hover:text-brass-400"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-ink/25">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
