import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Download, ExternalLink, FileQuestion, Gift, RotateCcw, Timer, Trophy, XCircle } from 'lucide-react'
import { Badge, ChipGroup, EmptyState, Modal, PageHeader, SectionHeader } from '../components/ui'
import { useData } from '../context/DataContext'
import { useToast } from '../context/AppContext'
import { examCategories, exams, quizById, quizzes } from '../data/exams'

export default function Exams() {
  const [params] = useSearchParams()
  const [cat, setCat] = useState('All')
  const [open, setOpen] = useState(() => exams.find((e) => e.id === params.get('exam')) ?? null)
  const toast = useToast()
  const list = exams.filter((e) => cat === 'All' || e.category === cat)

  return (
    <>
      <PageHeader icon={FileQuestion} kicker="Competitive & Government Exams" title="Prepare smarter, for free" subtitle="Exam-wise syllabus, PYQs and study resources — plus free quizzes with instant scores and explanations. No registration, no fees." crumbs={[{ label: 'Exams & Quizzes' }]} />
      <div className="container-x py-8">
        <ChipGroup value={cat} onChange={setCat} options={examCategories.map((c) => ({ value: c, label: c }))} />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((e) => (
            <button key={e.id} onClick={() => setOpen(e)} className="card card-hover flex flex-col p-5 text-left">
              <div className="flex items-start justify-between gap-2"><h3 className="font-display text-xl font-extrabold">{e.name}</h3><Badge tone="purple">{e.category}</Badge></div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{e.full}</p>
              <p className="mt-1 text-xs text-slate-500">{e.body}</p>
              <div className="mt-auto flex items-center justify-between pt-4 text-xs text-slate-500"><span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {e.frequency}</span><span className="font-semibold text-brand-700 dark:text-brand-300">Syllabus & PYQs →</span></div>
            </button>
          ))}
        </div>

        <section className="mt-14 scroll-mt-24" id="quizzes">
          <SectionHeader icon={Trophy} title="Free online quizzes" subtitle="No registration · No fees · Instant score with answer explanations" />
          <div className="mb-5 flex items-center gap-3 rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-400/20"><Gift className="h-5 w-5" /> Just click start — your results are saved on this device.</div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((q, i) => (
              <div key={q.id} className="card card-hover relative overflow-hidden p-5">
                <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${['bg-brand-100', 'bg-saffron-100', 'bg-emerald-100', 'bg-violet-100', 'bg-sky-100', 'bg-rose-100'][i % 6]} opacity-70 dark:opacity-10`} />
                <p className="relative text-xs font-semibold text-saffron-600">{q.tag}</p>
                <h3 className="relative mt-1 text-lg font-bold">{q.title}</h3>
                <div className="relative mt-3 flex gap-3 text-xs text-slate-500"><span>{q.questions.length} questions</span><span>· {q.minutes} min</span><span>· {q.level}</span></div>
                <Link to={`/quiz/${q.id}`} className="btn-primary relative mt-4 w-full">Start quiz <ArrowRight className="h-4 w-4" /></Link>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Modal open={Boolean(open)} onClose={() => setOpen(null)} title={open ? `${open.name} — ${open.full}` : ''} wide>
        {open && (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/5"><p className="text-xs text-slate-500">Conducted by</p><p className="text-sm font-semibold">{open.body}</p></div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/5"><p className="text-xs text-slate-500">Eligibility</p><p className="text-sm font-semibold">{open.eligibility}</p></div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/5"><p className="text-xs text-slate-500">Pattern</p><p className="text-sm font-semibold">{open.pattern}</p></div>
            </div>
            <div>
              <h4 className="mb-2 font-bold">Syllabus</h4>
              <div className="flex flex-wrap gap-2">{open.syllabus.map((s) => <Badge key={s} tone="brand">{s}</Badge>)}</div>
            </div>
            <div>
              <h4 className="mb-2 font-bold">Previous year papers</h4>
              <ul className="grid gap-2 sm:grid-cols-2">
                {[2025, 2024, 2023, 2022].map((y) => (
                  <li key={y} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2 text-sm dark:border-white/10">{open.name} {y} paper + answer key<button onClick={() => toast('Demo: PYQ PDFs are linked from official sources in production.', 'info')} className="text-brand-700 dark:text-brand-300" aria-label="Download"><Download className="h-4 w-4" /></button></li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to={`/quiz/${open.quiz}`} className="btn-primary">Practice quiz</Link>
              <Link to="/library" className="btn-outline">Study material in E-Library</Link>
              {open.website ? <a href={open.website} target="_blank" rel="noreferrer" className="btn-ghost">Official website <ExternalLink className="h-4 w-4" /></a> : <span className="self-center text-xs text-slate-500">{open.websiteNote}</span>}
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

export function Quiz() {
  const { id } = useParams()
  const quiz = quizById(id)
  const navigate = useNavigate()
  const { addQuizResult } = useData()
  const [answers, setAnswers] = useState({})
  const [idx, setIdx] = useState(0)
  const [done, setDone] = useState(false)
  const [secs, setSecs] = useState(() => (quiz?.minutes ?? 5) * 60)

  useEffect(() => {
    if (done || !quiz) return
    const t = setInterval(() => setSecs((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [done, quiz])
  useEffect(() => {
    if (secs <= 0 && !done) finish()
  }, [secs]) // eslint-disable-line react-hooks/exhaustive-deps

  const score = useMemo(() => (quiz ? quiz.questions.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0) : 0), [answers, quiz])
  if (!quiz) return <div className="container-x py-16"><EmptyState icon={FileQuestion} title="Quiz not found" action={<Link to="/exams" className="btn-primary">All quizzes</Link>} /></div>

  const total = quiz.questions.length
  const q = quiz.questions[idx]
  function finish() {
    setDone(true)
    addQuizResult({ quizId: quiz.id, title: quiz.title, score: quiz.questions.reduce((s, qq, i) => s + (answers[i] === qq.answer ? 1 : 0), 0), total })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const restart = () => { setAnswers({}); setIdx(0); setDone(false); setSecs(quiz.minutes * 60) }
  const pct = Math.round((score / total) * 100)

  return (
    <div className="container-x max-w-3xl py-8">
      <button onClick={() => navigate('/exams#quizzes')} className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-700"><ArrowLeft className="h-4 w-4" /> All quizzes</button>
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between bg-gradient-to-r from-brand-900 to-brand-700 px-5 py-4 text-white">
          <div><p className="text-xs text-brand-200">{quiz.tag}</p><h1 className="text-xl font-bold text-white">{quiz.title}</h1></div>
          {!done && <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${secs < 60 ? 'bg-rose-500' : 'bg-white/15'}`}><Timer className="h-4 w-4" /> {Math.floor(Math.max(secs, 0) / 60)}:{String(Math.max(secs, 0) % 60).padStart(2, '0')}</span>}
        </div>

        {!done ? (
          <div className="p-5 sm:p-6">
            <div className="mb-4 flex gap-1">{quiz.questions.map((_, i) => <button key={i} onClick={() => setIdx(i)} aria-label={`Question ${i + 1}`} className={`h-1.5 flex-1 rounded-full transition ${i === idx ? 'bg-saffron-500' : answers[i] !== undefined ? 'bg-brand-600' : 'bg-slate-200 dark:bg-white/10'}`} />)}</div>
            <p className="text-sm text-slate-500">Question {idx + 1} of {total}</p>
            <AnimatePresence mode="wait">
              <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="mt-1 text-lg font-bold">{q.question}</h2>
                <div className="mt-4 space-y-2">
                  {q.options.map((o, oi) => (
                    <button key={oi} onClick={() => setAnswers((a) => ({ ...a, [idx]: oi }))} className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${answers[idx] === oi ? 'border-brand-700 bg-brand-50 text-brand-900 dark:border-brand-400 dark:bg-brand-500/15 dark:text-white' : 'border-slate-200 hover:border-brand-300 dark:border-white/10'}`}>
                      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${answers[idx] === oi ? 'bg-brand-800 text-white' : 'bg-slate-100 text-slate-500 dark:bg-white/10'}`}>{String.fromCharCode(65 + oi)}</span>{o}
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="mt-6 flex items-center justify-between">
              <button disabled={idx === 0} onClick={() => setIdx((i) => i - 1)} className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Previous</button>
              {idx < total - 1 ? <button onClick={() => setIdx((i) => i + 1)} className="btn-primary">Next <ArrowRight className="h-4 w-4" /></button> : <button onClick={finish} className="btn-accent">Submit ({Object.keys(answers).length}/{total} answered)</button>}
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6">
            <div className="flex flex-col items-center py-4 text-center">
              <div className="relative grid h-32 w-32 place-items-center rounded-full" style={{ background: `conic-gradient(${pct >= 60 ? '#10b981' : '#f97316'} ${pct * 3.6}deg, rgb(148 163 184 / .2) 0)` }}>
                <div className="grid h-24 w-24 place-items-center rounded-full bg-white dark:bg-ink-900"><p className="font-display text-3xl font-extrabold">{score}/{total}</p></div>
              </div>
              <p className="mt-4 text-xl font-bold">{pct >= 80 ? 'Excellent! 🎉' : pct >= 60 ? 'Good job! 👍' : 'Keep practising 💪'}</p>
              <p className="text-sm text-slate-500">You scored {pct}%. Review the explanations below.</p>
              <div className="mt-4 flex gap-2"><button onClick={restart} className="btn-primary"><RotateCcw className="h-4 w-4" /> Retry</button><Link to="/exams#quizzes" className="btn-outline">More quizzes</Link></div>
            </div>
            <ol className="mt-6 space-y-4">
              {quiz.questions.map((qq, i) => {
                const ok = answers[i] === qq.answer
                return (
                  <li key={i} className={`rounded-2xl border p-4 ${ok ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-400/20 dark:bg-emerald-500/5' : 'border-rose-200 bg-rose-50/50 dark:border-rose-400/20 dark:bg-rose-500/5'}`}>
                    <p className="flex gap-2 font-semibold">{ok ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /> : <XCircle className="h-5 w-5 shrink-0 text-rose-600" />} {i + 1}. {qq.question}</p>
                    <p className="mt-2 text-sm">Correct answer: <b>{qq.options[qq.answer]}</b>{!ok && <span className="text-slate-500"> · Your answer: {answers[i] !== undefined ? qq.options[answers[i]] : 'Not answered'}</span>}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">💡 {qq.explanation}</p>
                  </li>
                )
              })}
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}
