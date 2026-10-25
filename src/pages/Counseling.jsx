import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Calculator, CalendarCheck, Check, Clock, Cog, HeartHandshake, Languages, LifeBuoy, Mail, Phone, Scale, Sparkles, Stethoscope } from 'lucide-react'
import { Avatar, Badge, DemoNotice, Modal, PageHeader, SectionHeader } from '../components/ui'
import { useToast } from '../context/AppContext'
import usePersistentState from '../hooks/usePersistentState'
import { alternatives, counselors, dropYearCheck, helplines } from '../data/counseling'

const icons = { Stethoscope, Cog, Scale, Calculator }

export default function Counseling() {
  const [params, setParams] = useSearchParams()
  const toast = useToast()
  const examId = alternatives[params.get('exam')] ? params.get('exam') : 'neet'
  const alt = alternatives[examId]
  const [checks, setChecks] = useState([])
  const [booking, setBooking] = useState(null)
  const [requests, setRequests] = usePersistentState('ss-counsel-requests', [])

  const pickExam = (id) => setParams({ exam: id }, { replace: true })
  const yes = checks.length

  return (
    <>
      <PageHeader icon={LifeBuoy} kicker="Counseling & Alternative Careers" title="One exam does not decide your life" subtitle="Missed a cut-off? Explore strong alternative careers, decide calmly about a drop year, and talk to a counsellor — free." crumbs={[{ label: 'Counseling' }]} />

      <div className="container-x py-8">
        {/* Support first */}
        <section className="grid gap-3 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 p-5 ring-1 ring-rose-100 dark:from-rose-500/10 dark:to-amber-500/10 dark:ring-rose-400/20 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="flex items-center gap-2 font-bold text-rose-900 dark:text-rose-100"><HeartHandshake className="h-5 w-5" /> Feeling stressed or low? You are not alone — talk to someone now.</p>
            <p className="mt-1 text-sm text-rose-800/80 dark:text-rose-200/80">{helplines[0].name} ({helplines[0].by}): {helplines[0].text}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={`tel:${helplines[0].phone}`} className="btn-primary bg-rose-600 py-2 hover:bg-rose-700"><Phone className="h-4 w-4" /> Call {helplines[0].phone}</a>
            <a href={`tel:${helplines[0].alt.replace(/-/g, '')}`} className="btn-outline py-2">{helplines[0].alt}</a>
            <a href="tel:112" className="btn-ghost py-2 text-rose-700">Emergency 112</a>
          </div>
        </section>

        {/* Alternatives */}
        <section className="mt-10">
          <SectionHeader icon={Sparkles} title="Exam didn’t go as planned? Here are your options" subtitle="Pick the exam you were preparing for." />
          <div className="mb-5 flex flex-wrap gap-2">
            {Object.entries(alternatives).map(([id, a]) => {
              const Icon = icons[a.icon] ?? Sparkles
              return <button key={id} onClick={() => pickExam(id)} className={`${examId === id ? 'chip-on' : 'chip-off'} gap-1.5`}><Icon className="h-4 w-4" /> {a.exam}</button>
            })}
          </div>
          <p className="mb-4 rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-900 dark:bg-brand-500/10 dark:text-brand-100">💡 {alt.headline}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {alt.options.map((o, i) => (
              <motion.div key={o.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="card flex flex-col p-5">
                <div className="flex items-start justify-between gap-2"><h3 className="font-bold">{o.name}</h3><Badge tone="saffron">{o.duration}</Badge></div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{o.why}</p>
                <p className="mt-3 text-xs"><b className="text-slate-700 dark:text-slate-200">How to get in:</b> <span className="text-slate-500">{o.route}</span></p>
                <div className="mt-3 flex flex-wrap gap-1">{o.careers.map((c) => <Badge key={c} tone="gray">{c}</Badge>)}</div>
              </motion.div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">Admission routes and cut-offs change every year and differ by state — confirm on official counselling websites (MCC, JoSAA, state boards).</p>
        </section>

        {/* Drop year */}
        <section className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="card p-6">
            <SectionHeader icon={CalendarCheck} title="Should I take a drop year?" subtitle="Tick what is true for you. Be honest — no one else sees this." />
            <ul className="space-y-2">
              {dropYearCheck.map((q, i) => {
                const on = checks.includes(i)
                return (
                  <li key={q}>
                    <button onClick={() => setChecks((c) => (on ? c.filter((x) => x !== i) : [...c, i]))} aria-pressed={on} className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition ${on ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : 'border-slate-200 dark:border-white/10'}`}>
                      <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border ${on ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300'}`}>{on && <Check className="h-3.5 w-3.5" />}</span>{q}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className={`card flex flex-col justify-center p-6 ${yes >= 3 ? 'bg-emerald-50 dark:bg-emerald-500/10' : yes >= 1 ? 'bg-amber-50 dark:bg-amber-500/10' : ''}`}>
            {yes === 0 ? (
              <p className="text-sm text-slate-500">Tick the statements on the left to see a suggestion.</p>
            ) : yes >= 3 ? (
              <>
                <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">A focused drop year can make sense for you.</p>
                <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-200">Join a parallel course (like a B.Sc) as a safety net, set weekly mock-test goals, and talk to a counsellor every month.</p>
              </>
            ) : (
              <>
                <p className="text-lg font-bold text-amber-900 dark:text-amber-100">Consider moving ahead with an alternative path.</p>
                <p className="mt-2 text-sm text-amber-800 dark:text-amber-200">The options above lead to respected careers without losing a year. A counsellor can help you choose.</p>
              </>
            )}
            <Link to="/pathways" className="link mt-4 inline-flex items-center gap-1 text-sm">See all courses after Class 12 <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>

        {/* Talk to an expert */}
        <section className="mt-12">
          <SectionHeader icon={HeartHandshake} title="Talk to an Expert" subtitle="Free 20-minute sessions with career counsellors and student well-being mentors." />
          <div className="grid gap-4 md:grid-cols-3">
            {counselors.map((c) => (
              <div key={c.name} className="card flex flex-col p-5">
                <div className="flex items-center gap-3"><Avatar name={c.name} /><div><p className="font-bold">{c.name}</p><p className="text-xs text-slate-500">{c.role}</p></div></div>
                <p className="mt-3 flex items-center gap-2 text-xs text-slate-500"><Languages className="h-4 w-4" /> {c.langs}</p>
                <p className="mt-1 flex items-center gap-2 text-xs text-slate-500"><Clock className="h-4 w-4" /> {c.slots}</p>
                <button onClick={() => setBooking(c)} className="btn-accent mt-4 py-2">Talk to an Expert</button>
              </div>
            ))}
          </div>
          {requests.length > 0 && <p className="mt-3 text-sm text-emerald-700 dark:text-emerald-300">✅ You have {requests.length} session request{requests.length > 1 ? 's' : ''} pending.</p>}
          <div className="mt-4"><DemoNotice>Demo: counsellor profiles are sample volunteer mentors, and requests are saved in this browser. For urgent help always call Tele-MANAS 14416.</DemoNotice></div>
          <p className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-700" /> Support team: <a href="mailto:hello@studentsetu.in" className="link">hello@studentsetu.in</a></span>
            <Link to="/help" className="link">Help & contact page</Link>
          </p>
        </section>
      </div>

      <Modal open={Boolean(booking)} onClose={() => setBooking(null)} title={booking ? `Book a session with ${booking.name}` : ''}>
        {booking && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const f = Object.fromEntries(new FormData(e.currentTarget))
              setRequests((r) => [...r, { ...f, counselor: booking.name, at: new Date().toISOString() }])
              setBooking(null)
              toast(`Request sent to ${booking.name}. You’ll get a call or email to confirm the time.`)
            }}
            className="space-y-3"
          >
            <div><label className="label" htmlFor="cn">Your name</label><input id="cn" name="name" required className="input" /></div>
            <div><label className="label" htmlFor="cc">Phone or email</label><input id="cc" name="contact" required className="input" /></div>
            <div><label className="label" htmlFor="ct">Preferred time</label><select id="ct" name="time" className="input select-arrow"><option>{booking.slots}</option><option>Any time this week</option></select></div>
            <div><label className="label" htmlFor="cm">What would you like to talk about? (optional)</label><textarea id="cm" name="message" rows={3} className="input" placeholder="e.g. I missed the NEET cut-off and don’t know what to do next" /></div>
            <button className="btn-primary w-full">Request free session</button>
          </form>
        )}
      </Modal>
    </>
  )
}
