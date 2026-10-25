import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Building2, CalendarClock, Check, Compass, ExternalLink, FileText, GraduationCap, Landmark, LifeBuoy, PlayCircle, School } from 'lucide-react'
import { Badge, PageHeader, SectionHeader } from '../components/ui'
import { WhatsAppButton } from '../components/ui/Share'
import { exams, fields, isEligible, pathwayCourses, streamPresets, studyLinks, subjects } from '../data/pathways'

const planB = { neet: 'neet', jeemain: 'jee', jeeadv: 'jee', clat: 'clat', ca: 'ca' }

export default function Pathways() {
  const [params, setParams] = useSearchParams()
  const preset = streamPresets.find((p) => p.id === params.get('stream')) ?? streamPresets[1]
  const [have, setHave] = useState(preset.subjects)
  const [openId, setOpenId] = useState(params.get('course') ?? null)

  const pickPreset = (p) => { setHave(p.subjects); setOpenId(null); setParams({ stream: p.id }, { replace: true }) }
  const toggle = (s) => { setHave((h) => (h.includes(s) ? h.filter((x) => x !== s) : [...h, s])); setOpenId(null) }

  const eligible = useMemo(() => pathwayCourses.filter((c) => isEligible(c, have)), [have])
  const examCount = useMemo(() => new Set(eligible.flatMap((c) => c.exams)).size, [eligible])
  const open = eligible.find((c) => c.id === openId) ?? null
  const activePreset = streamPresets.find((p) => p.subjects.length === have.length && p.subjects.every((s) => have.includes(s)))

  return (
    <>
      <PageHeader icon={School} kicker="For school students · After Class 12" title="Your subjects → every course you can take" subtitle="Pick your Class 12 subjects. See every public and private university course open to you, the entrance exams to take, a step-by-step roadmap, and free notes and videos." crumbs={[{ label: 'After 12th pathways' }]}>
        <div className="flex shrink-0 flex-col gap-2 text-sm text-brand-100">
          <span className="flex items-center gap-2"><Check className="h-4 w-4 text-saffron-300" /> {pathwayCourses.length} courses · {Object.keys(exams).length} entrance routes</span>
          <span className="flex items-center gap-2"><Check className="h-4 w-4 text-saffron-300" /> Official exam & counselling links</span>
          <span className="flex items-center gap-2"><Check className="h-4 w-4 text-saffron-300" /> 100% free</span>
        </div>
      </PageHeader>

      <div className="container-x py-8">
        {/* Step 1 */}
        <section className="card p-5">
          <p className="text-sm font-bold text-slate-800 dark:text-white"><span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-brand-800 text-xs text-white">1</span>Choose your stream or tick your Class 12 subjects</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {streamPresets.map((p) => (
              <button key={p.id} onClick={() => pickPreset(p)} className={activePreset?.id === p.id ? 'chip-on' : 'chip-off'}>{p.label}</button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {subjects.map((s) => {
              const on = have.includes(s)
              return (
                <button key={s} onClick={() => toggle(s)} aria-pressed={on} className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${on ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200' : 'border-slate-200 text-slate-500 hover:border-slate-300 dark:border-white/10'}`}>
                  {on && <Check className="h-3.5 w-3.5" />}{s}
                </button>
              )
            })}
          </div>
        </section>

        {/* Step 2 */}
        <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
          <SectionHeader icon={Compass} title={`${eligible.length} courses open to you`} subtitle={`Across ${new Set(eligible.map((c) => c.field)).size} fields, through ${examCount} entrance routes. Tap a course for the exams, roadmap and free study material.`} />
        </div>
        {fields.filter((f) => eligible.some((c) => c.field === f)).map((f) => (
          <div key={f} className="mb-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">{f}</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {eligible.filter((c) => c.field === f).map((c, i) => (
                <motion.button key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} onClick={() => setOpenId(c.id === openId ? null : c.id)} aria-expanded={c.id === openId}
                  className={`card p-4 text-left transition ${c.id === openId ? 'ring-2 ring-saffron-500' : 'hover:-translate-y-0.5'}`}>
                  <span className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{c.name}</span>
                    <ArrowRight className={`mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition ${c.id === openId ? 'rotate-90 text-saffron-500' : ''}`} />
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">{c.duration}</span>
                  <span className="mt-2 flex flex-wrap gap-1">{c.exams.map((e) => <Badge key={e} tone="brand">{exams[e].name}</Badge>)}</span>
                </motion.button>
              ))}
            </div>
            {open?.field === f && <CourseDetail course={open} />}
          </div>
        ))}
        {eligible.length === 0 && <p className="card p-8 text-center text-slate-500">Tick at least one subject to see courses.</p>}

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <Link to="/counseling" className="card card-hover flex items-center gap-4 p-5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/15"><LifeBuoy className="h-6 w-6" /></span>
            <span><span className="block font-bold">Didn’t clear an exam? You still have great options</span><span className="text-sm text-slate-500">Alternative careers for NEET, JEE, CLAT and CA — and free counselling.</span></span>
          </Link>
          <Link to="/scholarships" className="card card-hover flex items-center gap-4 p-5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15"><Landmark className="h-6 w-6" /></span>
            <span><span className="block font-bold">Worried about fees?</span><span className="text-sm text-slate-500">Government & private scholarships you can apply for after Class 12.</span></span>
          </Link>
        </section>
        <p className="mt-4 text-xs text-slate-400">Exam months are typical, not fixed. Always confirm eligibility, dates and seats on the official websites linked above.</p>
      </div>
    </>
  )
}

function CourseDetail({ course }) {
  const [examId, setExamId] = useState(course.exams[0])
  const exam = exams[examId]
  const b = planB[examId]
  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card mt-3 grid gap-6 p-5 lg:grid-cols-[1.25fr_1fr]">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-xl font-extrabold">{course.name}</h3>
          <Badge tone="saffron">{course.duration}</Badge>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-white/5"><p className="flex items-center gap-1.5 font-semibold"><Landmark className="h-4 w-4 text-brand-700" /> Public / government</p><p className="mt-1 text-slate-600 dark:text-slate-300">{course.public}</p></div>
          <div className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-white/5"><p className="flex items-center gap-1.5 font-semibold"><Building2 className="h-4 w-4 text-saffron-600" /> Private</p><p className="mt-1 text-slate-600 dark:text-slate-300">{course.private}</p></div>
        </div>
        {course.note && <p className="mt-2 text-xs text-slate-500">ℹ️ {course.note}</p>}

        <p className="mt-5 text-sm font-bold">Entrance exams</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {course.exams.map((e) => <button key={e} onClick={() => setExamId(e)} className={examId === e ? 'chip-on' : 'chip-off'}>{exams[e].name}</button>)}
        </div>
        <div className="mt-3 rounded-xl border border-slate-100 p-3 text-sm dark:border-white/10">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1"><span><b>{exam.name}</b> · {exam.body}</span><span className="flex items-center gap-1 text-slate-500"><CalendarClock className="h-4 w-4" /> {exam.when}</span></p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            <a href={exam.url} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-1">Official website <ExternalLink className="h-3 w-3" /></a>
            <a href={exam.counselling.url} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-1">Counselling: {exam.counselling.name} <ExternalLink className="h-3 w-3" /></a>
          </div>
        </div>

        <p className="mt-5 text-sm font-bold">Step-by-step preparation roadmap</p>
        <ol className="mt-2 space-y-2">
          {exam.roadmap.map((r, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-800 text-xs font-bold text-white">{i + 1}</span>
              <span className="text-sm"><b className="text-brand-800 dark:text-brand-200">{r.when}:</b> {r.step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-100 p-4 dark:border-white/10">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold"><BookOpen className="h-4 w-4 text-emerald-600" /> Free notes & videos</p>
          <ul className="space-y-2">
            {studyLinks(course).map((l) => (
              <li key={l.label}>
                <a href={l.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg p-2 text-sm hover:bg-slate-50 dark:hover:bg-white/5">
                  {l.kind === 'Notes' ? <FileText className="h-4 w-4 shrink-0 text-brand-700" /> : <PlayCircle className="h-4 w-4 shrink-0 text-rose-600" />}
                  <span className="flex-1">{l.label}</span><ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-indigo-50 p-4 ring-1 ring-brand-100 dark:from-brand-500/10 dark:to-indigo-500/10 dark:ring-white/10">
          <p className="flex items-center gap-2 text-sm font-bold"><GraduationCap className="h-4 w-4" /> Careers after {course.name}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">{course.careers.map((c) => <Badge key={c} tone="gray">{c}</Badge>)}</div>
        </div>
        {b && (
          <Link to={`/counseling?exam=${b}`} className="flex items-center gap-2 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-800 ring-1 ring-rose-100 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-400/20">
            <LifeBuoy className="h-5 w-5 shrink-0" /> Plan B: if {exam.name} doesn’t go well, see alternative careers <ArrowRight className="ml-auto h-4 w-4" />
          </Link>
        )}
        <WhatsAppButton text={`${course.name} after Class 12 — exams, roadmap and free notes on Student Setu: ${location.origin}/pathways?course=${course.id}`} label="Share with a friend" />
      </div>
    </motion.section>
  )
}
