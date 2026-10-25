import { useState } from 'react'
import { CalendarDays, Check, ExternalLink, IndianRupee, Lightbulb, MapPin, MessageSquarePlus, Presentation, Rocket, Star, Trophy, UserPlus, Users } from 'lucide-react'
import { Avatar, Badge, Modal, PageHeader, SectionHeader } from '../components/ui'
import { useData } from '../context/DataContext'
import { useAuth, useToast } from '../context/AppContext'
import { timeAgo } from '../data/common'
import { challenges, fundingSchemes, mentors, pastIdeas, pitchTips, sidfEvents, sidfPillars } from '../data/sidf'

const pillarIcons = { Rocket, Users, Trophy, Lightbulb }

/** Instant, rule-based feedback on an idea — a placeholder for mentor review. */
function ideaFeedback(idea) {
  const checks = [
    { ok: idea.problem.length >= 60, good: 'Problem is described in detail.', bad: 'Describe the problem in more detail — who faces it and how often?' },
    { ok: /\d/.test(idea.problem + idea.users), good: 'You used numbers to show scale.', bad: 'Add numbers (e.g. "2 lakh students in Bhopal") to show the size of the problem.' },
    { ok: idea.solution.length >= 60, good: 'Solution is clearly explained.', bad: 'Explain how your solution works in 2–3 sentences.' },
    { ok: idea.users.length >= 10, good: 'Target users are defined.', bad: 'Name your target users specifically.' },
    { ok: idea.stage !== 'Just an idea', good: 'You have started building — great!', bad: 'Build a simple prototype or mockup next; judges love demos.' },
  ]
  return { score: Math.round((checks.filter((c) => c.ok).length / checks.length) * 100), checks }
}

export default function Sidf() {
  const { user } = useAuth()
  const toast = useToast()
  const { teamPosts, addTeamPost, addIdea, ideas, requestMentor, mentorRequests, eventRegs, toggleEvent } = useData()
  const [mentor, setMentor] = useState(null)
  const [postOpen, setPostOpen] = useState(false)
  const [idea, setIdea] = useState({ title: '', problem: '', solution: '', users: '', stage: 'Just an idea', theme: 'Education' })
  const [result, setResult] = useState(null)
  const myRequests = mentorRequests.filter((r) => r.studentId === (user?.id ?? 'guest'))

  return (
    <>
      <PageHeader icon={Lightbulb} kicker="SIDF · Student Innovation & Development Forum" title="Incubation for every college" subtitle="Bringing mentorship, workshops and hackathon preparation to government and local colleges that don’t have incubation centres." crumbs={[{ label: 'SIDF' }]}>
        <a href="#idea" className="btn-accent shrink-0"><Rocket className="h-4 w-4" /> Submit your idea</a>
      </PageHeader>
      <div className="container-x py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sidfPillars.map((p) => {
            const Icon = pillarIcons[p.icon]
            return (
              <div key={p.title} className="card p-5">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/15"><Icon className="h-5 w-5" /></span>
                <h3 className="mt-3 font-bold">{p.title}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{p.text}</p>
              </div>
            )
          })}
        </div>

        <section className="mt-14 scroll-mt-24" id="events">
          <SectionHeader icon={CalendarDays} title="Upcoming events & workshops" subtitle="Conducted in government and local colleges — free for students" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sidfEvents.map((e) => {
              const d = new Date(e.date)
              const reg = eventRegs.includes(e.id)
              return (
                <div key={e.id} className="card card-hover flex gap-4 p-5">
                  <div className="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-800 text-white">
                    <span className="text-xs uppercase">{d.toLocaleDateString('en-IN', { month: 'short' })}</span>
                    <span className="font-display text-2xl font-extrabold leading-none">{d.getDate()}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold leading-snug">{e.title}</h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" /> {e.college}</p>
                    <div className="mt-2 flex flex-wrap gap-1"><Badge tone={e.mode === 'Online' ? 'green' : 'brand'}>{e.mode}</Badge>{e.tags.map((t) => <Badge key={t} tone="gray">{t}</Badge>)}</div>
                    <button onClick={() => { toggleEvent(e.id); toast(reg ? 'Registration cancelled' : `Registered for ${e.title}!`, reg ? 'info' : 'success') }} className={`mt-3 py-1.5 text-xs ${reg ? 'btn bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'btn-primary'}`}>{reg ? <><Check className="h-3.5 w-3.5" /> Registered</> : `Register · ${e.seats} seats`}</button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="mt-14 scroll-mt-24" id="mentors">
          <SectionHeader icon={Users} title="Mentors" subtitle="Founders, engineers, researchers and designers who volunteer their time" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mentors.map((m) => {
              const requested = myRequests.some((r) => r.mentorId === m.id)
              return (
                <div key={m.id} className="card card-hover flex flex-col p-5">
                  <div className="flex items-center gap-3">
                    <Avatar name={m.name} size="h-14 w-14 text-lg" />
                    <div className="min-w-0"><p className="font-bold">{m.name}</p><p className="text-sm text-slate-500">{m.role}</p><p className="text-xs text-slate-400">{m.org} · {m.city}</p></div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">{m.expertise.map((x) => <Badge key={x} tone="amber">{x}</Badge>)}</div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="flex items-center gap-1 text-sm"><Star className="h-4 w-4 fill-saffron-400 text-saffron-400" /> {m.rating} <span className="text-xs text-slate-400">· {m.sessions} sessions</span></span>
                    <button disabled={!m.available || requested} onClick={() => setMentor(m)} className="btn-primary py-2 text-xs">{requested ? 'Requested' : m.available ? 'Request guidance' : 'Fully booked'}</button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="mt-14">
          <SectionHeader icon={Trophy} title="Hackathon & innovation prep hub" subtitle="Get ready for national-level challenges" />
          <div className="grid gap-4 lg:grid-cols-3">
            {challenges.map((c) => (
              <a key={c.name} href={c.url} target="_blank" rel="noreferrer" className="card card-hover group p-5">
                <div className="flex items-center justify-between"><h3 className="font-bold group-hover:text-brand-700 dark:group-hover:text-brand-300">{c.name}</h3><ExternalLink className="h-4 w-4 text-slate-400" /></div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{c.text}</p>
              </a>
            ))}
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="card p-5 sm:p-6">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold"><Presentation className="h-5 w-5 text-saffron-500" /> Pitch-deck tips</h3>
              <ol className="space-y-2.5">{pitchTips.map((t, i) => <li key={t} className="flex gap-3 text-sm"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-saffron-100 text-xs font-bold text-saffron-700 dark:bg-saffron-500/20 dark:text-saffron-300">{i + 1}</span>{t}</li>)}</ol>
            </div>
            <div className="card p-5 sm:p-6">
              <h3 className="mb-1 flex items-center gap-2 text-lg font-bold"><Lightbulb className="h-5 w-5 text-amber-500" /> Ideas that impress judges</h3>
              <p className="mb-3 text-xs text-slate-400">Illustrative examples of strong hackathon ideas</p>
              <ul className="space-y-3">{pastIdeas.map((p) => <li key={p.title} className="rounded-xl bg-slate-50 p-3 dark:bg-white/5"><div className="flex items-start justify-between gap-2"><p className="text-sm font-semibold">{p.title}</p><Badge tone="purple">{p.theme}</Badge></div><p className="mt-1 text-xs text-slate-500">Why it works: {p.why}</p></li>)}</ul>
            </div>
          </div>
        </section>

        <section className="mt-14" id="funding">
          <SectionHeader icon={IndianRupee} title="Government startup funding & grants" subtitle="Official schemes your idea can apply to — seed grants, incubation, prototype funds and loans" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fundingSchemes.map((f) => (
              <a key={f.name} href={f.url} target="_blank" rel="noreferrer" className="card card-hover group flex flex-col p-4">
                <span className="flex items-start justify-between gap-2"><span className="font-bold group-hover:text-brand-700 dark:group-hover:text-brand-300">{f.name}</span><ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" /></span>
                <span className="mt-0.5 text-xs text-slate-400">{f.by}</span>
                <span className="mt-2 text-sm text-slate-600 dark:text-slate-300">{f.for}</span>
                <span className="mt-3"><Badge tone="green">{f.tag}</Badge></span>
              </a>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">Eligibility and amounts change — always read the latest guidelines on the official portal.</p>
        </section>

        <section className="mt-14">
          <SectionHeader icon={UserPlus} title="Team formation board" subtitle="Find teammates for hackathons and projects" action={<button onClick={() => setPostOpen(true)} className="btn-accent"><MessageSquarePlus className="h-4 w-4" /> Post a requirement</button>} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teamPosts.map((p) => (
              <div key={p.id} className="card p-5">
                <div className="flex items-center gap-2 text-xs text-slate-500"><Avatar name={p.by} size="h-7 w-7 text-[10px]" /> {p.by} · {p.college} · {timeAgo(p.createdAt)}</div>
                <h3 className="mt-2 font-bold">{p.title}</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">{p.skills.map((s) => <Badge key={s} tone="brand">{s}</Badge>)}</div>
                <div className="mt-4 flex items-center justify-between"><span className="text-xs font-semibold text-saffron-600">{p.spots} spot{p.spots > 1 ? 's' : ''} open</span><button onClick={() => toast(`Interest sent to ${p.by}!`)} className="btn-outline py-1.5 text-xs">I’m interested</button></div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 scroll-mt-24" id="idea">
          <SectionHeader icon={Rocket} title="Submit your startup idea" subtitle="Get instant feedback now and detailed mentor feedback within 7 days" />
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <form
              className="card space-y-3 p-5 sm:p-6"
              onSubmit={(e) => {
                e.preventDefault()
                const fb = ideaFeedback(idea)
                setResult(fb)
                addIdea({ ...idea, score: fb.score, by: user?.name ?? 'Guest' })
                toast('Idea submitted! Check your instant feedback.')
              }}
            >
              <div><label className="label">Idea title *</label><input required className="input" value={idea.title} onChange={(e) => setIdea({ ...idea, title: e.target.value })} placeholder="e.g. Setu Bus — live bus tracking for small towns" /></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><label className="label">Theme</label><select className="input select-arrow" value={idea.theme} onChange={(e) => setIdea({ ...idea, theme: e.target.value })}>{['Education', 'Agriculture', 'Health', 'Transport', 'FinTech', 'Environment', 'Other'].map((t) => <option key={t}>{t}</option>)}</select></div>
                <div><label className="label">Stage</label><select className="input select-arrow" value={idea.stage} onChange={(e) => setIdea({ ...idea, stage: e.target.value })}>{['Just an idea', 'Mockup / design', 'Working prototype', 'Users / pilot'].map((t) => <option key={t}>{t}</option>)}</select></div>
              </div>
              <div><label className="label">Problem *</label><textarea required rows={3} className="input" value={idea.problem} onChange={(e) => setIdea({ ...idea, problem: e.target.value })} placeholder="What problem are you solving and how big is it?" /></div>
              <div><label className="label">Solution *</label><textarea required rows={3} className="input" value={idea.solution} onChange={(e) => setIdea({ ...idea, solution: e.target.value })} placeholder="How does your solution work?" /></div>
              <div><label className="label">Target users *</label><input required className="input" value={idea.users} onChange={(e) => setIdea({ ...idea, users: e.target.value })} placeholder="e.g. 50,000 daily commuters in Tier-3 towns of MP" /></div>
              <button className="btn-accent w-full">Get feedback</button>
            </form>
            <div className="card p-5 sm:p-6">
              {result ? (
                <>
                  <p className="text-sm text-slate-500">Idea readiness score</p>
                  <p className={`font-display text-5xl font-extrabold ${result.score >= 80 ? 'text-emerald-600' : result.score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>{result.score}%</p>
                  <ul className="mt-4 space-y-2">{result.checks.map((c) => <li key={c.good} className={`flex gap-2 text-sm ${c.ok ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300'}`}>{c.ok ? '✅' : '👉'} {c.ok ? c.good : c.bad}</li>)}</ul>
                  <p className="mt-4 text-xs text-slate-400">A mentor will review your idea within 7 days. Track it in your dashboard.</p>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center py-8 text-center">
                  <Lightbulb className="h-12 w-12 text-amber-400" />
                  <p className="mt-3 font-bold">Your feedback appears here</p>
                  <p className="mt-1 text-sm text-slate-500">{ideas.length ? `${ideas.length} idea(s) submitted from this device.` : 'We check clarity, scale, users and stage — instantly.'}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <Modal open={Boolean(mentor)} onClose={() => setMentor(null)} title={mentor ? `Request guidance from ${mentor.name}` : ''}>
        {mentor && (
          <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); requestMentor({ mentorId: mentor.id, mentorName: mentor.name, studentId: user?.id ?? 'guest', studentName: user?.name ?? fd.get('name'), topic: fd.get('topic'), message: fd.get('message') }); setMentor(null); toast('Request sent! The mentor will respond soon.') }} className="space-y-3">
            {!user && <div><label className="label">Your name</label><input name="name" required className="input" /></div>}
            <div><label className="label">Topic</label><select name="topic" className="input select-arrow">{mentor.expertise.map((x) => <option key={x}>{x}</option>)}</select></div>
            <div><label className="label">What do you need help with?</label><textarea name="message" required rows={4} className="input" placeholder="Share your idea/stage and specific questions" /></div>
            <button className="btn-primary w-full">Send request</button>
          </form>
        )}
      </Modal>

      <Modal open={postOpen} onClose={() => setPostOpen(false)} title="Find teammates">
        <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); addTeamPost({ title: fd.get('title'), by: user?.name ?? fd.get('name'), college: fd.get('college'), skills: String(fd.get('skills')).split(',').map((s) => s.trim()).filter(Boolean), spots: +fd.get('spots') }); setPostOpen(false); toast('Posted to the team board!') }} className="space-y-3">
          <div><label className="label">What are you building?</label><input name="title" required className="input" placeholder="Need a backend dev for SIH" /></div>
          {!user && <div><label className="label">Your name</label><input name="name" required className="input" /></div>}
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="label">College</label><input name="college" required className="input" placeholder="RGPV" /></div>
            <div><label className="label">Spots</label><input name="spots" type="number" min="1" max="5" defaultValue="1" className="input" /></div>
          </div>
          <div><label className="label">Skills needed (comma separated)</label><input name="skills" required className="input" placeholder="Node.js, MongoDB" /></div>
          <button className="btn-accent w-full">Post</button>
        </form>
      </Modal>
    </>
  )
}
