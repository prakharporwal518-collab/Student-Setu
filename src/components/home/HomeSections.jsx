import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, Building2, FileText, Home, MapPin, Quote, Search, Users, UserRoundSearch, Handshake } from 'lucide-react'
import { Avatar, LinkArrow, Reveal, Stars } from '../ui'
import { CityArt, HeroArt } from '../ui/Illustrations'
import { useLang } from '../../context/AppContext'
import { modules } from '../../data/modules'
import { cities } from '../../data/common'
import { testimonials } from '../../data/community'
import useCountUp from '../../hooks/useCountUp'

/* ------------------------------------------------------------------ Hero */
const popular = [
  { label: 'Hostel in Delhi', to: '/hostels?city=delhi' },
  { label: 'B.Tech Notes', to: '/resources?course=btech' },
  { label: 'Internships', to: '/careers' },
  { label: 'Scholarships', to: '/scholarships' },
]

export function Hero() {
  const { t } = useLang()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const submit = (e) => {
    e.preventDefault()
    navigate(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : '/search')
  }
  return (
    <section className="relative isolate overflow-hidden bg-brand-950">
      <HeroArt className="absolute inset-0 -z-20 h-full w-full" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-950 via-brand-950/85 to-brand-950/0 sm:via-brand-950/70" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-brand-950/60 to-transparent" />

      <motion.div initial={{ opacity: 0, rotate: -8, y: -10 }} animate={{ opacity: 1, rotate: -8, y: 0 }} transition={{ delay: 0.6 }} className="pointer-events-none absolute right-6 top-8 hidden text-right font-hand text-3xl font-bold leading-[1.05] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.35)] md:block lg:right-16 lg:text-4xl">
        <p>{t('hero.hand1')}</p>
        <p>{t('hero.hand2')}</p>
        <p className="relative inline-block">
          {t('hero.hand3')}
          <svg viewBox="0 0 160 14" className="absolute -bottom-3 left-0 w-full" aria-hidden>
            <path d="M2 10 Q60 0 158 6" fill="none" stroke="#fb923c" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </p>
      </motion.div>

      <div className="container-x relative py-14 sm:py-20 lg:py-24">
        <div className="max-w-xl">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-200 sm:text-xs">
            {t('hero.kicker')}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mt-3 font-display text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
            Student <span className="text-saffron-400">Setu</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="mt-2 text-xl font-semibold text-white sm:text-2xl">
            {t('tagline')}
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4 max-w-lg text-sm leading-relaxed text-slate-200 sm:text-base">
            {t('hero.subtitle')}
          </motion.p>

          <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }} onSubmit={submit} className="mt-6 flex items-center rounded-2xl bg-white p-1.5 shadow-lift ring-4 ring-saffron-400/60 transition focus-within:ring-saffron-400 dark:bg-ink-900" role="search">
            <MapPin className="ml-3 h-5 w-5 shrink-0 text-brand-800 dark:text-brand-300" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('hero.search')} aria-label={t('hero.search')} className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-white sm:text-base" />
            <button className="grid h-11 w-12 shrink-0 place-items-center rounded-xl bg-saffron-500 text-white transition hover:bg-saffron-600" aria-label={t('common.search')}>
              <Search className="h-5 w-5" />
            </button>
          </motion.form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.34 }} className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-200">{t('hero.popular')}</span>
            {popular.map((p) => (
              <Link key={p.label} to={p.to} className="rounded-full border border-white/40 bg-white/5 px-3 py-1 text-xs text-white backdrop-blur transition hover:border-saffron-400 hover:bg-saffron-500/20">
                {p.label}
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- Module cards */
export function ModuleCards() {
  const { t } = useLang()
  const primary = modules.slice(0, 8)
  const extra = modules.slice(8)
  return (
    <section className="container-x pt-8 sm:pt-10">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-8">
        {primary.map((m, i) => (
          <Reveal key={m.id} delay={i * 0.04}>
            <Link to={m.to} className="card card-hover group flex h-full flex-col items-center px-3 py-5 text-center">
              <span className={`grid h-14 w-14 place-items-center rounded-full ${m.tint} transition group-hover:scale-110`}>
                <m.icon className="h-7 w-7" strokeWidth={2.2} />
              </span>
              <span className="mt-3 text-sm font-bold text-slate-900 dark:text-white">{t(m.key)}</span>
              <span className="mt-1 text-xs leading-snug text-slate-500 dark:text-slate-400">{t(m.key + '.d')}</span>
            </Link>
          </Reveal>
        ))}
      </div>
      <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-3 sm:gap-4">
        {extra.map((m) => (
          <Link key={m.id} to={m.to} className="card card-hover group flex items-center gap-3 px-4 py-3">
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${m.tint}`}>
              <m.icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-slate-900 dark:text-white">{t(m.key)}</span>
              <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{t(m.key + '.d')}</span>
            </span>
            <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-saffron-500" />
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- Stats */
function Stat({ icon: Icon, end, label }) {
  const [ref, value] = useCountUp(end)
  return (
    <div ref={ref} className="flex items-center gap-4">
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-brand-800 shadow-soft dark:bg-white/10 dark:text-brand-200">
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <p className="font-display text-2xl font-extrabold text-brand-950 dark:text-white sm:text-3xl">{value.toLocaleString('en-IN')}+</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
      </div>
    </div>
  )
}

export function Stats() {
  const { t } = useLang()
  return (
    <section className="container-x pt-8 sm:pt-10">
      <div className="grid grid-cols-1 gap-6 rounded-3xl bg-brand-50 px-6 py-7 ring-1 ring-brand-100 dark:bg-white/5 dark:ring-white/10 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <Stat icon={Users} end={50000} label={t('stats.students')} />
        <Stat icon={Building2} end={5000} label={t('stats.hostels')} />
        <Stat icon={Home} end={1200} label={t('stats.colleges')} />
        <Stat icon={FileText} end={10000} label={t('stats.resources')} />
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- How it works */
export function HowItWorks() {
  const { t } = useLang()
  const steps = [
    { icon: UserRoundSearch, title: t('how.1'), text: t('how.1d') },
    { icon: Handshake, title: t('how.2'), text: t('how.2d') },
    { icon: BadgeCheck, title: t('how.3'), text: t('how.3d') },
  ]
  return (
    <section className="container-x section text-center">
      <h2 className="text-2xl font-extrabold sm:text-3xl">{t('how.title')}</h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('how.subtitle')}</p>
      <div className="mx-auto mt-8 grid max-w-5xl gap-8 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
        {steps.map((s, i) => (
          <div key={s.title} className="contents">
            <Reveal delay={i * 0.12} className="flex items-center gap-4 text-left md:justify-center">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-800 ring-8 ring-brand-50/50 dark:bg-white/10 dark:text-brand-200 dark:ring-white/5">
                <s.icon className="h-7 w-7" strokeWidth={2.4} />
              </span>
              <div>
                <p className="font-display text-lg font-bold text-brand-950 dark:text-white">
                  {i + 1}. {s.title}
                </p>
                <p className="max-w-[220px] text-sm text-slate-500 dark:text-slate-400">{s.text}</p>
              </div>
            </Reveal>
            {i < 2 && (
              <svg viewBox="0 0 60 12" className="mx-auto hidden w-14 text-brand-300 md:block" aria-hidden>
                <path d="M0 6h54M48 1l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- Testimonials */
export function Testimonials() {
  const { t } = useLang()
  const [all, setAll] = useState(false)
  const list = all ? testimonials : testimonials.slice(0, 3)
  return (
    <section className="container-x pt-12 sm:pt-16">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-extrabold sm:text-3xl">
          <Quote className="h-7 w-7 fill-brand-800 text-brand-800 dark:fill-brand-400 dark:text-brand-400" /> {t('testi.title')}
        </h2>
        <button onClick={() => setAll((a) => !a)} className="group inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-saffron-600 dark:text-brand-300">
          {all ? 'Show less' : t('common.viewMore')} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </button>
      </div>
      <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
        {list.map((r, i) => (
          <Reveal key={r.name} delay={i * 0.06} className="w-[85%] shrink-0 snap-start md:w-auto">
            <figure className="card card-hover flex h-full gap-4 p-5">
              <Avatar name={r.name} size="h-14 w-14 text-lg" />
              <div>
                <figcaption>
                  <p className="font-bold text-slate-900 dark:text-white">{r.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{r.meta}</p>
                </figcaption>
                <div className="mt-1">
                  <Stars value={r.rating} />
                </div>
                <blockquote className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">“{r.text}”</blockquote>
              </div>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* -------------------------------------------------------- Featured cities */
export function FeaturedCities() {
  const { t } = useLang()
  return (
    <section className="container-x section">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div className="flex items-start gap-2">
          <MapPin className="mt-1 h-7 w-7 shrink-0 fill-brand-100 text-brand-800 dark:fill-transparent dark:text-brand-400" />
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">{t('cities.title')}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('cities.subtitle')}</p>
          </div>
        </div>
        <LinkArrow to="/connect">{t('common.viewAllCities')}</LinkArrow>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {cities.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.05}>
            <Link to={`/connect?city=${c.id}`} className="card card-hover group block overflow-hidden">
              <div className="overflow-hidden">
                <CityArt palette={c.palette} landmark={c.landmark} seed={i + 3} className="aspect-[16/9] w-full transition duration-500 group-hover:scale-105" />
              </div>
              <div className="px-3 py-2.5">
                <p className="font-bold text-slate-900 dark:text-white">{c.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {c.students.toLocaleString('en-IN')}+ {t('common.students')}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
