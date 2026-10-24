import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, Send, Sparkles, X } from 'lucide-react'

// Gemini answers via the Netlify Function in netlify/functions/chat.mts (the API key stays on the server).
// If it is unavailable — no key configured, local `npm run dev`, network error — the FAQ answers below are used.
const CHAT_ENDPOINT = '/.netlify/functions/chat'

// Pages the assistant may mention; any of these paths in a reply becomes a button.
const pageLinks = {
  '/skill-bridge': 'Skill Bridge', '/teacher': 'Teacher Copilot', '/vocational': 'Vocational training', '/class': 'Join a class',
  '/hostels': 'Hostel Finder', '/tiffin': 'Tiffin & Mess', '/connect': 'Local Students', '/colleges': 'Colleges',
  '/resources': 'Study Resources', '/skills': 'Skills & Videos', '/careers': 'Internships & Jobs', '/exams': 'Exams & Quizzes',
  '/scholarships': 'Scholarships', '/library': 'E-Library', '/sidf': 'SIDF', '/signup': 'Create an account', '/help': 'Contact support',
}
const linksIn = (text) =>
  Object.entries(pageLinks)
    .filter(([path]) => new RegExp(`(^|[\\s(*"'])${path}(?![\\w/-])`).test(text))
    .slice(0, 2)

/** Renders **bold** and "- " / "* " bullet lines from the model's reply. */
function RichText({ text }) {
  const bold = (line, key) =>
    line.split(/(\*\*[^*]+\*\*)/g).map((part, i) => (part.startsWith('**') && part.endsWith('**') ? <b key={`${key}-${i}`}>{part.slice(2, -2)}</b> : part))
  return text.split('\n').map((line, i) => {
    const bullet = /^\s*[-*•]\s+/.test(line)
    const clean = line.replace(/^\s*[-*•]\s+/, '')
    if (!clean.trim()) return <span key={i} className="block h-1.5" />
    return bullet ? (
      <span key={i} className="flex gap-1.5"><span aria-hidden>•</span><span>{bold(clean, i)}</span></span>
    ) : (
      <span key={i} className="block">{bold(clean, i)}</span>
    )
  })
}

async function askGemini(history) {
  const res = await fetch(CHAT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: history.map(({ from, text }) => ({ from, text })) }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.reply) throw new Error(data.error || `HTTP ${res.status}`)
  return data.reply
}

// Offline FAQ answers (fallback).
const intents = [
  { match: ['gap', 'career', 'job ready', 'roadmap', 'plan', 'badge'], text: 'Skill Bridge compares your university syllabus with what jobs need, builds a weekly plan for the gaps and lets you earn verified badges.', link: ['/skill-bridge', 'Open Skill Bridge'] },
  { match: ['teacher', 'lesson', 'question paper', 'class code'], text: 'Teacher Copilot creates lesson plans, question papers and auto-graded quizzes, with a weak-topic heatmap for your class.', link: ['/teacher', 'Open Teacher Copilot'] },
  { match: ['iti', 'vocational', 'electrician', 'solar', 'repair', 'tally', 'trade'], text: 'Vocational tracks in Hindi and English with verified skill tests and apprenticeship links.', link: ['/vocational', 'Vocational training'] },
  { match: ['hostel', 'pg', 'room', 'stay'], text: 'You can browse verified hostels, PGs and rooms with filters for budget, gender, AC and food.', link: ['/hostels', 'Open Hostel Finder'] },
  { match: ['tiffin', 'food', 'mess', 'khana'], text: 'Find home-style tiffin and mess services by area, price and veg/non-veg.', link: ['/tiffin', 'Open Tiffin Finder'] },
  { match: ['note', 'pyq', 'syllabus', 'paper'], text: 'Study resources are organised as Course → University → Year → Semester → Subject. All academic content is free.', link: ['/resources', 'Open Study Resources'] },
  { match: ['scholar', 'money', 'fee'], text: 'Filter government and private scholarships by course, state, category, marks and family income.', link: ['/scholarships', 'Find Scholarships'] },
  { match: ['intern', 'job', 'placement'], text: 'Check year-wise guidance and listings that link to the original source.', link: ['/careers', 'Internships & Jobs'] },
  { match: ['quiz', 'exam', 'gate', 'upsc', 'ssc'], text: 'Take free quizzes — no registration, instant score with explanations.', link: ['/exams', 'Exams & Quizzes'] },
  { match: ['owner', 'list', 'register', 'provider'], text: 'Hostel owners and tiffin providers have separate portals to register and manage listings.', link: ['/signup', 'Create an account'] },
  { match: ['mentor', 'startup', 'idea', 'sidf', 'hackathon'], text: 'SIDF offers mentorship, workshops and a hackathon prep hub.', link: ['/sidf', 'Explore SIDF'] },
]
const answer = (q) => {
  const s = q.toLowerCase()
  return intents.find((i) => i.match.some((m) => s.includes(m))) ?? { text: 'I can help with your skill gap & learning plan, teacher tools, notes, exams, vocational courses, scholarships and internships. You can also reach our team from the Help page.', link: ['/help', 'Contact support'] }
}
const suggestions = ['What skills do I need for web development?', 'Free PYQs', 'I am a teacher', 'Vocational courses in Hindi']

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState([{ from: 'bot', text: 'Namaste! 👋 I’m Setu Saathi. What are you looking for today?' }])
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, open, loading])


  const send = async (raw) => {
    const text = raw.trim()
    if (!text || loading) return
    const history = [...msgs, { from: 'me', text }]
    setMsgs(history)
    setInput('')
    setLoading(true)
    try {
      const reply = await askGemini(history)
      setMsgs((m) => [...m, { from: 'bot', text: reply, ai: true, links: linksIn(reply) }])
    } catch {
      const a = answer(text)
      setMsgs((m) => [...m, { from: 'bot', text: a.text, links: [a.link] }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }} className="fixed bottom-24 right-4 z-[70] flex h-[480px] max-h-[70vh] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-ink-900">
            <div className="flex items-center justify-between bg-brand-800 px-4 py-3 text-white">
              <div>
                <p className="font-display font-bold">Setu Saathi</p>
                <p className="flex items-center gap-1 text-xs text-brand-200"><Sparkles className="h-3 w-3" /> AI assistant · powered by Gemini</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-lg p-1 hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : ''}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${m.from === 'me' ? 'rounded-br-sm bg-brand-800 text-white' : 'rounded-bl-sm bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200'}`}>
                    {m.from === 'bot' ? <RichText text={m.text} /> : m.text}
                    {m.links?.map(([to, label]) => (
                      <Link key={to} to={to} onClick={() => setOpen(false)} className="mt-1.5 block font-semibold text-saffron-600 dark:text-saffron-400">
                        {label} →
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex" role="status" aria-label="Setu Saathi is typing">
                  <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3 dark:bg-white/10">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${d * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
              {msgs.length === 1 && (
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button key={s} onClick={() => send(s)} className="chip-off text-xs">
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
              className="flex items-center gap-2 border-t border-slate-100 p-3 dark:border-white/10"
            >
              <input value={input} onChange={(e) => setInput(e.target.value)} maxLength={1000} placeholder="Ask in English or Hindi…" className="input py-2" aria-label="Message" />
              <button disabled={loading || !input.trim()} className="btn-accent h-10 w-10 shrink-0 p-0" aria-label="Send">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }} onClick={() => setOpen((o) => !o)} className="fixed bottom-5 right-4 z-[70] grid h-14 w-14 place-items-center rounded-full bg-brand-700 text-white shadow-lift ring-4 ring-white dark:ring-ink-950" aria-label={open ? 'Close help chat' : 'Open help chat'}>
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>
    </>
  )
}
