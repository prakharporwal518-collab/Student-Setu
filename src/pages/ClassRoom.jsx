import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpenCheck, CheckCircle2, ClipboardList, Loader2, LogIn, School, XCircle } from 'lucide-react'
import { Badge, EmptyState, PageHeader } from '../components/ui'
import { ListenButton } from '../components/ui/Share'
import { useAuth, useToast } from '../context/AppContext'
import { getClass, submitQuiz } from '../services/classroom'

function Join() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  return (
    <>
      <PageHeader icon={School} kicker="Join a class" title="Enter your class code" subtitle="Your teacher shares a 6-letter code. No login needed — notes and quizzes open instantly." crumbs={[{ label: 'Join class' }]} />
      <div className="container-x max-w-md py-10">
        <form onSubmit={(e) => { e.preventDefault(); if (code.trim()) navigate(`/class/${code.trim().toUpperCase()}`) }} className="card space-y-4 p-6">
          <label className="label" htmlFor="code">Class code</label>
          <input id="code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))} className="input text-center font-mono text-2xl tracking-[0.4em]" placeholder="ABC123" autoComplete="off" />
          <button className="btn-accent w-full" disabled={code.length !== 6}><LogIn className="h-4 w-4" /> Join class</button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">Are you a teacher? <Link to="/teacher" className="link">Open Teacher Copilot</Link></p>
      </div>
    </>
  )
}

function TakeQuiz({ code, quiz, onBack }) {
  const { user } = useAuth()
  const toast = useToast()
  const [name, setName] = useState(user?.name ?? '')
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const submit = async () => {
    setBusy(true)
    try {
      setResult(await submitQuiz(code, quiz.id, name, quiz.questions.map((_, i) => answers[i] ?? null)))
    } catch (e) {
      toast(e.message, 'warning')
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="card space-y-5 p-6">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-700"><ArrowLeft className="h-4 w-4" /> Back to class</button>
      <h2 className="text-xl font-bold">{quiz.title}</h2>
      {!result ? (
        <>
          <div><label className="label" htmlFor="sname">Your name (your teacher sees this)</label><input id="sname" value={name} onChange={(e) => setName(e.target.value)} className="input" /></div>
          {quiz.questions.map((q, i) => (
            <fieldset key={i}>
              <legend className="mb-2 text-sm font-semibold">{i + 1}. {q.q}</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {q.options.map((o, oi) => (
                  <label key={oi} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm ${answers[i] === oi ? 'border-brand-700 bg-brand-50 dark:border-brand-400 dark:bg-brand-500/15' : 'border-slate-200 dark:border-white/10'}`}>
                    <input type="radio" name={`cq${i}`} className="accent-brand-700" checked={answers[i] === oi} onChange={() => setAnswers((a) => Object.assign([...a], { [i]: oi }))} /> {o}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <button onClick={submit} disabled={busy || name.trim().length < 2} className="btn-accent w-full">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Submit answers</button>
        </>
      ) : (
        <>
          <p className="text-lg font-bold">You scored {result.score}/{result.total} {result.score / result.total >= 0.6 ? '🎉' : '💪'}</p>
          <ol className="space-y-3">
            {quiz.questions.map((q, i) => {
              const r = result.results[i]
              return (
                <li key={i} className={`rounded-xl border p-3 text-sm ${r.correct ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-400/20 dark:bg-emerald-500/5' : 'border-rose-200 bg-rose-50/60 dark:border-rose-400/20 dark:bg-rose-500/5'}`}>
                  <p className="flex gap-2 font-semibold">{r.correct ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> : <XCircle className="h-4 w-4 shrink-0 text-rose-600" />} {q.q}</p>
                  <p className="mt-1">Correct answer: <b>{q.options[r.answer]}</b></p>
                  {r.explanation && <p className="text-slate-600 dark:text-slate-300">💡 {r.explanation}</p>}
                </li>
              )
            })}
          </ol>
          <button onClick={onBack} className="btn-primary">Back to class</button>
        </>
      )}
    </div>
  )
}

export default function ClassRoom() {
  const { code } = useParams()
  const [state, setState] = useState({ loading: Boolean(code) })
  const [quiz, setQuiz] = useState(null)
  useEffect(() => {
    if (!code) return
    setState({ loading: true })
    getClass(code).then((r) => setState({ loading: false, ...r }), (e) => setState({ loading: false, error: e.message }))
  }, [code])

  if (!code) return <Join />
  const cls = state.class
  return (
    <>
      <PageHeader icon={School} kicker={`Class ${code}`} title={cls ? cls.subject : state.error ? 'Class not found' : 'Loading class…'} subtitle={cls ? `${cls.teacherName}${cls.course ? ` · ${cls.course}` : ''}${cls.semester ? ` · Semester ${cls.semester}` : ''}` : ''} crumbs={[{ label: 'Join class', to: '/class' }, { label: code }]} />
      <div className="container-x max-w-4xl py-8">
        {state.loading && <p className="flex items-center gap-2 text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p>}
        {state.error && <EmptyState icon={School} title="Class not found" text={state.error} action={<Link to="/class" className="btn-primary">Try another code</Link>} />}
        {cls && quiz && <TakeQuiz code={cls.code} quiz={quiz} onBack={() => setQuiz(null)} />}
        {cls && !quiz && (
          <div className="grid gap-6 md:grid-cols-2">
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold"><ClipboardList className="h-5 w-5 text-saffron-500" /> Quizzes</h2>
              {cls.quizzes.length === 0 ? <p className="card p-4 text-sm text-slate-500">No quizzes yet.</p> : (
                <ul className="space-y-3">{cls.quizzes.map((q) => <li key={q.id} className="card flex items-center justify-between gap-3 p-4"><div><p className="font-semibold">{q.title}</p><p className="text-xs text-slate-500">{q.questions.length} questions · auto-graded</p></div><button onClick={() => setQuiz(q)} className="btn-accent py-2">Start</button></li>)}</ul>
              )}
            </section>
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold"><BookOpenCheck className="h-5 w-5 text-emerald-600" /> Notes from your teacher</h2>
              {cls.notes.length === 0 ? <p className="card p-4 text-sm text-slate-500">No notes yet.</p> : (
                <ul className="space-y-3">{cls.notes.map((n) => <li key={n.id} className="card p-4"><p className="font-semibold">{n.title}</p>{n.text && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{n.text}</p>}<div className="mt-2 flex flex-wrap gap-2">{n.url && <a href={n.url} target="_blank" rel="noreferrer" className="btn-outline py-1.5 text-xs">Open ↗</a>}{n.text && <ListenButton text={`${n.title}. ${n.text}`} className="py-1.5 text-xs" />}</div></li>)}</ul>
              )}
            </section>
            {state.mode === 'local' && <p className="md:col-span-2"><Badge tone="gray">Saved on this device — when the site is online, class codes work on every phone.</Badge></p>}
          </div>
        )}
      </div>
    </>
  )
}
