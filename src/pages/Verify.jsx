import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BadgeCheck, Loader2, ShieldAlert, ShieldX } from 'lucide-react'
import { BadgeCertificate } from '../components/skills/SkillTest'
import { verifyToken } from '../services/badges'

/** Public page employers open to check a Setu Skill Badge. */
export default function Verify() {
  const { token } = useParams()
  const [state, setState] = useState({ loading: true })

  useEffect(() => {
    verifyToken(token).then(
      (r) => setState({ loading: false, ...r }),
      (e) => setState({ loading: false, error: e.message }),
    )
  }, [token])

  return (
    <div className="container-x max-w-2xl py-12">
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-extrabold"><BadgeCheck className="h-7 w-7 text-emerald-500" /> Badge verification</h1>
      {state.loading && <p className="flex items-center gap-2 text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Checking the signature…</p>}
      {state.error && <p className="card flex items-start gap-2 p-5 text-amber-700"><ShieldAlert className="h-5 w-5 shrink-0" /> {state.error}</p>}
      {!state.loading && !state.error && state.valid && (
        <div className="space-y-4">
          <p className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200">
            ✅ Genuine. This badge was issued by Student Setu after a server-graded test and has not been altered.
          </p>
          <BadgeCertificate payload={state.payload} compact />
          {state.payload.demo && <p className="text-xs text-amber-600">Signed with the demo key — the site owner should set BADGE_SECRET for tamper-proof badges.</p>}
        </div>
      )}
      {!state.loading && !state.error && !state.valid && (
        <p className="card flex items-start gap-2 p-5 text-rose-700 dark:text-rose-300"><ShieldX className="h-5 w-5 shrink-0" /> This badge link is not valid. It may have been edited or copied incorrectly.</p>
      )}
      <Link to="/skill-bridge" className="link mt-8 inline-block text-sm">Earn your own verified badges on Setu Skill Bridge →</Link>
    </div>
  )
}
