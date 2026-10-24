import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, Send, X } from 'lucide-react'

// Lightweight FAQ helper bot. Swap `answer()` for a real AI/helpdesk API later.
const intents = [
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
  return intents.find((i) => i.match.some((m) => s.includes(m))) ?? { text: 'I can help with hostels, tiffin, notes, scholarships, internships, exams and SIDF. You can also reach our team from the Help page.', link: ['/help', 'Contact support'] }
}
const suggestions = ['Find a PG near my college', 'Free PYQs', 'Scholarships for girls', 'How to list my hostel?']

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState([{ from: 'bot', text: 'Namaste! 👋 I’m Setu Saathi. What are you looking for today?' }])
  const endRef = useRef(null)
  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [msgs, open])

  const send = (text) => {
    if (!text.trim()) return
    const a = answer(text)
    setMsgs((m) => [...m, { from: 'me', text }, { from: 'bot', text: a.text, link: a.link }])
    setInput('')
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }} className="fixed bottom-24 right-4 z-[70] flex h-[480px] max-h-[70vh] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-ink-900">
            <div className="flex items-center justify-between bg-brand-800 px-4 py-3 text-white">
              <div>
                <p className="font-display font-bold">Setu Saathi</p>
                <p className="text-xs text-brand-200">Usually replies instantly</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-lg p-1 hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : ''}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${m.from === 'me' ? 'rounded-br-sm bg-brand-800 text-white' : 'rounded-bl-sm bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200'}`}>
                    {m.text}
                    {m.link && (
                      <Link to={m.link[0]} onClick={() => setOpen(false)} className="mt-1.5 block font-semibold text-saffron-600 dark:text-saffron-400">
                        {m.link[1]} →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
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
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question…" className="input py-2" aria-label="Message" />
              <button className="btn-accent h-10 w-10 shrink-0 p-0" aria-label="Send">
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
