import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Binary, Brain, Calculator, Check, Cloud, Code2, ExternalLink, MessageCircle, Network, Palette, PlayCircle, Sparkles, Star, Users } from 'lucide-react'

const Icons = { Binary, Brain, Calculator, Cloud, Code2, MessageCircle, Network, Palette }
import { Badge, PageHeader, PremiumBadge, SectionHeader } from '../components/ui'
import { useToast } from '../context/AppContext'
import { premiumCourses, pricingPlans, skillCategories } from '../data/skills'

export default function Skills() {
  const [params, setParams] = useSearchParams()
  const toast = useToast()
  const [active, setActive] = useState(params.get('cat') ?? skillCategories[0].id)
  const cat = skillCategories.find((c) => c.id === active) ?? skillCategories[0]
  const pick = (id) => { setActive(id); setParams({ cat: id }, { replace: true }) }

  return (
    <>
      <PageHeader icon={PlayCircle} kicker="Skills & Video Learning" title="Learn skills that get you hired" subtitle="Step-by-step roadmaps, hand-picked free courses and the best educational videos — plus premium live programs." crumbs={[{ label: 'Skills' }]} />
      <div className="container-x py-8">
        <div className="no-scrollbar -mx-4 mb-6 flex gap-3 overflow-x-auto px-4 pb-2">
          {skillCategories.map((c) => {
            const Icon = Icons[c.icon] ?? Sparkles
            return (
              <button key={c.id} onClick={() => pick(c.id)} className={`flex min-w-[160px] shrink-0 items-center gap-3 rounded-2xl border p-3 text-left transition ${active === c.id ? 'border-brand-800 bg-brand-800 text-white shadow-lift dark:border-brand-500 dark:bg-brand-600' : 'border-slate-200 bg-white hover:border-brand-300 dark:border-white/10 dark:bg-ink-900'}`}>
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${c.color} text-white`}><Icon className="h-5 w-5" /></span>
                <span><span className="block text-sm font-bold">{c.name}</span><span className={`text-xs ${active === c.id ? 'text-brand-200' : 'text-slate-500'}`}>{(c.learners / 1000).toFixed(1)}k learners</span></span>
              </button>
            )
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="card p-5 sm:p-6">
            <h2 className="text-xl font-bold">{cat.name} roadmap</h2>
            <p className="mt-1 text-sm text-slate-500">{cat.blurb}</p>
            <ol className="relative mt-5 space-y-4 border-l-2 border-dashed border-brand-200 pl-6 dark:border-white/10">
              {cat.roadmap.map((step, i) => (
                <li key={step} className="relative">
                  <span className="absolute -left-[37px] grid h-7 w-7 place-items-center rounded-full bg-brand-800 text-xs font-bold text-white ring-4 ring-white dark:bg-brand-600 dark:ring-ink-900">{i + 1}</span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{step}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="space-y-6">
            <div className="card p-5 sm:p-6">
              <h3 className="mb-3 text-lg font-bold">Free courses</h3>
              <ul className="space-y-2">
                {cat.courses.map((c) => (
                  <li key={c.title} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-white/5">
                    <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{c.title}</p><p className="text-xs text-slate-500">{c.provider} · {c.level}</p></div>
                    <Badge tone="green">Free</Badge>
                    {c.internal ? <Link to={c.url} className="btn-outline py-1.5 text-xs">Start</Link> : <a href={c.url} target="_blank" rel="noreferrer" className="btn-outline py-1.5 text-xs">Open <ExternalLink className="h-3 w-3" /></a>}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-5 sm:p-6">
              <h3 className="mb-3 text-lg font-bold">Recommended videos</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {cat.videos.map((v) => (
                  <a key={v.title} href={v.url} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-xl border border-slate-100 dark:border-white/10">
                    <div className={`relative grid aspect-video place-items-center bg-gradient-to-br ${cat.color}`}>
                      <PlayCircle className="h-12 w-12 text-white/90 transition group-hover:scale-110" />
                      <span className="absolute bottom-2 right-2 rounded bg-black/60 px-1.5 text-[10px] font-semibold text-white">{v.duration}</span>
                    </div>
                    <div className="p-3"><p className="line-clamp-2 text-sm font-semibold">{v.title}</p><p className="text-xs text-slate-500">{v.channel} · YouTube</p></div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="mt-14">
          <SectionHeader icon={Sparkles} title="Premium programs" subtitle="Live mentorship-led programs. Academic resources stay free forever." />
          <div className="grid gap-5 md:grid-cols-3">
            {premiumCourses.map((p) => (
              <div key={p.id} className="card card-hover relative overflow-hidden p-5">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-amber-100 to-saffron-100 dark:from-amber-500/10 dark:to-saffron-500/10" />
                <PremiumBadge />
                <h3 className="relative mt-3 text-lg font-bold">{p.title}</h3>
                <p className="text-sm text-slate-500">{p.mentor} · {p.weeks} weeks</p>
                <div className="mt-3 flex flex-wrap gap-1.5">{p.tags.map((t) => <Badge key={t} tone="gray">{t}</Badge>)}</div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-saffron-400 text-saffron-400" /> {p.rating}</span>
                  <span className="flex items-center gap-1 text-slate-500"><Users className="h-4 w-4" /> {p.seats} seats/batch</span>
                </div>
                <button onClick={() => toast("You're on the waitlist! We'll notify you when enrolment opens.")} className="btn-accent mt-4 w-full">Join waitlist</button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14" id="pricing">
          <SectionHeader center title="Simple, student-friendly pricing" subtitle="Pricing for premium content will be announced soon." />
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
            {pricingPlans.map((p) => (
              <div key={p.id} className={`card relative p-6 ${p.highlight ? 'ring-2 ring-saffron-500 md:-translate-y-2' : ''}`}>
                {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-saffron-500 px-3 py-0.5 text-xs font-bold text-white">Coming soon</span>}
                <h3 className="text-lg font-bold">{p.name}</h3>
                <p className="mt-2 font-display text-4xl font-extrabold text-slate-900 dark:text-white">{p.price}</p>
                <p className="text-sm text-slate-500">{p.period}</p>
                <ul className="mt-5 space-y-2 text-sm">{p.features.map((f) => <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {f}</li>)}</ul>
                <button onClick={() => toast(p.id === 'free' ? 'You already have everything in Free!' : 'Thanks! We’ll reach out when this plan launches.', 'info')} className={`mt-6 w-full ${p.highlight ? 'btn-accent' : 'btn-outline'}`}>{p.id === 'free' ? 'Current plan' : p.id === 'campus' ? 'Contact us' : 'Notify me'}</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
