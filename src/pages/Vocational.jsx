import { useState } from 'react'
import { Award, Calculator, Clock, ExternalLink, GraduationCap, Hammer, Keyboard, Megaphone, PlayCircle, Scissors, Smartphone, Sun, Wrench, Zap } from 'lucide-react'
import { Badge, PageHeader, SectionHeader } from '../components/ui'
import { ListenButton, WhatsAppButton } from '../components/ui/Share'
import { SkillTestModal } from '../components/skills/SkillTest'
import { useLang, useToast } from '../context/AppContext'
import { skillPortals, vocationalTracks } from '../data/vocational'
import useMyBadges from '../hooks/useMyBadges'

const icons = { Zap, Smartphone, Sun, Calculator, Megaphone, Keyboard, Scissors }

export default function Vocational() {
  const { lang } = useLang()
  const toast = useToast()
  const [open, setOpen] = useState(vocationalTracks[0].id)
  const [hindi, setHindi] = useState(lang === 'hi')
  const [testSkill, setTestSkill] = useState(null)
  const badges = useMyBadges().map((b) => b.payload.skill)
  const track = vocationalTracks.find((t) => t.id === open)

  const spoken = (t) => (hindi ? `${t.hi}. मॉड्यूल: ${t.modules.map((m) => m[1]).join('। ')}` : `${t.name}. Modules: ${t.modules.map((m) => m[0]).join('. ')}`)

  return (
    <>
      <PageHeader icon={Wrench} kicker="Vocational Training" title="Job-ready trade skills, in your language" subtitle="Short, practical courses for ITI, diploma and school-pass learners — with Hindi lessons, a verified skill test and links to paid apprenticeships." crumbs={[{ label: 'Vocational' }]}>
        <div className="flex shrink-0 rounded-xl bg-white/10 p-1 ring-1 ring-white/20">
          {[[false, 'English'], [true, 'हिंदी']].map(([v, l]) => (
            <button key={l} onClick={() => setHindi(v)} className={`rounded-lg px-4 py-1.5 text-sm font-semibold ${hindi === v ? 'bg-white text-brand-900' : 'text-white'}`}>{l}</button>
          ))}
        </div>
      </PageHeader>
      <div className="container-x py-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {vocationalTracks.map((t) => {
            const Icon = icons[t.icon] ?? Hammer
            return (
              <button key={t.id} onClick={() => setOpen(t.id)} aria-pressed={open === t.id} className={`card flex items-center gap-3 p-4 text-left transition ${open === t.id ? 'ring-2 ring-saffron-500' : 'hover:-translate-y-0.5'}`}>
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${t.color} text-white`}><Icon className="h-6 w-6" /></span>
                <span className="min-w-0">
                  <span className="block font-bold text-slate-900 dark:text-white">{hindi ? t.hi : t.name}</span>
                  <span className="text-xs text-slate-500">{t.duration}{badges.includes(t.badge) ? ' · ✅ verified' : ''}</span>
                </span>
              </button>
            )
          })}
        </div>

        {track && (
          <section className="card mt-6 grid gap-6 p-6 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="brand"><Clock className="h-3 w-3" /> {track.duration}</Badge>
                <Badge tone="saffron"><GraduationCap className="h-3 w-3" /> {track.nsqf}</Badge>
              </div>
              <h2 className="mt-3 text-2xl font-extrabold">{hindi ? track.hi : track.name}</h2>
              <p className="text-sm text-slate-500">{hindi ? track.name : track.hi}</p>
              <ol className="mt-5 space-y-2">
                {track.modules.map(([en, hi], i) => (
                  <li key={en} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-white/5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-800 text-sm font-bold text-white">{i + 1}</span>
                    <span><span className="block text-sm font-semibold">{hindi ? hi : en}</span><span className="text-xs text-slate-500">{hindi ? en : hi}</span></span>
                  </li>
                ))}
              </ol>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href={track.video} target="_blank" rel="noreferrer" className="btn-primary py-2"><PlayCircle className="h-4 w-4" /> {hindi ? 'हिंदी वीडियो देखें' : 'Watch Hindi videos'}</a>
                <ListenButton text={spoken(track)} lang={hindi ? 'hi' : 'en'} />
                <WhatsAppButton text={`${track.name} (${track.hi}) — free course on Student Setu: ${location.origin}/vocational`} label="Share" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-100 p-4 dark:border-white/10">
                <p className="mb-2 text-sm font-bold">Jobs you can get</p>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">{track.roles.map((r) => <li key={r}>• {r}</li>)}</ul>
                <p className="mb-2 mt-4 text-sm font-bold">Tools you’ll use</p>
                <div className="flex flex-wrap gap-1.5">{track.tools.map((t) => <Badge key={t} tone="gray">{t}</Badge>)}</div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4 ring-1 ring-emerald-200 dark:from-emerald-500/10 dark:to-teal-500/10 dark:ring-emerald-400/20">
                <p className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200"><Award className="h-5 w-5" /> Verified skill test</p>
                {track.badge ? (
                  badges.includes(track.badge) ? (
                    <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">✅ You hold this verified badge. Share it from Skill Bridge → My badges.</p>
                  ) : (
                    <>
                      <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">5 questions, graded on our server. Pass 4 to earn a badge employers can verify.</p>
                      <button onClick={() => setTestSkill(track.badge)} className="btn-accent mt-3 py-2">Take the test</button>
                    </>
                  )
                ) : (
                  <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">Practical assessment with a local trainer — test coming soon.</p>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="mt-12">
          <SectionHeader icon={GraduationCap} title="Get certified & find paid apprenticeships" subtitle="Official government portals — free to register" />
          <div className="grid gap-4 md:grid-cols-3">
            {skillPortals.map((p) => (
              <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="card card-hover group p-5">
                <div className="flex items-center justify-between"><h3 className="font-bold group-hover:text-brand-700 dark:group-hover:text-brand-300">{p.name}</h3><ExternalLink className="h-4 w-4 text-slate-400" /></div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{p.text}</p>
              </a>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">NSQF levels and durations are indicative; check the exact qualification on the official portals.</p>
        </section>
      </div>
      <SkillTestModal skill={testSkill} open={Boolean(testSkill)} onClose={() => setTestSkill(null)} onPassed={() => toast('Verified badge earned!')} />
    </>
  )
}
