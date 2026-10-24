import type { Context } from '@netlify/functions'

/*
 * Setu Saathi chat — proxies messages to Google Gemini.
 * Serves at /.netlify/functions/chat (POST { messages: [{ from: 'me' | 'bot', text }] }).
 *
 * Set these in Netlify → Project configuration → Environment variables
 * (scope must include "Functions"), then redeploy:
 *   GEMINI_API_KEY  (required) — from https://aistudio.google.com/apikey
 *   GEMINI_MODEL    (optional) — defaults to gemini-2.5-flash
 *
 * The key stays on the server; it is never sent to the browser.
 */

const DEFAULT_MODEL = 'gemini-2.5-flash'
const MAX_TURNS = 10
const MAX_CHARS = 1000

const SYSTEM_PROMPT = `You are "Setu Saathi", the friendly assistant of Student Setu — India's student network platform (tagline: "Bridging Students, Building Futures").
Help students who are moving to a new city for college. Reply in the same language the student uses (English, Hindi or Hinglish).
Keep answers short: at most about 120 words, simple words, a few bullet points when useful.

When it helps, point the student to ONE OR TWO of these pages, writing the path exactly as shown:
/hostels — Hostel & Stay Finder (college, government and private hostels, PGs, rent rooms; filters for budget, gender, AC, food, distance)
/tiffin — Tiffin & Mess Finder (menus, monthly price, veg/non-veg, delivery areas)
/connect — Connect with local students, city WhatsApp/Telegram groups, area guides
/colleges — College directory (official website, contact, courses, hostels)
/resources — Free notes, syllabus and PYQs by Course → University → Year → Semester → Subject
/skills — Skill roadmaps, free courses and videos (DSA, web dev, AI/ML, design, aptitude…)
/careers — Internships & jobs with year-wise guidance (always links to the original source)
/exams — Competitive & government exams + free quizzes (no registration, instant score)
/scholarships — Government and private scholarships filtered by course, state, category, marks, income
/library — E-Library of legally shareable books (NCERT, OpenStax, NPTEL, public domain)
/sidf — SIDF: mentors, workshops, hackathon prep, team formation, idea feedback
/signup — create an account (Student, Hostel Owner, Tiffin Provider, Mentor)
/help — contact the Student Setu team

Rules:
- Do not invent specific listings, prices, phone numbers or deadlines; suggest the relevant page instead.
- For scholarships, exams and jobs, remind students to confirm details on the official website.
- Never ask for passwords, OTPs, Aadhaar numbers or payment details.
- If a question is unrelated to student life, answer briefly and kindly steer back.`

type IncomingMessage = { from?: string; text?: string }

const json = (body: unknown, status = 200) => Response.json(body, { status })

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  const apiKey = Netlify.env.get('GEMINI_API_KEY')
  if (!apiKey) return json({ error: 'not_configured' }, 503)

  let body: { messages?: IncomingMessage[] }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'invalid_json' }, 400)
  }

  // Convert the widget's history into Gemini's format, capped in size.
  const contents = (Array.isArray(body?.messages) ? body.messages : [])
    .filter((m) => typeof m?.text === 'string' && m.text.trim())
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.from === 'me' ? 'user' : 'model', parts: [{ text: String(m.text).slice(0, MAX_CHARS) }] }))
  // Gemini expects the conversation to start and end with the user.
  while (contents.length && contents[0].role !== 'user') contents.shift()
  if (!contents.length || contents[contents.length - 1].role !== 'user') return json({ error: 'no_user_message' }, 400)

  const model = Netlify.env.get('GEMINI_MODEL') || DEFAULT_MODEL
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`

  let upstream: Response
  try {
    upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
      }),
    })
  } catch (err) {
    console.error('Gemini request failed:', err)
    return json({ error: 'upstream_unreachable' }, 502)
  }

  if (!upstream.ok) {
    // Log details for the Netlify function logs; never echo them (or the key) to the browser.
    console.error(`Gemini error ${upstream.status}:`, (await upstream.text()).slice(0, 500))
    return json({ error: upstream.status === 429 ? 'rate_limited' : 'upstream_error' }, upstream.status === 429 ? 429 : 502)
  }

  const data = await upstream.json()
  const reply: string = (data?.candidates?.[0]?.content?.parts ?? [])
    .map((p: { text?: string }) => p.text ?? '')
    .join('')
    .trim()
  if (!reply) return json({ error: 'empty_reply' }, 502)

  return json({ reply, model })
}
