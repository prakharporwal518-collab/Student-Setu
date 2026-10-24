import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Award, BookOpen, Briefcase, CalendarClock, CheckCircle2, Circle, ExternalLink, Hammer, Info, Loader2, Route, ShieldCheck, Sparkles, Star, Target, UserPlus, Users, Wand2 } from 'lucide-react'
import { Avatar, Badge, Modal, PageHeader, SectionHeader, Select } from '../components/ui'
import Ring from '../components/ui/Ring'
import { ListenButton, WhatsAppButton } from '../components/ui/Share'
import { BadgeCertificate, SkillTestModal } from '../components/skills/SkillTest'
import usePersistentState from '../hooks/usePersistentState'
import { useAuth, useToast } from '../context/AppContext'
import { bridgeCourses, buildPlan, computeGap, RATING, rolesForCourse, skills, tutors } from '../data/skillbridge'
import { collegeById } from '../data/colleges'
import { listings, sources } from '../data/careers'
import useMyBadges from '../hooks/useMyBadges'
import { generate } from '../services/copilot'

const DEFAULT = { courseId: 'btech', uni: 'rgpv', sem: 5, roleId: 'web-dev', ratings: {}, done: {}, minutes: 45, bookings: [] }

const sourceStyle = {
  verified: { bar: 'bg-emerald-500', label: 'Verified badge', tone: 'green' },
  self: { bar: 'bg-amber-400', label: 'Your practice', tone: 'amber' },
  syllabus: { bar: 'bg-brand-500', label: 'Syllabus (theory)', tone: 'brand' },
  missing: { bar: 'bg-rose-400', label: 'Gap', tone: 'red' },
}

function StepNav() {
  const steps = [
    ['profile', '1. Profile'],
    ['gap', '2. Gap map'],
    ['plan', '3. My plan'],
    ['verify', '4. Verify skills'],
    ['jobs', '5. Opportunities'],
  ]
  return (
    <nav className="sticky top-16 z-30 -mx-4 mb-6 border-b border-slate-200 bg-slate-50/90 px-4 py-2 backdrop-blur dark:border-white/10 dark:bg-ink-950/90 lg:top-[72px]" aria-label="Skill Bridge steps">
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {steps.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="chip-off shrink-0">
            {label}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default function SkillBridge() {
  const { user } = useAuth()
  const toast = useToast()
  const [st, setSt] = usePersistentState('ss-skillbridge', DEFAULT)
  const s = { ...DEFAULT, ...st }
  const set = (patch) => setSt((cur) => ({ ...DEFAULT, ...cur, ...patch }))
  const badges = useMyBadges()
  const badgeIds = badges.map((b) => b.payload.skill)
  const [testSkill, setTestSkill] = useState(null)
  const [coach, setCoach] = useState(null)
  const [coachBusy, setCoachBusy] = useState(false)
  const [booking, setBooking] = useState(null)

  const course = bridgeCourses.find((c) => c.id === s.courseId) ?? bridgeCourses[0]
  const roleOptions = rolesForCourse(course.id)
  const role = roleOptions.find((r) => r.id === s.roleId) ?? roleOptions[0]
  const uniId = course.universities.includes(s.uni) ? s.uni : course.universities[0]
  const uni = collegeById(uniId)
  const sem = Math.min(s.sem, course.years * 2)

  const gap = useMemo(() => computeGap({ courseId: course.id, sem, roleId: role.id, ratings: s.ratings, badges: badgeIds }), [course.id, sem, role.id, s.ratings, badgeIds.join()])
  const plan = useMemo(() => buildPlan(gap, s.minutes), [gap, s.minutes])
  const doneCount = plan.tasks.filter((t) => s.done[t.id]).length
  const year = Math.ceil(sem / 2)
  const gapSkills = gap.items.filter((i) => i.credit < 1).map((i) => i.id)
  const matched = listings
    .filter((l) => l.tags.some((t) => role.tags.includes(t)) || role.tags.some((t) => l.title.includes(t)))
    .sort((a, b) => Number(b.years.includes(year)) - Number(a.years.includes(year)))
  const myTutors = tutors.filter((t) => t.skills.some((sk) => gapSkills.includes(sk))).slice(0, 4)

  const setRating = (id, v) => set({ ratings: { ...s.ratings, [id]: v } })
  const toggleTask = (t) => {
    const done = { ...s.done, [t.id]: !s.done[t.id] }
    // Finishing a hands-on project counts as "Built something" for that skill.
    const ratings = t.kind === 'build' && done[t.id] ? { ...s.ratings, [t.skill]: Math.max(s.ratings[t.skill] ?? 0, 2) } : s.ratings
    set({ done, ratings })
  }

  const planText = `My Setu Skill Bridge plan to become a ${role.name} (${s.minutes} min/day, about ${plan.totalWeeks} weeks):\n` + plan.tasks.map((t) => `• Week ${t.week}${t.endWeek > t.week ? `–${t.endWeek}` : ''}: ${t.title}`).join('\n')

  const askCoach = async () => {
    setCoachBusy(true)
    try {
      const gaps = gap.items.filter((i) => i.credit < 1).sort((a, b) => b.w - a.w).slice(0, 5).map((i) => i.skill.name).join(', ')
      setCoach(await generate('coach', { course: course.name, university: uni?.short, semester: sem, role: role.name, readiness: gap.readiness, gaps, minutes: s.minutes }))
    } catch (e) {
      toast(e.message, 'warning')
    } finally {
      setCoachBusy(false)
    }
  }

  return (
    <>
      <PageHeader icon={Route} kicker="Setu Skill Bridge" title="From your syllabus to a real job" subtitle="See how much of your target job your university syllabus really covers, get a personal week-by-week plan for the gaps, and prove each skill with a verified badge." crumbs={[{ label: 'Skill Bridge' }]}>
        <div className="flex shrink-0 items-center gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
          <Ring value={gap.readiness} size={96} stroke={9} label="ready" />
          <div className="text-sm text-brand-100">
            <p className="font-semibold text-white">{role.name}</p>
            <p>{course.name} · {uni?.short} · Sem {sem}</p>
          </div>
        </div>
      </PageHeader>

      <div className="container-x py-6">
        <StepNav />

        {/* 1. Profile */}
        <section id="profile" className="scroll-mt-32">
          <SectionHeader icon={Target} title="Your profile" subtitle="Pick your course, university, semester and dream job." />
          <div className="card grid gap-4 p-5 sm:grid-cols-3">
            <div>
              <label className="label">Course</label>
              <Select value={course.id} onChange={(v) => set({ courseId: v, roleId: rolesForCourse(v)[0].id })} options={bridgeCourses.map((c) => ({ value: c.id, label: `${c.name} — ${c.branch}` }))} />
            </div>
            <div>
              <label className="label">University</label>
              <Select value={uniId} onChange={(v) => set({ uni: v })} options={course.universities.map((u) => ({ value: u, label: collegeById(u)?.short ?? u }))} />
            </div>
            <div>
              <label className="label">Current semester</label>
              <Select value={String(sem)} onChange={(v) => set({ sem: +v })} options={Array.from({ length: course.years * 2 }, (_, i) => ({ value: String(i + 1), label: `Semester ${i + 1}` }))} />
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {roleOptions.map((r) => (
              <button key={r.id} onClick={() => set({ roleId: r.id })} aria-pressed={r.id === role.id} className={`card flex items-start gap-3 p-4 text-left transition ${r.id === role.id ? 'ring-2 ring-saffron-500' : 'hover:-translate-y-0.5'}`}>
                <span className="text-2xl" aria-hidden>{r.emoji}</span>
                <span>
                  <span className="block font-bold text-slate-900 dark:text-white">{r.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{r.blurb}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 2. Gap map */}
        <section id="gap" className="mt-12 scroll-mt-32">
          <SectionHeader icon={Route} title="Curriculum-to-Career Gap Map" subtitle={`What ${role.name} jobs ask for, against what your ${uni?.short} ${course.name} syllabus teaches.`} />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">
            <div className="card flex flex-col items-center gap-5 p-6 text-center">
              <Ring value={gap.readiness} />
              <div className="grid w-full grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-slate-50 p-2 dark:bg-white/5"><p className="font-display text-xl font-extrabold">{gap.syllabusNow}%</p><p className="text-[11px] text-slate-500">Syllabus so far</p></div>
                <div className="rounded-xl bg-slate-50 p-2 dark:bg-white/5"><p className="font-display text-xl font-extrabold">{gap.syllabusFull}%</p><p className="text-[11px] text-slate-500">By graduation</p></div>
                <div className="rounded-xl bg-emerald-50 p-2 dark:bg-emerald-500/10"><p className="font-display text-xl font-extrabold text-emerald-700 dark:text-emerald-300">{gap.readiness}%</p><p className="text-[11px] text-slate-500">With your skills</p></div>
              </div>
              <p className="rounded-xl bg-saffron-50 p-3 text-sm text-saffron-900 dark:bg-saffron-500/10 dark:text-saffron-200">
                Even after graduation, your syllabus covers only <b>{gap.syllabusFull}%</b> of what {role.name} roles need. Skill Bridge helps you close the other <b>{100 - gap.syllabusFull}%</b>.
              </p>
              <div className="w-full space-y-1.5 text-left text-xs text-slate-500">
                {Object.entries(sourceStyle).map(([k, v]) => (
                  <p key={k} className="flex items-center gap-2"><span className={`h-2.5 w-6 rounded-full ${v.bar}`} /> {v.label}{k === 'syllabus' ? ' — 50%' : k === 'self' ? ' — up to 80%' : k === 'verified' ? ' — 100%' : ''}</p>
                ))}
              </div>
            </div>

            <div className="card divide-y divide-slate-100 p-2 dark:divide-white/10">
              {gap.items.map((i) => {
                const st2 = sourceStyle[i.source]
                return (
                  <div key={i.id} className="p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                        {i.skill.name}
                        <span className="text-xs text-saffron-500" title="Importance for this role">{'●'.repeat(i.w)}<span className="text-slate-300 dark:text-slate-600">{'●'.repeat(3 - i.w)}</span></span>
                        {i.verified && <Badge tone="green"><ShieldCheck className="h-3 w-3" /> Verified</Badge>}
                      </p>
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{Math.round(i.credit * 100)}%</span>
                    </div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                      <motion.div className={`h-full rounded-full ${st2.bar}`} initial={{ width: 0 }} animate={{ width: `${Math.max(i.credit * 100, i.source === 'missing' ? 4 : 0)}%` }} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      {i.subjects.length ? (
                        <span className="text-slate-500">📘 In syllabus: {i.subjects.map((x) => `${x.subject} (Sem ${x.sem})`).join(', ')}</span>
                      ) : i.laterSubjects.length ? (
                        <span className="text-slate-500">⏳ Comes later: {i.laterSubjects.map((x) => `${x.subject} (Sem ${x.sem})`).join(', ')}</span>
                      ) : (
                        <span className="font-medium text-rose-600 dark:text-rose-400">❌ Not in your syllabus</span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="mr-1 text-xs text-slate-400">My level:</span>
                      {RATING.map((r) => (
                        <button key={r.value} onClick={() => setRating(i.id, r.value)} aria-pressed={i.rating === r.value} className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${i.rating === r.value ? 'bg-brand-800 text-white dark:bg-brand-500' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300'}`}>
                          {r.label}
                        </button>
                      ))}
                      {i.skill.badge && !i.verified && (
                        <button onClick={() => setTestSkill(i.id)} className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300">
                          <Award className="h-3.5 w-3.5" /> Get verified
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 3. Plan */}
        <section id="plan" className="mt-12 scroll-mt-32">
          <SectionHeader
            icon={CalendarClock}
            title="Your personalised learning plan"
            subtitle="Built from your biggest gaps, sized to the time you have, using free resources."
            action={
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-slate-500">Daily time:</span>
                {[20, 45, 90, 120].map((m) => (
                  <button key={m} onClick={() => set({ minutes: m })} className={s.minutes === m ? 'chip-on' : 'chip-off'}>{m} min</button>
                ))}
              </div>
            }
          />
          {plan.tasks.length === 0 ? (
            <div className="card p-8 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" /><p className="mt-2 font-bold">You’re fully job-ready for {role.name}! Pick another role to keep growing.</p></div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px]">
              <div className="card p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    About <b>{plan.totalWeeks} weeks</b> at {s.minutes} min/day (6 days a week) · {doneCount}/{plan.tasks.length} tasks done
                  </p>
                  <div className="flex gap-2">
                    <ListenButton text={planText} />
                    <WhatsAppButton text={planText} label="Share" />
                  </div>
                </div>
                <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-emerald-500 transition-all" style={{ width: `${(doneCount / plan.tasks.length) * 100}%` }} />
                </div>
                <ol className="space-y-5">
                  {plan.weeks.map((w) => (
                    <li key={w.week}>
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-saffron-600">Week {w.week}</p>
                      <ul className="space-y-2">
                        {w.tasks.map((t) => {
                          const Icon = t.kind === 'learn' ? BookOpen : t.kind === 'build' ? Hammer : ShieldCheck
                          const done = Boolean(s.done[t.id])
                          return (
                            <li key={t.id} className={`flex items-start gap-3 rounded-xl border p-3 transition ${done ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-400/20 dark:bg-emerald-500/5' : 'border-slate-100 dark:border-white/10'}`}>
                              <button onClick={() => toggleTask(t)} aria-label={done ? 'Mark not done' : 'Mark done'} aria-pressed={done} className="mt-0.5">
                                {done ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-slate-300" />}
                              </button>
                              <div className="min-w-0 flex-1">
                                <p className={`flex items-center gap-1.5 text-sm font-semibold ${done ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-white'}`}>
                                  <Icon className="h-4 w-4 shrink-0 text-brand-700 dark:text-brand-300" /> {t.title}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {t.detail} · ~{t.hours} h{t.endWeek > t.week ? ` · weeks ${t.week}–${t.endWeek}` : ''}
                                </p>
                              </div>
                              {t.kind === 'learn' && t.url && (t.url.startsWith('/') ? <Link to={t.url} className="btn-outline shrink-0 px-3 py-1.5 text-xs">Open</Link> : <a href={t.url} target="_blank" rel="noreferrer" className="btn-outline shrink-0 px-3 py-1.5 text-xs">Open <ExternalLink className="h-3 w-3" /></a>)}
                              {t.kind === 'prove' && skills[t.skill].badge && !badgeIds.includes(t.skill) && <button onClick={() => setTestSkill(t.skill)} className="btn-accent shrink-0 px-3 py-1.5 text-xs">Take test</button>}
                            </li>
                          )
                        })}
                      </ul>
                    </li>
                  ))}
                </ol>
              </div>

              <aside className="card h-fit p-5 lg:sticky lg:top-36">
                <h3 className="flex items-center gap-2 font-bold"><Sparkles className="h-5 w-5 text-saffron-500" /> AI study coach</h3>
                <p className="mt-1 text-sm text-slate-500">Personal tips for your plan, powered by Gemini.</p>
                {!coach && (
                  <button onClick={askCoach} disabled={coachBusy} className="btn-primary mt-4 w-full">
                    {coachBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />} Get my coach tips
                  </button>
                )}
                {coach && (
                  <div className="mt-4 space-y-3 text-sm">
                    {!coach.ai && <p className="flex gap-1.5 rounded-lg bg-amber-50 p-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-200"><Info className="h-4 w-4 shrink-0" /> {coach.note}</p>}
                    <p className="text-slate-700 dark:text-slate-200">{coach.result.summary}</p>
                    <div><p className="mb-1 font-semibold">Next 3 weeks</p><ul className="list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">{coach.result.focus?.map((f) => <li key={f}>{f}</li>)}</ul></div>
                    <div><p className="mb-1 font-semibold">Tips</p><ul className="list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">{coach.result.tips?.map((f) => <li key={f}>{f}</li>)}</ul></div>
                    {coach.result.project && <p className="rounded-lg bg-brand-50 p-2 text-brand-900 dark:bg-white/5 dark:text-brand-100"><b>Project idea:</b> {coach.result.project}</p>}
                    <div className="flex gap-2">
                      <ListenButton text={`${coach.result.summary} ${coach.result.focus?.join('. ')}`} />
                      <button onClick={askCoach} disabled={coachBusy} className="btn-ghost py-2 text-xs">Regenerate</button>
                    </div>
                  </div>
                )}
              </aside>
            </div>
          )}
        </section>

        {/* 4. Verify */}
        <section id="verify" className="mt-12 scroll-mt-32">
          <SectionHeader icon={Award} title="Verified Skill Badges" subtitle="Prove a skill with a 5-question test checked on our server. Employers can verify every badge with one link." />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {gap.items.filter((i) => i.skill.badge).map((i) => (
              <div key={i.id} className="card flex items-center gap-3 p-4">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${i.verified ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 dark:bg-white/10'}`}><Award className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{i.skill.name}</p><p className="text-xs text-slate-500">{i.verified ? 'Verified ✓' : '5 questions · pass 4'}</p></div>
                {!i.verified && <button onClick={() => setTestSkill(i.id)} className="btn-outline px-3 py-1.5 text-xs">Start</button>}
              </div>
            ))}
          </div>
          {badges.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 font-bold">My badges ({badges.length})</h3>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">{badges.map((b) => <BadgeCertificate key={b.token} payload={b.payload} token={b.token} />)}</div>
            </div>
          )}
        </section>

        {/* 5. Opportunities */}
        <section id="jobs" className="mt-12 scroll-mt-32">
          <SectionHeader icon={Briefcase} title="Opportunities & peer tutors" subtitle="Internships that match your target role, and seniors who can teach your gap skills." />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="space-y-3">
              {matched.length === 0 && <p className="card p-5 text-sm text-slate-500">No matching listings right now. <Link to="/careers" className="link">Browse all internships & jobs</Link></p>}
              {matched.slice(0, 4).map((l) => (
                <div key={l.id} className="card flex items-center gap-3 p-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-900 font-display font-bold text-white">{l.company[0]}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{l.title}</p>
                    <p className="text-xs text-slate-500">{l.company} · {l.location} · {l.stipend}</p>
                    <p className="mt-1 text-xs"><Badge tone={gap.readiness >= 60 ? 'green' : 'amber'}>{gap.readiness >= 60 ? 'You’re a good match' : `Reach ${Math.min(100, gap.readiness + 20)}% to stand out`}</Badge> {l.years.includes(year) && <Badge tone="brand">Fits year {year}</Badge>}</p>
                  </div>
                  <a href={sources[l.source].url} target="_blank" rel="noreferrer" className="btn-accent px-3 py-1.5 text-xs">Apply</a>
                </div>
              ))}
              <Link to="/careers" className="link text-sm">See all internships & jobs →</Link>
            </div>
            <div className="card p-5">
              <h3 className="flex items-center gap-2 font-bold"><Users className="h-5 w-5 text-emerald-600" /> Learn from a senior</h3>
              <p className="mt-1 text-sm text-slate-500">Verified seniors teach your gap skills in Hindi or English and earn Setu Credits.</p>
              <ul className="mt-4 space-y-3">
                {myTutors.map((t) => {
                  const booked = s.bookings.some((b) => b.tutorId === t.id)
                  return (
                    <li key={t.id} className="flex items-center gap-3">
                      <Avatar name={t.name} size="h-10 w-10 text-sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{t.name} <span className="text-xs font-normal text-slate-400">· <Star className="inline h-3 w-3 fill-saffron-400 text-saffron-400" /> {t.rating}</span></p>
                        <p className="truncate text-xs text-slate-500">{t.college} · teaches {t.skills.filter((sk) => gapSkills.includes(sk)).map((sk) => skills[sk].name).join(', ')}</p>
                      </div>
                      <button disabled={booked} onClick={() => setBooking(t)} className={booked ? 'btn bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'btn-primary px-3 py-1.5 text-xs'}>{booked ? 'Booked' : <><UserPlus className="h-3.5 w-3.5" /> Book</>}</button>
                    </li>
                  )
                })}
                {myTutors.length === 0 && <li className="text-sm text-slate-500">No tutors for your gaps yet.</li>}
              </ul>
            </div>
          </div>
        </section>
      </div>

      <SkillTestModal skill={testSkill} open={Boolean(testSkill)} onClose={() => setTestSkill(null)} onPassed={() => toast('Verified badge earned! Your readiness score went up.')} />

      <Modal open={Boolean(booking)} onClose={() => setBooking(null)} title={booking ? `Book a session with ${booking.name}` : ''}>
        {booking && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const fd = new FormData(e.currentTarget)
              set({ bookings: [...s.bookings, { tutorId: booking.id, skill: fd.get('skill'), slot: fd.get('slot'), at: new Date().toISOString() }] })
              setBooking(null)
              toast(`Session requested! ${booking.name.split(' ')[0]} will confirm on WhatsApp.`)
            }}
            className="space-y-3"
          >
            <p className="text-sm text-slate-500">{booking.mode} · {booking.sessions} sessions taught</p>
            <div><label className="label">Skill</label><select name="skill" className="input select-arrow">{booking.skills.filter((sk) => gapSkills.includes(sk)).map((sk) => <option key={sk} value={sk}>{skills[sk].name}</option>)}</select></div>
            <div><label className="label">Preferred slot</label><select name="slot" className="input select-arrow"><option>Weekday evening (7–8 PM)</option><option>Saturday morning</option><option>Sunday afternoon</option></select></div>
            <p className="rounded-lg bg-brand-50 p-2 text-xs text-brand-900 dark:bg-white/5 dark:text-brand-100">30-minute session · free for you · the senior earns Setu Credits{user ? '' : ' · log in to get reminders'}.</p>
            <button className="btn-accent w-full">Request session</button>
          </form>
        )}
      </Modal>
    </>
  )
}

