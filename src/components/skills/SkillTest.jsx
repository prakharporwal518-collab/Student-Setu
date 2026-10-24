import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, BadgeCheck, CheckCircle2, Copy, ExternalLink, Loader2, RotateCcw, ShieldCheck, XCircle } from 'lucide-react'
import { Modal } from '../ui'
import { WhatsAppButton } from '../ui/Share'
import { useAuth, useToast } from '../../context/AppContext'
import { gradeTest, loadTest, verifyUrl } from '../../services/badges'

export const linkedInShare = (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`

/** Printable-looking certificate for a verified badge. */
export function BadgeCertificate({ payload, token, compact = false }) {
  const toast = useToast()
  const url = token ? verifyUrl(token) : null
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-white via-emerald-50 to-saffron-50 p-5 dark:border-emerald-400/30 dark:from-ink-900 dark:via-emerald-500/5 dark:to-saffron-500/5">
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-200/50 dark:bg-emerald-500/10" />
      <div className="relative flex items-start gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lift">
          <Award className="h-7 w-7" />
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            <BadgeCheck className="h-4 w-4" /> Setu Verified Skill
          </p>
          <p className="font-display text-xl font-extrabold text-slate-900 dark:text-white">{payload.title}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Awarded to <b>{payload.name}</b> · Score {payload.score}/{payload.total}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Issued {new Date(payload.issuedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })} · ID {payload.id}
            {payload.demo && ' · demo signature'}
          </p>
        </div>
      </div>
      {!compact && url && (
        <div className="relative mt-4 flex flex-wrap gap-2">
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(url)
                toast('Verification link copied')
              } catch {
                toast(url, 'info')
              }
            }}
            className="btn-outline py-2"
          >
            <Copy className="h-4 w-4" /> Copy verify link
          </button>
          <a href={linkedInShare(url)} target="_blank" rel="noreferrer" className="btn bg-[#0a66c2] py-2 text-white hover:opacity-90">
            Share on LinkedIn
          </a>
          <WhatsAppButton text={`I earned a verified ${payload.title} badge on Student Setu! Verify it here: ${url}`} label="WhatsApp" />
          <Link to={`/verify/${token}`} className="btn-ghost py-2">
            <ExternalLink className="h-4 w-4" /> Open
          </Link>
        </div>
      )}
    </div>
  )
}

/** 5-question skill test, graded on the server. Pass 4/5 to earn a signed badge. */
export function SkillTestModal({ skill, open, onClose, onPassed }) {
  const { user } = useAuth()
  const [test, setTest] = useState(null)
  const [error, setError] = useState('')
  const [name, setName] = useState(user?.name ?? '')
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open || !skill) return
    setTest(null)
    setError('')
    setResult(null)
    setAnswers([])
    loadTest(skill).then(setTest, (e) => setError(e.message))
  }, [open, skill])

  const submit = async () => {
    setBusy(true)
    setError('')
    try {
      const r = await gradeTest(skill, name, answers)
      setResult(r)
      if (r.passed) onPassed?.(r)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={test ? `${test.title} — skill test` : 'Skill test'} wide>
      {error && <p className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200">{error}</p>}
      {!test && !error && (
        <p className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading questions…
        </p>
      )}
      {test && !result && (
        <div className="space-y-5">
          <p className="flex items-start gap-2 rounded-xl bg-brand-50 p-3 text-sm text-brand-900 dark:bg-white/5 dark:text-brand-100">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /> Answers are checked on our server — get {test.passMark} of {test.questions.length} right to earn a badge anyone can verify.
          </p>
          <div>
            <label className="label" htmlFor="badge-name">Name on the badge</label>
            <input id="badge-name" value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Your full name" />
          </div>
          {test.questions.map((q, i) => (
            <fieldset key={i}>
              <legend className="mb-2 text-sm font-semibold text-slate-800 dark:text-white">
                {i + 1}. {q.question}
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {q.options.map((o, oi) => (
                  <label key={oi} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${answers[i] === oi ? 'border-brand-700 bg-brand-50 dark:border-brand-400 dark:bg-brand-500/15' : 'border-slate-200 hover:border-brand-300 dark:border-white/10'}`}>
                    <input type="radio" name={`q${i}`} className="accent-brand-700" checked={answers[i] === oi} onChange={() => setAnswers((a) => Object.assign([...a], { [i]: oi }))} />
                    {o}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <button onClick={submit} disabled={busy || name.trim().length < 2 || answers.filter((a) => a !== undefined).length < test.questions.length} className="btn-accent w-full">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} Submit for verification
          </button>
          {name.trim().length < 2 && <p className="text-center text-xs text-slate-400">Enter your name and answer every question to submit.</p>}
        </div>
      )}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {result.passed ? <CheckCircle2 className="h-10 w-10 text-emerald-500" /> : <XCircle className="h-10 w-10 text-rose-500" />}
            <div>
              <p className="text-xl font-bold">{result.passed ? 'Badge earned! 🎉' : 'Not quite yet'}</p>
              <p className="text-sm text-slate-500">
                You scored {result.score}/{result.total}. {result.passed ? 'Your readiness score now counts this skill as 100%.' : `You need ${result.passMark} to pass — revise and try again.`}
              </p>
            </div>
          </div>
          <ol className="grid gap-1.5 text-sm sm:grid-cols-5">
            {result.results.map((ok, i) => (
              <li key={i} className={`rounded-lg px-2 py-1 text-center font-semibold ${ok ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'}`}>
                Q{i + 1} {ok ? '✓' : '✗'}
              </li>
            ))}
          </ol>
          {result.passed ? (
            <BadgeCertificate payload={result.payload} token={result.token} />
          ) : (
            <button onClick={() => { setResult(null); setAnswers([]) }} className="btn-primary">
              <RotateCcw className="h-4 w-4" /> Try again
            </button>
          )}
        </div>
      )}
    </Modal>
  )
}
