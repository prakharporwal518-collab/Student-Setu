import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, BookOpen, Check, CheckCircle2, ClipboardList, Flag, GraduationCap, Heart, Inbox, Lightbulb, MessageSquare, RotateCcw, ShieldCheck, Soup, Trophy, Users, X, BedDouble } from 'lucide-react'
import { Avatar, Badge, ChipGroup, EmptyState, SmartImage } from '../components/ui'
import { DashboardShell, statusTone } from '../components/ui/Dashboard'
import HostelCard from '../components/hostel/HostelCard'
import Ring from '../components/ui/Ring'
import { BadgeCertificate } from '../components/skills/SkillTest'
import useMyBadges from '../hooks/useMyBadges'
import usePersistentState from '../hooks/usePersistentState'
import { buildPlan, computeGap } from '../data/skillbridge'
import { useData } from '../context/DataContext'
import { useAuth, useToast } from '../context/AppContext'
import { cityById, formatINR } from '../data/common'
import { books } from '../data/library'
import { scholarships } from '../data/scholarships'
import { students } from '../data/community'
import { typeLabel } from '../data/hostels'

/* --------------------------------------------------------------- Student */
export function StudentDashboard() {
  const { user } = useAuth()
  const { hostels, tiffins, saved, quizHistory, applied, connections, ideas, mentorRequests, toggleApplied } = useData()
  const [tab, setTab] = useState('bridge')
  const badges = useMyBadges()
  const [bridge] = usePersistentState('ss-skillbridge', null)
  const gap = bridge ? computeGap({ courseId: bridge.courseId, sem: bridge.sem, roleId: bridge.roleId, ratings: bridge.ratings, badges: badges.map((b) => b.payload.skill) }) : null
  const plan = gap ? buildPlan(gap, bridge.minutes) : null
  const planDone = plan ? plan.tasks.filter((x) => bridge.done?.[x.id]).length : 0
  const savedHostels = hostels.filter((h) => saved.hostels.includes(h.id))
  const savedTiffins = tiffins.filter((t) => saved.tiffins.includes(t.id))
  const savedBooks = books.filter((b) => saved.books.includes(b.id))
  const myScholarships = scholarships.filter((s) => applied.includes(s.id) || saved.scholarships.includes(s.id))
  const avg = quizHistory.length ? Math.round((quizHistory.reduce((a, q) => a + q.score / q.total, 0) / quizHistory.length) * 100) : 0

  return (
    <DashboardShell
      title={`Hi, ${user.name.split(' ')[0]}!`}
      subtitle="Student dashboard"
      actions={<><Link to="/hostels" className="btn bg-white/10 text-white hover:bg-white/20">Find stays</Link><Link to="/exams#quizzes" className="btn-accent">Take a quiz</Link></>}
      stats={[
        { icon: Heart, label: 'Saved stays & tiffins', value: savedHostels.length + savedTiffins.length, tint: 'bg-rose-50 text-rose-600 dark:bg-rose-500/15' },
        { icon: Bookmark, label: 'Bookmarked resources', value: saved.resources.length + saved.books.length },
        { icon: Trophy, label: `Quizzes taken · avg ${avg}%`, value: quizHistory.length, tint: 'bg-saffron-50 text-saffron-600 dark:bg-saffron-500/15' },
        { icon: GraduationCap, label: 'Scholarships applied', value: applied.length, tint: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15' },
      ]}
    >
      <ChipGroup value={tab} onChange={setTab} options={[{ value: 'bridge', label: `Skill Bridge & badges (${badges.length})` }, { value: 'saved', label: 'Saved stays & food' }, { value: 'resources', label: 'Bookmarks' }, { value: 'quiz', label: 'Quiz history' }, { value: 'scholarships', label: 'Scholarships' }, { value: 'network', label: 'Network & ideas' }]} />
      <div className="mt-5">
        {tab === 'bridge' && (
          !gap ? (
            <EmptyState icon={GraduationCap} title="Find your skill gap" text="Pick your course and dream job to see how job-ready you are and get a personal plan." action={<Link to="/skill-bridge" className="btn-accent">Open Skill Bridge</Link>} />
          ) : (
            <div className="space-y-5">
              <div className="card flex flex-col items-center gap-5 p-5 sm:flex-row">
                <Ring value={gap.readiness} size={110} stroke={10} />
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-lg font-bold">{gap.role.name}</p>
                  <p className="text-sm text-slate-500">{gap.course.name} · Semester {bridge.sem} · syllabus alone gives {gap.syllabusFull}% by graduation</p>
                  <p className="mt-2 text-sm">Plan progress: <b>{planDone}/{plan.tasks.length}</b> tasks · about {plan.totalWeeks} weeks at {bridge.minutes} min/day</p>
                </div>
                <Link to="/skill-bridge#plan" className="btn-primary">Continue my plan</Link>
              </div>
              {badges.length ? <div className="grid gap-4 lg:grid-cols-2">{badges.map((b) => <BadgeCertificate key={b.token} payload={b.payload} token={b.token} />)}</div> : <p className="card p-5 text-sm text-slate-500">No verified badges yet. <Link to="/skill-bridge#verify" className="link">Take a 5-question skill test</Link></p>}
            </div>
          )
        )}
        {tab === 'saved' && (
          <div className="space-y-6">
            {savedHostels.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{savedHostels.map((h) => <HostelCard key={h.id} hostel={h} />)}</div> : <EmptyState icon={Heart} title="No saved stays yet" text="Tap the heart on any hostel or PG to save it here." action={<Link to="/hostels" className="btn-primary">Browse stays</Link>} />}
            {savedTiffins.length > 0 && (
              <div className="card p-5"><h3 className="mb-3 font-bold">Saved tiffin services</h3><ul className="divide-y divide-slate-100 dark:divide-white/10">{savedTiffins.map((t) => <li key={t.id} className="flex items-center justify-between py-2.5 text-sm"><Link to={`/tiffin?focus=${t.id}`} className="flex items-center gap-2 font-semibold hover:text-brand-700"><Soup className="h-4 w-4 text-saffron-500" /> {t.name} <span className="font-normal text-slate-400">· {t.area}</span></Link><b>{formatINR(t.monthly)}/mo</b></li>)}</ul></div>
            )}
          </div>
        )}
        {tab === 'resources' && (
          saved.resources.length + savedBooks.length === 0 ? <EmptyState icon={Bookmark} title="No bookmarks yet" text="Bookmark notes, PYQs and books to find them quickly." action={<Link to="/resources" className="btn-primary">Study resources</Link>} /> : (
            <div className="card divide-y divide-slate-100 p-2 dark:divide-white/10">
              {saved.resources.map((k) => { const [, sem, title] = k.split('|'); return <div key={k} className="flex items-center gap-3 p-3 text-sm"><BookOpen className="h-4 w-4 text-brand-700" /><span className="flex-1">{title}</span><Badge tone="gray">Sem {sem}</Badge></div> })}
              {savedBooks.map((b) => <a key={b.id} href={b.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 text-sm hover:text-brand-700"><Bookmark className="h-4 w-4 text-saffron-500" /><span className="flex-1">{b.title}</span><Badge tone="brand">E-Library</Badge></a>)}
            </div>
          )
        )}
        {tab === 'quiz' && (
          quizHistory.length === 0 ? <EmptyState icon={Trophy} title="No quizzes yet" text="Free quizzes with instant results — try one now." action={<Link to="/exams#quizzes" className="btn-primary">Start a quiz</Link>} /> : (
            <div className="card overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-100 text-xs uppercase text-slate-400 dark:border-white/10"><tr><th className="p-3">Quiz</th><th className="p-3">Score</th><th className="p-3">Date</th><th className="p-3" /></tr></thead>
                <tbody>{quizHistory.map((q) => <tr key={q.id} className="border-b border-slate-50 last:border-0 dark:border-white/5"><td className="p-3 font-semibold">{q.title}</td><td className="p-3"><Badge tone={q.score / q.total >= 0.6 ? 'green' : 'saffron'}>{q.score}/{q.total}</Badge></td><td className="p-3 text-slate-500">{new Date(q.at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td><td className="p-3"><Link to={`/quiz/${q.quizId}`} className="link inline-flex items-center gap-1 text-xs"><RotateCcw className="h-3.5 w-3.5" /> Retry</Link></td></tr>)}</tbody>
              </table>
            </div>
          )
        )}
        {tab === 'scholarships' && (
          myScholarships.length === 0 ? <EmptyState icon={GraduationCap} title="No scholarships tracked" text="Save or mark scholarships as applied to track them." action={<Link to="/scholarships" className="btn-primary">Find scholarships</Link>} /> : (
            <div className="grid gap-3 md:grid-cols-2">{myScholarships.map((s) => <div key={s.id} className="card flex items-center gap-3 p-4"><div className="min-w-0 flex-1"><p className="truncate font-semibold">{s.name}</p><p className="text-xs text-slate-500">{s.amount} · {s.deadline}</p></div><button onClick={() => toggleApplied(s.id)} className={applied.includes(s.id) ? 'btn py-1.5 text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'btn-outline py-1.5 text-xs'}>{applied.includes(s.id) ? <><CheckCircle2 className="h-3.5 w-3.5" /> Applied</> : 'Mark applied'}</button></div>)}</div>
          )
        )}
        {tab === 'network' && (
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="card p-5"><h3 className="mb-3 flex items-center gap-2 font-bold"><Users className="h-4 w-4" /> Connection requests</h3>{connections.length ? <ul className="space-y-3">{students.filter((s) => connections.includes(s.id)).map((s) => <li key={s.id} className="flex items-center gap-2 text-sm"><Avatar name={s.name} size="h-8 w-8 text-xs" /> <span className="flex-1">{s.name}</span><Badge tone="amber">Pending</Badge></li>)}</ul> : <p className="text-sm text-slate-500">No requests yet. <Link to="/connect" className="link">Find local students</Link></p>}</div>
            <div className="card p-5"><h3 className="mb-3 flex items-center gap-2 font-bold"><MessageSquare className="h-4 w-4" /> Mentor requests</h3>{mentorRequests.filter((r) => r.studentId === user.id).length ? <ul className="space-y-2">{mentorRequests.filter((r) => r.studentId === user.id).map((r) => <li key={r.id} className="flex items-center justify-between gap-2 text-sm"><span>{r.mentorName} · {r.topic}</span><Badge tone={r.status === 'accepted' ? 'green' : r.status === 'declined' ? 'red' : 'amber'} className="capitalize">{r.status}</Badge></li>)}</ul> : <p className="text-sm text-slate-500">No requests. <Link to="/sidf#mentors" className="link">Browse mentors</Link></p>}</div>
            <div className="card p-5"><h3 className="mb-3 flex items-center gap-2 font-bold"><Lightbulb className="h-4 w-4" /> Submitted ideas</h3>{ideas.length ? <ul className="space-y-2">{ideas.map((i) => <li key={i.id} className="flex items-center justify-between gap-2 text-sm"><span className="truncate">{i.title}</span><Badge tone="purple">{i.score}%</Badge></li>)}</ul> : <p className="text-sm text-slate-500">No ideas yet. <Link to="/sidf#idea" className="link">Submit one</Link></p>}</div>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}

/* ---------------------------------------------------------------- Mentor */
export function MentorDashboard() {
  const { user } = useAuth()
  const { mentorRequests, updateMentorRequest, ideas } = useData()
  const toast = useToast()
  const pending = mentorRequests.filter((r) => r.status === 'pending')
  return (
    <DashboardShell
      title="Mentor Dashboard"
      subtitle={`Welcome, ${user.name}`}
      stats={[
        { icon: Inbox, label: 'Pending requests', value: pending.length, tint: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15' },
        { icon: Check, label: 'Accepted', value: mentorRequests.filter((r) => r.status === 'accepted').length, tint: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15' },
        { icon: Lightbulb, label: 'Ideas to review', value: ideas.length },
        { icon: Users, label: 'Students guided', value: 140 },
      ]}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-3 font-bold">Guidance requests</h3>
          {mentorRequests.length === 0 ? <p className="text-sm text-slate-500">No requests yet. Students can request you from the <Link to="/sidf#mentors" className="link">SIDF page</Link>.</p> : (
            <ul className="space-y-3">{mentorRequests.map((r) => <li key={r.id} className="rounded-xl bg-slate-50 p-3 dark:bg-white/5"><div className="flex items-start justify-between gap-2"><div><p className="text-sm font-semibold">{r.studentName} · <span className="font-normal">{r.topic}</span></p><p className="text-xs text-slate-500">To {r.mentorName}</p></div><Badge tone={r.status === 'accepted' ? 'green' : r.status === 'declined' ? 'red' : 'amber'} className="capitalize">{r.status}</Badge></div><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{r.message}</p>{r.status === 'pending' && <div className="mt-3 flex gap-2"><button onClick={() => { updateMentorRequest(r.id, 'accepted'); toast('Accepted — the student has been notified.') }} className="btn-primary py-1.5 text-xs"><Check className="h-3.5 w-3.5" /> Accept</button><button onClick={() => updateMentorRequest(r.id, 'declined')} className="btn-ghost py-1.5 text-xs"><X className="h-3.5 w-3.5" /> Decline</button></div>}</li>)}</ul>
          )}
        </div>
        <div className="card p-5">
          <h3 className="mb-3 font-bold">Submitted ideas</h3>
          {ideas.length === 0 ? <p className="text-sm text-slate-500">No ideas submitted yet.</p> : <ul className="space-y-3">{ideas.map((i) => <li key={i.id} className="rounded-xl bg-slate-50 p-3 dark:bg-white/5"><div className="flex justify-between gap-2"><p className="text-sm font-semibold">{i.title}</p><Badge tone="purple">{i.score}%</Badge></div><p className="text-xs text-slate-500">{i.by} · {i.theme} · {i.stage}</p><p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{i.problem}</p></li>)}</ul>}
        </div>
      </div>
    </DashboardShell>
  )
}

/* ----------------------------------------------------------------- Admin */
export function AdminPanel() {
  const { hostels, tiffins, hostelActions, tiffinActions, reports, resolveReport, resetDemo } = useData()
  const { users } = useAuth()
  const toast = useToast()
  const [tab, setTab] = useState('listings')
  const pendingH = hostels.filter((h) => h.status === 'pending')
  const pendingT = tiffins.filter((t) => t.status === 'pending')
  const allReviews = [
    ...hostels.flatMap((h) => (h.reviews ?? []).map((r) => ({ ...r, on: h.name, kind: 'hostel', parent: h.id }))),
    ...tiffins.flatMap((t) => (t.reviews ?? []).map((r) => ({ ...r, on: t.name, kind: 'tiffin', parent: t.id }))),
  ].filter((r) => r.id)

  const decide = (kind, id, ok) => {
    const act = kind === 'hostel' ? hostelActions : tiffinActions
    act.update(id, ok ? { status: 'approved', verified: true } : { status: 'rejected' })
    toast(ok ? 'Approved & verified ✓' : 'Listing rejected', ok ? 'success' : 'info')
  }

  return (
    <DashboardShell
      title="Admin Panel"
      subtitle="Verify listings, manage resources, moderate reviews"
      actions={<button onClick={() => { if (confirm('Reset all demo data?')) { resetDemo(); toast('Demo data reset', 'info') } }} className="btn bg-white/10 text-white hover:bg-white/20"><RotateCcw className="h-4 w-4" /> Reset demo data</button>}
      stats={[
        { icon: ClipboardList, label: 'Pending verification', value: pendingH.length + pendingT.length, tint: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15' },
        { icon: BedDouble, label: 'Hostels live', value: hostels.filter((h) => h.status === 'approved').length },
        { icon: Flag, label: 'Open reports', value: reports.filter((r) => r.status === 'open').length, tint: 'bg-rose-50 text-rose-600 dark:bg-rose-500/15' },
        { icon: Users, label: 'Registered users', value: users.length, tint: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15' },
      ]}
    >
      <ChipGroup value={tab} onChange={setTab} options={[{ value: 'listings', label: `Approve listings (${pendingH.length + pendingT.length})` }, { value: 'all', label: 'All listings' }, { value: 'reviews', label: 'Moderate reviews' }, { value: 'reports', label: 'Content reports' }]} />
      <div className="mt-5">
        {tab === 'listings' && (
          pendingH.length + pendingT.length === 0 ? <EmptyState icon={ShieldCheck} title="All caught up!" text="New hostel and tiffin listings will appear here for verification. Try adding one from the owner dashboard." /> : (
            <div className="grid gap-4 md:grid-cols-2">
              {[...pendingH.map((x) => ({ ...x, kind: 'hostel' })), ...pendingT.map((x) => ({ ...x, kind: 'tiffin' }))].map((x) => (
                <div key={x.id} className="card flex gap-4 p-4">
                  <SmartImage src={x.images?.[0] ?? x.image} alt={x.name} icon={x.kind === 'hostel' ? BedDouble : Soup} className="h-24 w-28 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <Badge tone={x.kind === 'hostel' ? 'brand' : 'saffron'}>{x.kind === 'hostel' ? typeLabel[x.type] : 'Tiffin service'}</Badge>
                    <p className="mt-1 font-bold">{x.name}</p>
                    <p className="text-xs text-slate-500">{x.area}, {cityById(x.city)?.name} · {formatINR(x.rent ?? x.monthly)}/mo · {x.owner?.phone ?? x.contact}</p>
                    <div className="mt-3 flex gap-2"><button onClick={() => decide(x.kind, x.id, true)} className="btn-primary py-1.5 text-xs"><Check className="h-3.5 w-3.5" /> Approve</button><button onClick={() => decide(x.kind, x.id, false)} className="btn-ghost py-1.5 text-xs text-rose-600"><X className="h-3.5 w-3.5" /> Reject</button></div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
        {tab === 'all' && (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase text-slate-400 dark:border-white/10"><tr><th className="p-3">Name</th><th className="p-3">Type</th><th className="p-3">City</th><th className="p-3">Status</th><th className="p-3">Verified</th><th className="p-3" /></tr></thead>
              <tbody>
                {[...hostels.map((x) => ({ ...x, kind: 'hostel' })), ...tiffins.map((x) => ({ ...x, kind: 'tiffin' }))].map((x) => (
                  <tr key={x.id} className="border-b border-slate-50 last:border-0 dark:border-white/5">
                    <td className="p-3 font-semibold">{x.name}</td>
                    <td className="p-3 text-slate-500">{x.kind === 'hostel' ? typeLabel[x.type] : 'Tiffin'}</td>
                    <td className="p-3 text-slate-500">{cityById(x.city)?.name}</td>
                    <td className="p-3"><Badge tone={statusTone[x.status]} className="capitalize">{x.status}</Badge></td>
                    <td className="p-3"><button onClick={() => (x.kind === 'hostel' ? hostelActions : tiffinActions).update(x.id, { verified: !x.verified })} className={`rounded-full px-2 py-0.5 text-xs font-semibold ${x.verified ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-white/10'}`}>{x.verified ? 'Verified' : 'Unverified'}</button></td>
                    <td className="p-3 text-right">{x.status === 'approved' ? <button onClick={() => decide(x.kind, x.id, false)} className="text-xs text-rose-600 hover:underline">Unpublish</button> : <button onClick={() => decide(x.kind, x.id, true)} className="text-xs text-brand-700 hover:underline">Approve</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {tab === 'reviews' && (
          allReviews.length === 0 ? <EmptyState icon={MessageSquare} title="No new user reviews" text="Reviews posted by users on hostel and tiffin pages appear here for moderation." /> : (
            <ul className="space-y-3">{allReviews.map((r) => <li key={r.id} className="card flex items-start gap-3 p-4"><Avatar name={r.name} size="h-9 w-9 text-xs" /><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{r.name} <span className="font-normal text-slate-400">on {r.on} · {'★'.repeat(r.rating)}</span></p><p className="text-sm text-slate-600 dark:text-slate-300">{r.text}</p></div><button onClick={() => { (r.kind === 'hostel' ? hostelActions : tiffinActions).removeReview(r.parent, r.id); toast('Review removed', 'info') }} className="btn-ghost py-1.5 text-xs text-rose-600">Remove</button></li>)}</ul>
          )
        )}
        {tab === 'reports' && (
          reports.length === 0 ? <EmptyState icon={Flag} title="No reports" text="Content reported from the E-Library shows up here." /> : (
            <ul className="space-y-3">{reports.map((r) => <li key={r.id} className="card flex items-start gap-3 p-4"><Flag className="mt-0.5 h-5 w-5 text-rose-500" /><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{r.item}</p><p className="text-xs text-slate-500">{r.reason} · {new Date(r.at).toLocaleDateString('en-IN')}</p>{r.details && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{r.details}</p>}</div>{r.status === 'open' ? <button onClick={() => resolveReport(r.id)} className="btn-primary py-1.5 text-xs">Resolve</button> : <Badge tone="green">Resolved</Badge>}</li>)}</ul>
          )
        )}
      </div>
    </DashboardShell>
  )
}
