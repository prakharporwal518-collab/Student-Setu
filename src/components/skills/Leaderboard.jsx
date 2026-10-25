import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Crown, Flag, Medal, Trophy } from 'lucide-react'
import { useAuth } from '../../context/AppContext'
import { useData } from '../../context/DataContext'
import useMyBadges from '../../hooks/useMyBadges'
import { leaderboardPeers } from '../../data/skills'
import { useStoredValue } from '../../hooks/usePersistentState'

/** Points + journey stage from what the student has actually done on Student Setu. */
export function useProgress() {
  const badges = useMyBadges()
  const { quizHistory, applied } = useData()
  const bridge = useStoredValue('ss-skillbridge', null)
  const tasksDone = bridge ? Object.values(bridge.done ?? {}).filter(Boolean).length : 0
  const lab = useStoredValue('ss-prompt-lab', null) ?? { best: 0 }
  const profile = useStoredValue('ss-job-profile', null)

  const points = badges.length * 100 + tasksDone * 20 + quizHistory.length * 30 + Math.round((lab.best ?? 0) / 2) + applied.length * 25
  const stages = [
    { label: 'Goal set', done: Boolean(bridge), next: 'Pick your dream job in Skill Bridge', to: '/skill-bridge' },
    { label: 'Learning', done: tasksDone > 0 || (lab.best ?? 0) > 0, next: 'Finish your first plan task or try the AI Prompt Lab', to: '/skill-bridge#plan' },
    { label: 'Verified', done: badges.length > 0, next: 'Earn your first Verified Skill Badge', to: '/skill-bridge#verify' },
    { label: 'Profile', done: Boolean(profile?.degree), next: 'Update your profile to unlock matched jobs', to: '/careers#matched' },
    { label: 'Applying', done: applied.length > 0, next: 'Apply to a job matched to your profile', to: '/careers#matched' },
  ]
  const nextStage = stages.find((s) => !s.done)
  return { points, stages, nextStage, badges: badges.length, tasksDone }
}

export default function Leaderboard() {
  const { user } = useAuth()
  const { points, stages, nextStage } = useProgress()
  const me = { name: user?.name ?? 'You', college: 'You', points, me: true }
  const rows = useMemo(() => [...leaderboardPeers, me].sort((a, b) => b.points - a.points), [points, me.name]) // eslint-disable-line react-hooks/exhaustive-deps
  const rank = rows.findIndex((r) => r.me) + 1
  const doneCount = stages.filter((s) => s.done).length

  return (
    <div className="card p-5 sm:p-6" id="leaderboard">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-bold"><Trophy className="h-5 w-5 text-saffron-500" /> My leaderboard</h3>
        <span className="rounded-full bg-saffron-50 px-3 py-1 text-xs font-bold text-saffron-700 dark:bg-saffron-500/15 dark:text-saffron-200">Rank #{rank} · {points} pts</span>
      </div>

      {/* Journey to job */}
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Your journey to a job · {doneCount}/{stages.length}</p>
      <div className="mt-2 grid grid-cols-5 gap-1.5">
        {stages.map((s) => (
          <div key={s.label} className="text-center">
            <div className={`h-2 rounded-full ${s.done ? 'bg-emerald-500' : s === nextStage ? 'bg-saffron-400' : 'bg-slate-200 dark:bg-white/10'}`} />
            <p className={`mt-1 text-[10px] font-semibold leading-tight ${s.done ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-400'}`}>{s.label}</p>
          </div>
        ))}
      </div>
      {nextStage ? (
        <Link to={nextStage.to} className="mt-3 flex items-center gap-2 rounded-xl bg-brand-50 p-3 text-sm font-semibold text-brand-900 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-100">
          <Flag className="h-4 w-4 shrink-0 text-saffron-500" /> Next step: {nextStage.next} <ArrowRight className="ml-auto h-4 w-4 shrink-0" />
        </Link>
      ) : (
        <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200">🎉 You’re job-ready — keep applying and earning badges!</p>
      )}

      {/* Table */}
      <ol className="mt-4 space-y-1.5">
        {rows.map((r, i) => (
          <li key={r.name + i} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${r.me ? 'bg-saffron-50 font-bold ring-1 ring-saffron-300 dark:bg-saffron-500/10' : ''}`}>
            <span className="grid w-6 place-items-center">{i === 0 ? <Crown className="h-4 w-4 text-amber-500" /> : i < 3 ? <Medal className="h-4 w-4 text-slate-400" /> : <span className="text-xs text-slate-400">{i + 1}</span>}</span>
            <span className="flex-1 truncate">{r.me ? `${r.name} (you)` : r.name}<span className="ml-1 text-xs font-normal text-slate-400">{r.me ? '' : `· ${r.college}`}</span></span>
            <span className="tabular-nums">{r.points}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[11px] text-slate-400">Points: verified badge 100 · plan task 20 · quiz 30 · application 25 · Prompt Lab up to 50. Classmates shown are sample profiles.</p>
    </div>
  )
}
