// Vercel serverless function: POST /api/summary
// Runs server-side only, so GEMINI_API_KEY never reaches the browser.
// Set GEMINI_API_KEY in Vercel Project Settings > Environment Variables.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { month, donations = [], expenses = [] } = req.body || {}

  const totalDonations = donations.reduce((s, d) => s + Number(d.amount || 0), 0)
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount || 0), 0)
  const expenseByCategory = {}
  for (const e of expenses) {
    const cat = e.category || 'Other'
    expenseByCategory[cat] = (expenseByCategory[cat] || 0) + Number(e.amount || 0)
  }

  const systemPrompt = `You are a financial transparency assistant for a mosque/community fund.
Given this month's donations and expenses data (JSON), write a clear, honest, 3-4 sentence
summary in simple language for community members. Mention total donations, total expenses,
the top expense category, and the resulting balance change. Do not invent numbers — use only
the data provided. Write in a warm but neutral, factual tone, in English.`

  const userContent = JSON.stringify({
    month,
    totalDonations,
    totalExpenses,
    donationCount: donations.length,
    expenseByCategory,
  })

  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' })
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userContent }] }],
        }),
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      return res.status(502).json({ error: 'Gemini request failed', detail: errText })
    }

    const data = await response.json()
    const summary =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      'No summary could be generated for this month yet.'

    return res.status(200).json({ summary })
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error', detail: String(err) })
  }
}
