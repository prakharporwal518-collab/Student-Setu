import { useState } from 'react'
import { Check, FlaskConical, Lightbulb, X } from 'lucide-react'
import usePersistentState from '../../hooks/usePersistentState'

// Hands-on AI training: students practise writing good prompts and get instant feedback.
// Scoring is rule-based and runs in the browser, so it works offline and costs nothing.
const checks = [
  { id: 'role', label: 'Gives the AI a role', tip: 'Start with “Act as a…” or “You are a…”.', test: (p) => /\b(act as|you are|as an?|imagine you are)\b/i.test(p) },
  { id: 'task', label: 'Clear task with an action verb', tip: 'Use verbs like explain, write, list, compare, summarise.', test: (p) => /\b(explain|write|list|create|compare|summari[sz]e|make|plan|suggest|generate|draft|teach)\b/i.test(p) },
  { id: 'context', label: 'Adds context about you', tip: 'Say who it is for: “for a 2nd-year B.Tech student”, “for a Class 10 student”.', test: (p) => /\b(for (a|an|my|me)|i am|i'm|student|beginner|class \d+|year)\b/i.test(p) },
  { id: 'format', label: 'Asks for a format', tip: 'Ask for bullet points, a table, steps, or a word limit.', test: (p) => /\b(bullet|table|steps?|points?|words?|lines?|example|format|in hindi|in english)\b/i.test(p) },
  { id: 'length', label: 'Detailed enough (15+ words)', tip: 'Short prompts get generic answers. Add details.', test: (p) => p.trim().split(/\s+/).filter(Boolean).length >= 15 },
]

const samples = ['Explain SQL joins', 'Act as a friendly DBMS teacher. Explain SQL joins to a 2nd-year B.Tech student in 5 bullet points with one real-life example from a college canteen.']

export default function PromptLab() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState(null)
  const [lab, setLab] = usePersistentState('ss-prompt-lab', { best: 0, tries: 0 })

  const grade = (e) => {
    e?.preventDefault()
    const res = checks.map((c) => ({ ...c, ok: c.test(prompt) }))
    const score = Math.round((res.filter((r) => r.ok).length / checks.length) * 100)
    setResult({ res, score })
    setLab((l) => ({ best: Math.max(l.best ?? 0, score), tries: (l.tries ?? 0) + 1 }))
  }

  return (
    <div className="card p-5 sm:p-6" id="prompt-lab">
      <h3 className="flex items-center gap-2 text-lg font-bold"><FlaskConical className="h-5 w-5 text-fuchsia-600" /> AI Prompt Lab <span className="rounded-full bg-fuchsia-50 px-2 py-0.5 text-xs font-semibold text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-200">hands-on</span></h3>
      <p className="mt-1 text-sm text-slate-500">Practise the #1 AI skill employers want: writing good prompts. Type a prompt and get instant feedback.</p>
      <form onSubmit={grade} className="mt-4 space-y-3">
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} className="input" placeholder="e.g. Act as a DBMS teacher. Explain SQL joins to a 2nd-year student in 5 bullet points…" aria-label="Your prompt" />
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn-primary py-2" disabled={!prompt.trim()}>Check my prompt</button>
          {samples.map((s, i) => <button key={i} type="button" onClick={() => { setPrompt(s); setResult(null) }} className="chip-off text-xs">{i === 0 ? 'Try a weak prompt' : 'Try a strong prompt'}</button>)}
          {lab.tries > 0 && <span className="ml-auto text-xs text-slate-400">Best score {lab.best}/100</span>}
        </div>
      </form>
      {result && (
        <div className="mt-4 rounded-xl border border-slate-100 p-4 dark:border-white/10">
          <div className="flex items-center gap-3">
            <span className={`grid h-14 w-14 place-items-center rounded-2xl font-display text-xl font-extrabold text-white ${result.score >= 80 ? 'bg-emerald-500' : result.score >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}>{result.score}</span>
            <p className="text-sm font-semibold">{result.score >= 80 ? 'Excellent prompt! The AI knows exactly what you need.' : result.score >= 40 ? 'Good start — add the missing parts below.' : 'Too vague. Fix the items below for a much better answer.'}</p>
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">
            {result.res.map((r) => (
              <li key={r.id} className="flex items-start gap-2">
                {r.ok ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> : <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />}
                <span><b>{r.label}</b>{!r.ok && <span className="text-slate-500"> — <Lightbulb className="inline h-3.5 w-3.5 text-amber-500" /> {r.tip}</span>}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
