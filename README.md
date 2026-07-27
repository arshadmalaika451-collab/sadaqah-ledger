# Sadaqah Ledger — Mosque/Community Fund Transparency Tracker

## a. What it does, and for whom

Most mosque and community donation ("chanda") funds are managed on paper or in
a committee member's notebook — nobody outside the committee can see where
the money actually goes, which breeds doubt and rumor even when the committee
is being fully honest.

**Sadaqah Ledger** is a public, real-time ledger for a mosque or community
fund. The committee logs every donation and every expense as it happens; any
member of the community can open a public link — no login needed — and see
the exact running balance, every transaction, the receipt photo behind each
expense, and a plain-language AI summary of the month.

**Built for:** mosque committees, community welfare funds, and any small
group collecting and spending donations on behalf of others, who want to
remove all doubt about where the money went.

## b. Live URL

🔗 **Live URL:** https://sadaqah-ledger.vercel.app

Public ledger: the URL above.
Committee entry form: same URL + `#admin` (e.g. `https://sadaqah-ledger.vercel.app/#admin`)

## c. Features

- **Public, no-login dashboard** — current balance, total donated, total
  spent, and a full transaction table, open to anyone with the link.
- **Committee panel** (password-gated) to log donations (amount, donor name
  or anonymous, date, note) and expenses (amount, category, date, description,
  receipt photo).
- **Receipt photos** attached to expenses and viewable publicly, so every
  rupee spent has visible proof.
- **Tamper-evident hash-chain ledger** — every entry is cryptographically
  chained to the one before it (the same core idea behind blockchains,
  implemented directly rather than through blockchain infrastructure). A
  "Verify ledger integrity" button on the public page recomputes the whole
  chain and immediately flags if any past entry was altered.
- **AI-generated monthly summary** — one click turns the month's raw numbers
  into a short, human-readable community notice.
- **Live updates** — new entries appear for every visitor instantly, no
  refresh needed.

## d. The AI feature

**What it does:** on the public dashboard, a "Generate summary" button sends
the current month's donation and expense totals (already computed from real
ledger data, never invented) to Google's Gemini model, which writes a 3–4
sentence plain-language notice — e.g. how much came in, how much went out,
what it was mostly spent on, and the resulting change in balance.

**System prompt used** (see `api/summary.js`):The model only ever receives already-aggregated totals (never raw donor
names), and the prompt explicitly forbids inventing figures — the summary is
a restatement of real numbers, not a guess.

## e. Tools, services, and AI models used

- **Frontend:** React + Vite, Tailwind CSS
- **Database:** Supabase (Postgres, real-time, free tier — no billing card required)
- **Hosting:** Vercel (also runs the serverless AI function)
- **AI model:** Google Gemini (`gemini-flash-latest`), via Google AI Studio API key
- **Hashing:** Web Crypto API (SHA-256), built into the browser — no extra library

## f. Screenshots

![Public dashboard](screenshots/screenshot1.png)
![AI summary generated](screenshots/screenshot2.png)
![Verify ledger integrity](screenshots/screenshot3.png)
![Committee admin panel](screenshots/screenshot4.png)

## g. How to run this project

Full step-by-step instructions (Supabase setup, Gemini key, local run, GitHub,
Vercel deploy) are in **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**.

Quick version, once you have a Supabase project and a Gemini key:

```bash
npm install
cp .env.example .env   # fill in your Supabase and Gemini values
npm run dev
```

Open `http://localhost:5173` for the public view, and
`http://localhost:5173/#admin` for the committee panel
(default password is set in `src/components/AdminPanel.jsx` — change it
before you deploy).

## Author

Malaika Arshad — ACT AI Program (Batch 2)
Repo: https://github.com/arshadmalaika451-collab/sadaqah-ledger