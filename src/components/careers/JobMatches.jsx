import { useMemo, useState } from 'react'
import { BadgeCheck, Building, Check, ExternalLink, MapPin, Sparkles, UserCog, Wallet } from 'lucide-react'
import { Badge, Select } from '../ui'
import { useData } from '../../context/DataContext'
import { useAuth, useToast } from '../../context/AppContext'
import usePersistentState from '../../hooks/usePersistentState'
import useMyBadges from '../../hooks/useMyBadges'
import { degreeOptions, listings, matchListing, sources } from '../../data/careers'

const allSkills = [...new Set(listings.flatMap((l) => l.tags))].sort()
// Verified badge skills map onto listing tags.
const badgeToTag = { html_css: 'React', js: 'React', react: 'React', python: 'Python', sql: 'SQL', dsa: 'DSA', excel: 'Excel', communication: 'Communication', accounting: 'Tally', gst: 'GST' }

/** "Update your profile" → personalised job & internship matches for graduates. */
export default function JobMatches() {
  const toast = useToast()
  const { user } = useAuth()
  const { applied, toggleApplied } = useData()
  const badgeTags = useMyBadges().map((b) => badgeToTag[b.payload.skill]).filter(Boolean)
  const [profile, setProfile] = usePersistentState('ss-job-profile', null)
  const [draft, setDraft] = useState(() => profile ?? { degree: user?.stage === 'graduate' ? 'btech-cse' : '', status: 'graduated', skills: [] })
  const toggle = (t) => setDraft((d) => ({ ...d, skills: d.skills.includes(t) ? d.skills.filter((x) => x !== t) : [...d.skills, t] }))

  const matches = useMemo(() => {
    if (!profile?.degree) return []
    const p = { ...profile, skills: [...new Set([...profile.skills, ...badgeTags])] }
    return listings
      .map((l) => ({ l, ...matchListing(l, p) }))
      .filter((m) => m.score >= 40 && (profile.status === 'graduated' ? true : m.l.kind === 'internship' || m.l.years.includes(4)))
      .sort((a, b) => b.score - a.score)
  }, [profile, badgeTags.join()]) // eslint-disable-line react-hooks/exhaustive-deps

  const save = (e) => {
    e.preventDefault()
    if (!draft.degree) return toast('Pick your degree first', 'warning')
    setProfile(draft)
    toast('Profile updated — here are jobs matched to you')
  }

  return (
    <section id="matched" className="mb-12 scroll-mt-28">
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form onSubmit={save} className="card h-fit p-5">
          <h3 className="flex items-center gap-2 text-lg font-bold"><UserCog className="h-5 w-5 text-brand-700" /> Update your profile</h3>
          <p className="mt-1 text-sm text-slate-500">Finished (or finishing) your degree? Tell us about it — we filter out the noise and show only jobs for your field.</p>
          <label className="label mt-4" htmlFor="jm-degree">Degree</label>
          <Select id="jm-degree" value={draft.degree} onChange={(v) => setDraft({ ...draft, degree: v })} options={[{ value: '', label: 'Select your degree' }, ...degreeOptions.map((d) => ({ value: d.id, label: d.label }))]} />
          <label className="label mt-3">Status</label>
          <div className="grid grid-cols-2 gap-2">
            {[['final', 'Final year'], ['graduated', 'Graduated']].map(([v, l]) => (
              <button key={v} type="button" onClick={() => setDraft({ ...draft, status: v })} className={draft.status === v ? 'chip-on justify-center' : 'chip-off justify-center'}>{l}</button>
            ))}
          </div>
          <label className="label mt-3">Your skills</label>
          <div className="flex flex-wrap gap-1.5">
            {allSkills.map((t) => {
              const on = draft.skills.includes(t)
              return <button key={t} type="button" onClick={() => toggle(t)} aria-pressed={on} className={`rounded-full border px-2.5 py-1 text-xs font-medium ${on ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200' : 'border-slate-200 text-slate-500 dark:border-white/10'}`}>{on && <Check className="mr-0.5 inline h-3 w-3" />}{t}</button>
            })}
          </div>
          {badgeTags.length > 0 && <p className="mt-2 flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-300"><BadgeCheck className="h-3.5 w-3.5" /> Your verified badges are added automatically.</p>}
          <button className="btn-primary mt-4 w-full">Update profile & match jobs</button>
        </form>

        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold"><Sparkles className="h-5 w-5 text-saffron-500" /> Jobs matched to your profile</h3>
          {!profile?.degree ? (
            <div className="card mt-3 p-8 text-center text-sm text-slate-500">Update your profile on the left to see personalised jobs and internships.</div>
          ) : matches.length === 0 ? (
            <div className="card mt-3 p-8 text-center text-sm text-slate-500">No strong matches yet — add more skills or earn verified badges in Skill Bridge.</div>
          ) : (
            <div className="mt-3 space-y-3">
              <p className="text-sm text-slate-500">{matches.length} of {listings.length} listings fit your field — the rest are filtered out.</p>
              {matches.map(({ l, score, hits, degreeFit }) => {
                const src = sources[l.source]
                const done = applied.includes(l.id)
                return (
                  <article key={l.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-emerald-50 font-display text-lg font-extrabold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">{score}%</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2"><h4 className="font-bold">{l.title}</h4><Badge tone={l.kind === 'job' ? 'purple' : 'brand'} className="capitalize">{l.kind}</Badge></div>
                      <p className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-slate-500"><span className="flex items-center gap-1"><Building className="h-3.5 w-3.5" />{l.company}</span><span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{l.location}</span><span className="flex items-center gap-1"><Wallet className="h-3.5 w-3.5" />{l.stipend}</span></p>
                      <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">{degreeFit ? '✓ Your degree fits' : ''}{hits.length ? `${degreeFit ? ' · ' : ''}✓ Skills: ${hits.join(', ')}` : ''}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button onClick={() => { toggleApplied(l.id); if (!done) toast('Marked as applied — tracked on your leaderboard') }} className={done ? 'btn-ghost py-2 text-emerald-700' : 'btn-outline py-2'}>{done ? '✓ Applied' : 'Mark applied'}</button>
                      <a href={src.url} target="_blank" rel="noreferrer" className="btn-accent py-2">Apply <ExternalLink className="h-3.5 w-3.5" /></a>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
