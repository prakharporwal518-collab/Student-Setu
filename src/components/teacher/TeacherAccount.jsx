import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BadgeCheck, BarChart3, ClipboardList, Clock, Copy, FileText, Laptop, Loader2, Lock, LogIn, NotebookPen, ShieldAlert, ShieldCheck, Sparkles, UserPlus, Users, XCircle } from 'lucide-react'
import { Avatar, Badge } from '../ui'
import { teacherStatus, useAuth, useToast } from '../../context/AppContext'
import { getResults, transferLink } from '../../services/classroom'

/* ---------------------------------------------------- guest AI quota */
const QUOTA_KEY = 'ss-guest-ai'
export const GUEST_LIMIT = 3

/** Guests get a few free AI generations so judges and new teachers can try Copilot instantly. */
export function useGuestQuota(isGuest) {
  const [used, setUsed] = useState(() => {
    try {
      return +localStorage.getItem(QUOTA_KEY) || 0
    } catch {
      return 0
    }
  })
  const take = () => {
    if (!isGuest) return true
    if (used >= GUEST_LIMIT) return false
    const next = used + 1
    setUsed(next)
    try {
      localStorage.setItem(QUOTA_KEY, String(next))
    } catch {
      /* ignore */
    }
    return true
  }
  return { left: Math.max(0, GUEST_LIMIT - used), take }
}

/* ------------------------------------------------------- guest gate */
export function TeacherGate({ quotaLeft }) {
  const { user, login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const demo = () => {
    login('teacher@demo.in', 'demo123')
    toast('Logged in as demo teacher (Prof. Meena Joshi)')
    navigate('/teacher?tab=dashboard', { replace: true })
  }
  return (
    <div className="no-print mb-6 grid gap-4 rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 to-saffron-50 p-5 dark:border-white/10 dark:from-white/5 dark:to-saffron-500/5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
      <div>
        <p className="flex items-center gap-2 font-display text-lg font-extrabold text-slate-900 dark:text-white"><Lock className="h-5 w-5 text-brand-700 dark:text-brand-300" /> Teacher login required for classes</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {user ? `You’re signed in as a ${user.role}. ` : ''}Verified teachers can run classes, see student results and the weak-topic heatmap on any device. As a guest you can try the lesson planner and question paper ({quotaLeft} of {GUEST_LIMIT} free AI tries left).
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={demo} className="btn-accent"><Sparkles className="h-4 w-4" /> Try as demo teacher</button>
        <Link to="/login?role=teacher&next=/teacher%3Ftab%3Ddashboard" className="btn-primary"><LogIn className="h-4 w-4" /> Teacher login</Link>
        <Link to="/signup?role=teacher" className="btn-outline"><UserPlus className="h-4 w-4" /> Sign up as teacher</Link>
      </div>
    </div>
  )
}

export function LockedCard({ title }) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-white/5 dark:text-brand-200"><Lock className="h-7 w-7" /></span>
      <h3 className="text-lg font-bold">{title} is for verified teachers</h3>
      <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">Log in with a teacher account to build quizzes, run classes with a join code and see your class heatmap. Use “Try as demo teacher” above to explore it right now.</p>
    </div>
  )
}

/* --------------------------------------------- verification status */
const statusUi = {
  verified: { tone: 'green', icon: BadgeCheck, label: 'Verified teacher' },
  pending: { tone: 'amber', icon: Clock, label: 'Verification pending' },
  rejected: { tone: 'red', icon: XCircle, label: 'Verification not approved' },
  incomplete: { tone: 'gray', icon: ShieldAlert, label: 'Profile incomplete' },
}
export function StatusBadge({ status }) {
  const s = statusUi[status] ?? statusUi.incomplete
  return <Badge tone={s.tone}><s.icon className="h-3.5 w-3.5" /> {s.label}</Badge>
}

/** Shown in place of class features until an admin verifies the teacher. */
export function VerificationNotice() {
  const { user } = useAuth()
  const status = teacherStatus(user)
  if (status === 'verified') return null
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-12 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/15"><ShieldCheck className="h-7 w-7" /></span>
      <h3 className="text-lg font-bold">{status === 'pending' ? 'Your teacher profile is being verified' : 'Complete your teacher profile'}</h3>
      <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
        {status === 'pending'
          ? 'Our team checks your college and employee ID — usually within 24 hours. Meanwhile you can use the lesson planner, question papers and quiz builder. Classes unlock after verification.'
          : 'Add your college and employee ID on the Dashboard tab so we can verify you and unlock classes.'}
      </p>
    </div>
  )
}

export function CompleteProfile() {
  const { user, updateUser } = useAuth()
  const toast = useToast()
  const p = user.teacherProfile ?? {}
  const [f, setF] = useState({ college: p.college ?? '', employeeId: p.employeeId ?? '', subjects: p.subjects ?? '' })
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        updateUser(user.id, { teacherProfile: { ...p, ...f, status: 'pending', submittedAt: new Date().toISOString(), reviewNote: undefined } })
        toast('Submitted for verification')
      }}
      className="card space-y-3 p-5"
    >
      <h3 className="font-bold">{p.status === 'rejected' ? 'Update and resubmit your details' : 'Verify your teacher account'}</h3>
      {p.status === 'rejected' && p.reviewNote && <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">Reviewer note: {p.reviewNote}</p>}
      <div><label className="label" htmlFor="cp-college">College / institute</label><input id="cp-college" required className="input" value={f.college} onChange={(e) => setF({ ...f, college: e.target.value })} /></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className="label" htmlFor="cp-emp">Employee / faculty ID</label><input id="cp-emp" required className="input" value={f.employeeId} onChange={(e) => setF({ ...f, employeeId: e.target.value })} /></div>
        <div><label className="label" htmlFor="cp-sub">Subjects you teach</label><input id="cp-sub" required className="input" value={f.subjects} onChange={(e) => setF({ ...f, subjects: e.target.value })} /></div>
      </div>
      <button className="btn-primary">Submit for verification</button>
    </form>
  )
}

/* ------------------------------------------------------- dashboard */
export function TeacherDashboard({ classes, onOpenClass, setTab }) {
  const { user } = useAuth()
  const toast = useToast()
  const status = teacherStatus(user)
  const p = user.teacherProfile ?? {}
  const [rows, setRows] = useState(null)

  useEffect(() => {
    if (status !== 'verified') return
    let alive = true
    Promise.allSettled(classes.map((c) => getResults(c.code))).then((res) => {
      if (!alive) return
      setRows(
        classes.map((c, i) => {
          const r = res[i].status === 'fulfilled' ? res[i].value : null
          const quizzes = r?.insights.perQuiz.filter((q) => q.avg !== null) ?? []
          return {
            ...c,
            ok: Boolean(r),
            submissions: r?.insights.students.length ?? 0,
            avg: quizzes.length ? Math.round(quizzes.reduce((a, q) => a + q.avg, 0) / quizzes.length) : null,
            weakest: r?.insights.weakest,
            topics: r?.insights.topics ?? [],
          }
        }),
      )
    })
    return () => {
      alive = false
    }
  }, [classes, status])

  const totalSubs = rows?.reduce((a, r) => a + r.submissions, 0) ?? 0
  const withAvg = rows?.filter((r) => r.avg !== null) ?? []
  const avg = withAvg.length ? Math.round(withAvg.reduce((a, r) => a + r.avg, 0) / withAvg.length) : null
  const allTopics = rows?.flatMap((r) => r.topics.filter((t) => t.pct !== null).map((t) => ({ ...t, subject: r.subject }))) ?? []
  const weakest = allTopics.sort((a, b) => a.pct - b.pct)[0]
  const link = transferLink(user.id)

  return (
    <div className="space-y-5">
      <div className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <Avatar name={user.name} size="h-16 w-16 text-xl" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-bold">{user.name}</h2>{status && <StatusBadge status={status} />}</div>
          <p className="text-sm text-slate-500">{p.college || 'College not added'}{p.employeeId ? ` · ID ${p.employeeId}` : ''}</p>
          {p.subjects && <p className="text-sm text-slate-500">Teaches: {p.subjects}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setTab('lesson')} className="btn-outline py-2"><NotebookPen className="h-4 w-4" /> Lesson plan</button>
          <button onClick={() => setTab('quiz')} className="btn-outline py-2"><ClipboardList className="h-4 w-4" /> Build quiz</button>
          <button onClick={() => setTab('paper')} className="btn-outline py-2"><FileText className="h-4 w-4" /> Question paper</button>
        </div>
      </div>

      {(status === 'incomplete' || status === 'rejected') && <CompleteProfile />}
      {status === 'pending' && <VerificationNotice />}

      {status === 'verified' && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="card p-4"><p className="text-xs text-slate-500">Classes</p><p className="font-display text-2xl font-extrabold">{classes.length}</p></div>
            <div className="card p-4"><p className="text-xs text-slate-500">Student submissions</p><p className="font-display text-2xl font-extrabold">{rows ? totalSubs : '…'}</p></div>
            <div className="card p-4"><p className="text-xs text-slate-500">Average score</p><p className="font-display text-2xl font-extrabold">{avg === null ? '—' : `${avg}%`}</p></div>
            <div className="card p-4"><p className="text-xs text-slate-500">Weakest topic overall</p><p className="truncate font-display text-lg font-extrabold text-rose-600">{weakest ? `${weakest.topic} · ${weakest.pct}%` : '—'}</p></div>
          </div>

          <div className="card overflow-x-auto">
            <div className="flex items-center justify-between gap-2 p-4">
              <h3 className="flex items-center gap-2 font-bold"><Users className="h-5 w-5 text-brand-700" /> My classes</h3>
              <button onClick={() => setTab('classes')} className="btn-primary py-2 text-xs">Create or try demo class</button>
            </div>
            {classes.length === 0 ? (
              <p className="px-4 pb-5 text-sm text-slate-500">No classes yet. Create one, or try the demo class with 26 students.</p>
            ) : !rows ? (
              <p className="flex items-center gap-2 px-4 pb-5 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading results…</p>
            ) : (
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="border-y border-slate-100 text-xs uppercase text-slate-400 dark:border-white/10"><tr><th className="p-3">Class</th><th className="p-3">Code</th><th className="p-3">Submissions</th><th className="p-3">Avg</th><th className="p-3">Needs re-teaching</th><th className="p-3" /></tr></thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.code} className="border-b border-slate-50 last:border-0 dark:border-white/5">
                      <td className="p-3 font-semibold">{r.subject}{r.demo && <span className="ml-1 text-xs font-normal text-slate-400">(demo)</span>}</td>
                      <td className="p-3 font-mono text-xs">{r.code}</td>
                      <td className="p-3">{r.ok ? r.submissions : <span className="text-xs text-rose-500">unavailable</span>}</td>
                      <td className="p-3">{r.avg === null ? '—' : <Badge tone={r.avg >= 60 ? 'green' : 'red'}>{r.avg}%</Badge>}</td>
                      <td className="p-3 text-rose-600">{r.weakest ? `${r.weakest.topic} (${r.weakest.pct}%)` : <span className="text-slate-400">—</span>}</td>
                      <td className="p-3 text-right"><button onClick={() => onOpenClass(r.code)} className="link text-xs"><BarChart3 className="mr-1 inline h-3.5 w-3.5" />Insights</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
            <Laptop className="h-8 w-8 shrink-0 text-brand-700" />
            <div className="flex-1">
              <p className="font-bold">Open your classes on another device</p>
              <p className="text-sm text-slate-500">Log in on your phone or college computer, then open this private link. Anyone with it can manage your classes — keep it to yourself.</p>
            </div>
            <button
              disabled={!link}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(link)
                  toast('Private link copied')
                } catch {
                  toast(link, 'info')
                }
              }}
              className="btn-outline py-2"
            >
              <Copy className="h-4 w-4" /> {link ? 'Copy private link' : 'No online classes yet'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
