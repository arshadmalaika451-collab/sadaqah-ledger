# Sadaqah Ledger — Mosque/Community Fund Transparency Tracker

> ⚠️ **Before you submit:** replace every `TODO` below with your real details —
> live URL, screenshots, your name, your GitHub username. A README full of
> TODOs will be graded as an unfinished report.

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

🔗 **TODO: paste your live Vercel URL here** (e.g. `https://sadaqah-ledger.vercel.app`)

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

**System prompt used** (see `api/summary.js`):

```
You are a financial transparency assistant for a mosque/community fund.
Given this month's donations and expenses data (JSON), write a clear, honest,
3-4 sentence summary in simple language for community members. Mention total
donations, total expenses, the top expense category, and the resulting
balance change. Do not invent numbers — use only the data provided. Write in
a warm but neutral, factual tone, in English.
```

The model only ever receives already-aggregated totals (never raw donor
names), and the prompt explicitly forbids inventing figures — the summary is
a restatement of real numbers, not a guess.

## e. Tools, services, and AI models used

- **Frontend:** React + Vite, Tailwind CSS
- **Database:** Supabase (Postgres, real-time, free tier — no billing card required)
- **Hosting:** Vercel (also runs the serverless AI function)
- **AI model:** Google Gemini 2.0 Flash, via Google AI Studio API key
- **Hashing:** Web Crypto API (SHA-256), built into the browser — no extra library

## f. Screenshots

**TODO: add at least 3 screenshots here**, e.g.:

```
![Public dashboard](screenshots/public-dashboard.png)
![Committee entry form](screenshots/admin-form.png)
![Ledger verification](screenshots/verify-ledger.png)
```
(Put the actual image files in a `screenshots/` folder in this repo.)

## g. How to run this project

Full step-by-step instructions (Firebase setup, Gemini key, local run, GitHub,
Vercel deploy) are in **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**.

Quick version, once you have a Firebase project and a Gemini key:

```bash
npm install
cp .env.example .env   # fill in your Firebase values
npm run dev
```

Open `http://localhost:5173` for the public view, and
`http://localhost:5173/#admin` for the committee panel
(default password is set in `src/components/AdminPanel.jsx` — change it
before you deploy).

## Author

TODO: your name, batch (Batch 1 / Batch 2), and a link to this repo.
