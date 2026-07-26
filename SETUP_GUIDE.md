# Setup Guide — Zero se Live Deployment tak

Ye guide follow karein order mein, koi step skip na karein. Total time: 2-4 ghante
(agar customize bhi karna ho to zyada).

---

## Phase 1 — Supabase Project Banana (Database)

Supabase, Firebase jaisa hi hai (real-time database) lekin free tier ke
liye koi billing card nahi maangta.

1. https://supabase.com pe jayen, **"Start your project"** click karen,
   GitHub account se sign in kar lein (asaan tareeqa).
2. **"New project"** click karen.
3. Organization poochega — default wali select kar lein ya naya bana lein.
4. Project details bharein:
   - **Name:** `sadaqah-ledger`
   - **Database password:** koi bhi strong password type karen aur **kahin
     save kar lein** (notepad mein) — dobara nahi maangega lekin future
     mein kabhi chahiye ho sakta hai.
   - **Region:** koi bhi Asia-qareeb region select kar lein.
5. **"Create new project"** click karen. 1-2 minute wait karen jab tak
   project provision ho jaye.
6. Project ready hone ke baad, left sidebar mein **SQL Editor** (`</>` icon
   jaisa) pe click karen.
7. **"New query"** click karen. Is project ki `supabase.sql` file ka poora
   content copy kar ke wahan paste kar dein.
8. Neeche **"Run"** button (ya Ctrl+Enter) click karen. "Success. No rows
   returned" jaisa message aana chahiye — matlab table aur security rules
   ban gayi.
9. Ab left sidebar mein **gear icon (Project Settings) > API** pe jayen.
10. Wahan do values milengi:
    - **Project URL** (kuch is tarah: `https://xxxxx.supabase.co`)
    - **anon public** key (ek lambi si string, "Project API keys" ke neeche)

    **Ye dono values copy kar lein** — inhi ko `.env` file mein daalna hai
    (Phase 3 mein).

---

## Phase 2 — Gemini API Key Lena (AI Feature)

1. https://aistudio.google.com pe jayen, Google account se login karen.
2. Left sidebar ya top pe **"Get API key"** button dhoondein, click karen.
3. **Create API key** pe click karen (naya project select ya create kar
   sakte hain).
4. Generated key ko copy kar ke kahin safe jagah save kar lein (notepad mein) —
   ye baad mein Vercel ke environment variables mein daalni hai, kabhi bhi
   code/GitHub mein nahi.

---

## Phase 3 — Project Local Machine Pe Chalana

1. Agar Node.js install nahi hai, https://nodejs.org se LTS version install
   kar lein.
2. Is project folder ko apne computer pe rakh lein (VS Code mein khol lein).
3. Terminal khol kar project folder mein jayen, phir:
   ```bash
   npm install
   ```
4. `.env.example` file ko copy kar ke naam `.env` rakh dein:
   ```bash
   cp .env.example .env
   ```
5. `.env` file khol kar Phase 1 ki Supabase values fill kar dein:
   ```
   VITE_SUPABASE_URL=aap_ka_project_url
   VITE_SUPABASE_ANON_KEY=aap_ki_anon_key
   ```
   (`GEMINI_API_KEY` line ko `.env` mein khali chor dein — wo sirf Vercel
   pe lagegi, local .env mein iski zaroorat nahi kyunki AI function local
   test ke liye alag setup chahiye hoga; deploy hote hi ye kaam karega.)
6. Project chalayen:
   ```bash
   npm run dev
   ```
7. Browser mein `http://localhost:5173` khol kar public dashboard dekhein.
   `http://localhost:5173/#admin` pe committee panel dekhein
   (default password `change-me-before-you-deploy` hai — isko
   `src/components/AdminPanel.jsx` file mein change kar dein, apni marzi ka
   password rakh lein).
8. Ek test donation aur ek test expense daal ke check kar lein sab kaam
   kar raha hai.

---

## Phase 4 — GitHub Pe Public Repo Banana

**Command line se (recommended, GitHub Desktop ki zaroorat nahi):**

1. https://github.com pe account bana lein agar nahi hai.
2. GitHub website pe **New repository** click karen. Naam den (e.g.
   `sadaqah-ledger`), **Public** select karen (zaroori hai — private
   0 marks degi), **Create repository**.
3. Apne project folder mein terminal mein:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Sadaqah Ledger"
   git branch -M main
   git remote add origin https://github.com/AAPKA-USERNAME/sadaqah-ledger.git
   git push -u origin main
   ```
4. GitHub pe repo khol kar confirm karen `.env` file **wahan nahi honi
   chahiye** (sirf `.env.example` honi chahiye). Agar `.env` dikh rahi hai,
   turant `.gitignore` check karen aur:
   ```bash
   git rm --cached .env
   git commit -m "Remove leaked env file"
   git push
   ```

**Ya GitHub Desktop se (agar GUI prefer karte hain):**
1. GitHub Desktop install karen, sign in karen.
2. **File > Add local repository**, project folder select karen.
3. **Publish repository** click karen, **Keep this code private** ka
   checkbox UNCHECK karen (public rehne dein).
4. Changes commit + push kar dein.

---

## Phase 5 — Vercel Pe Deploy Karna

1. https://vercel.com pe jayen, **"Continue with GitHub"** se sign up karen.
2. Dashboard mein **Add New > Project** click karen.
3. Apna `sadaqah-ledger` repo import karen.
4. Vercel khud detect kar lega ke ye Vite project hai.
5. **Environment Variables** section expand karen, aur ye sab add karen
   (name aur value dono):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY` ← ye Phase 2 wali key
6. **Deploy** click karen. 1-2 minute mein live URL mil jayega
   (e.g. `sadaqah-ledger.vercel.app`).
7. Us URL ko **incognito window** mein khol kar test karen — public
   dashboard aur `#admin` dono check karen. Ye wahi URL hai jo README mein
   aur portal pe submit karni hai.

---

## Phase 6 — Final Checks Before Submitting

- [ ] GitHub repo public hai (incognito mein khol ke confirm kiya)
- [ ] `.env` file repo mein nahi hai
- [ ] Live URL incognito mein khul raha hai aur kaam kar raha hai
- [ ] Kam az kam ek donation aur ek expense entry daal di hai taake grader ko
      khaali app na mile
- [ ] README.md mein live URL, screenshots, aur apna naam fill kar diya hai
- [ ] `AdminPanel.jsx` mein default password change kar diya hai

Ho gaya — submit kar dein! 🎉
