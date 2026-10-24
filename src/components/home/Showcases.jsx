import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Award, BarChart3, CalendarClock, ClipboardList, Download, Feather, FileText, Languages, MessageCircle, NotebookPen, Route, Volume2, WifiOff, Wrench } from 'lucide-react'
import { Reveal } from '../ui'
import Ring from '../ui/Ring'
import { useLang, useLite, useToast } from '../../context/AppContext'
import { computeGap, rolesForCourse } from '../../data/skillbridge'
import { lifeModules } from '../../data/modules'
import { classInsights, seedDemoClass } from '../../shared/classroom'

const Kicker = ({ children }) => <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-saffron-600">{children}</p>

/* ---------------------------------------------------- Skill Bridge */
export function SkillBridgeShowcase() {
  const { t } = useLang()
  const roles = rolesForCourse('btech').slice(0, 4)
  const [roleId, setRoleId] = useState('web-dev')
  const [sem, setSem] = useState(5)
  const gap = useMemo(() => computeGap({ courseId: 'btech', sem, roleId }), [roleId, sem])
  const missing = gap.items.filter((i) => !i.inSyllabus && !i.laterSubjects.length).sort((a, b) => b.w - a.w).slice(0, 3)
  const features = [
    { icon: Route, title: 'Curriculum-to-Career Gap Map', text: 'Compares your university syllabus with what real jobs ask for — skill by skill.' },
    { icon: CalendarClock, title: 'Personalised learning plan', text: 'A week-by-week plan for your gaps, sized to your daily time, using free resources.' },
    { icon: Award, title: 'Verified Skill Badges', text: 'Server-graded tests and signed badges that employers can verify with one link.' },
  ]
  return (
    <section className="container-x section">
      <div className="grid items-center gap-8 rounded-3xl bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 p-6 text-white shadow-lift sm:p-10 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-saffron-300">{t('home.bridge.kicker')}</p>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Setu Skill Bridge</h2>
          <p className="mt-3 text-brand-100">A personalised AI path from <b className="text-white">your university syllabus</b> to <b className="text-white">a real job</b>. See the skills gap in numbers — then close it.</p>
          <ul className="mt-6 space-y-4">
            {features.map((f) => (
              <li key={f.title} className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15"><f.icon className="h-5 w-5 text-saffron-300" /></span>
                <span><span className="block font-semibold text-white">{f.title}</span><span className="text-sm text-brand-200">{f.text}</span></span>
              </li>
            ))}
          </ul>
          <Link to="/skill-bridge" className="btn-accent mt-7">{t('hero.cta1')} <ArrowRight className="h-4 w-4" /></Link>
        </div>

        <Reveal className="rounded-2xl bg-white p-5 text-slate-700 shadow-lift dark:bg-ink-900 dark:text-slate-300">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Live preview · B.Tech CSE · RGPV</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {roles.map((r) => (
              <button key={r.id} onClick={() => setRoleId(r.id)} className={roleId === r.id ? 'chip-on' : 'chip-off'}>{r.emoji} {r.name}</button>
            ))}
          </div>
          <label className="mt-4 block text-sm font-medium">Semester {sem}
            <input type="range" min={1} max={8} value={sem} onChange={(e) => setSem(+e.target.value)} className="mt-1 w-full accent-saffron-500" aria-label="Semester" />
          </label>
          <div className="mt-4 flex items-center gap-5">
            <Ring value={gap.syllabusNow} size={120} stroke={11} label="from syllabus" />
            <div className="space-y-1 text-sm">
              <p>By graduation, the syllabus covers <b className="text-slate-900 dark:text-white">{gap.syllabusFull}%</b> of what <b className="text-slate-900 dark:text-white">{gap.role.name}</b> jobs need.</p>
              {missing.length > 0 && <p className="text-rose-600 dark:text-rose-400">Never taught: {missing.map((m) => m.skill.name).join(', ')}</p>}
            </div>
          </div>
          <Link to="/skill-bridge" className="link mt-4 inline-flex items-center gap-1 text-sm">Get my full plan <ArrowRight className="h-4 w-4" /></Link>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------- Teacher Copilot */
const demoInsights = (() => {
  const { cls, submissions } = seedDemoClass()
  return classInsights(cls, submissions)
})()
const heat = (pct) => (pct < 40 ? 'bg-rose-500 text-white' : pct < 60 ? 'bg-orange-400 text-white' : pct < 75 ? 'bg-amber-300 text-amber-950' : 'bg-emerald-500 text-white')

export function TeacherShowcase() {
  const { t } = useLang()
  const items = [
    { icon: NotebookPen, title: 'AI lesson plans', text: 'Syllabus-aligned, timed plans with Indian examples — in English or Hindi.' },
    { icon: FileText, title: 'Question papers', text: 'University-style papers with marks and difficulty levels, ready to print.' },
    { icon: ClipboardList, title: 'Auto-graded quizzes', text: 'Students join with a code on any phone — no login, instant results.' },
    { icon: BarChart3, title: 'Weak-topic heatmap', text: 'See what the class hasn’t understood and re-teach it in one click.' },
  ]
  return (
    <section className="container-x pb-12 sm:pb-16">
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
        <Reveal className="card order-2 p-5 lg:order-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Demo class · DBMS · 26 students</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {demoInsights.topics.map((tp) => (
              <div key={tp.topic} className={`rounded-xl p-3 ${heat(tp.pct)}`}>
                <p className="text-xs font-semibold opacity-90">{tp.topic}</p>
                <p className="font-display text-2xl font-extrabold">{tp.pct}%</p>
              </div>
            ))}
          </div>
          {demoInsights.weakest && <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-800 dark:bg-rose-500/10 dark:text-rose-200">Only <b>{demoInsights.weakest.pct}%</b> got <b>{demoInsights.weakest.topic}</b> right → Copilot drafts a re-teach lesson.</p>}
        </Reveal>
        <div className="order-1 lg:order-2">
          <Kicker>{t('home.teacher.kicker')}</Kicker>
          <h2 className="text-3xl font-extrabold sm:text-4xl">Teacher Copilot</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">An AI teaching assistant for government and local colleges — saving hours of preparation and showing exactly where students need help.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {items.map((f) => (
              <div key={f.title} className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-800 dark:bg-white/10 dark:text-brand-200"><f.icon className="h-5 w-5" /></span>
                <span><span className="block font-semibold text-slate-900 dark:text-white">{f.title}</span><span className="text-sm text-slate-500 dark:text-slate-400">{f.text}</span></span>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/teacher" className="btn-primary">{t('hero.cta2')} <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/class" className="btn-outline">{t('nav.joinClass')}</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------- Built for Bharat */
export function BharatSection() {
  const { t } = useLang()
  const { lite, toggleLite } = useLite()
  const toast = useToast()
  const saveOffline = async () => {
    try {
      const { prefetchAllPages } = await import('../../pageLoaders')
      await prefetchAllPages()
      toast('Saved! Pages you have opened work without internet.')
    } catch {
      toast('Could not save right now — try again when online.', 'warning')
    }
  }
  const tiles = [
    { icon: Languages, title: 'Hindi + English', text: 'Switch the whole site to हिंदी; Copilot writes lessons in Hindi.' },
    { icon: Feather, title: 'Lite mode', text: 'No photos or animations — saves mobile data on 2G/3G.', action: <button onClick={toggleLite} className={lite ? 'chip-on' : 'chip-off'}>{lite ? 'On ✓' : 'Turn on'}</button> },
    { icon: WifiOff, title: 'Works offline', text: 'Install the app; plans, notes and opened pages work without internet.', action: <button onClick={saveOffline} className="chip-off"><Download className="h-3.5 w-3.5" /> Save for offline</button> },
    { icon: Volume2, title: 'Listen aloud', text: 'Plans, lessons and notes can be read out — great for low literacy or eyes-free study.' },
    { icon: MessageCircle, title: 'WhatsApp sharing', text: 'Share plans, class codes and badges on WhatsApp in one tap.' },
    { icon: Wrench, title: 'Vocational in Hindi', text: 'Electrician, solar, mobile repair, Tally & more — with verified tests.', action: <Link to="/vocational" className="chip-off">Explore</Link> },
  ]
  return (
    <section className="container-x pb-12 sm:pb-16">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-extrabold sm:text-3xl">{t('home.bharat.title')}</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Remote learning that works on a basic phone, slow internet and in your language.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((x, i) => (
          <Reveal key={x.title} delay={i * 0.04}>
            <div className="card flex h-full gap-4 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-saffron-50 text-saffron-600 dark:bg-saffron-500/15 dark:text-saffron-300"><x.icon className="h-5 w-5" /></span>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{x.title}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{x.text}</p>
                {x.action && <div className="mt-3">{x.action}</div>}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------- Student life (optional) */
export function StudentLifeSection() {
  const { t } = useLang()
  return (
    <section className="container-x pt-12 sm:pt-16">
      <div className="rounded-3xl border border-dashed border-slate-300 p-5 dark:border-white/15 sm:p-7">
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold sm:text-2xl">{t('home.life.title')}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('home.life.subtitle')}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {lifeModules.map((m) => (
            <Link key={m.id} to={m.to} className="card card-hover group flex items-center gap-3 p-3">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${m.tint}`}><m.icon className="h-5 w-5" /></span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-slate-900 dark:text-white">{t(m.key)}</span>
                <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{t(m.key + '.d')}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
