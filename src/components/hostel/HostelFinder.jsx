import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Home as HomeIcon, ListFilter, PiggyBank, SlidersHorizontal, X, SearchX } from 'lucide-react'
import HostelCard from './HostelCard'
import { ChipGroup, EmptyState, SearchInput, Select } from '../ui'
import { useData } from '../../context/DataContext'
import { useLang, useToast } from '../../context/AppContext'
import { cities, formatINR } from '../../data/common'
import { colleges } from '../../data/colleges'
import { hostelTypes, privateCollegeHostelFee } from '../../data/hostels'

const BUDGET_MIN = 500
const BUDGET_MAX = 15000
const defaults = (city = 'bhopal') => ({
  city, college: '', budget: [BUDGET_MIN, BUDGET_MAX], gender: ['boys', 'girls', 'coed'], room: ['single', 'double', 'triple'],
  ac: false, food: false, distance: 'any', q: '',
})

function BudgetSlider({ value, onChange }) {
  const [lo, hi] = value
  const pct = (v) => ((v - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100
  return (
    <div>
      <div className="range-dual">
        <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-slate-200 dark:bg-white/10" />
        <div className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand-800 dark:bg-brand-400" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
        <input type="range" min={BUDGET_MIN} max={BUDGET_MAX} step={500} value={lo} aria-label="Minimum budget" onChange={(e) => onChange([Math.min(+e.target.value, hi - 500), hi])} />
        <input type="range" min={BUDGET_MIN} max={BUDGET_MAX} step={500} value={hi} aria-label="Maximum budget" onChange={(e) => onChange([lo, Math.max(+e.target.value, lo + 500)])} />
      </div>
      <p className="mt-2 text-right text-sm font-medium text-slate-600 dark:text-slate-300">
        {formatINR(lo)} – {formatINR(hi)}
        {hi === BUDGET_MAX && '+'}
      </p>
    </div>
  )
}

function CheckGroup({ options, value, onChange }) {
  const toggle = (v) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {options.map((o) => (
        <label key={o.value} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" className="checkbox" checked={value.includes(o.value)} onChange={() => toggle(o.value)} /> {o.label}
        </label>
      ))}
    </div>
  )
}

function Filters({ f, set, reset, onApply }) {
  const { t } = useLang()
  const cityColleges = colleges.filter((c) => c.city === f.city)
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-bold">
          <ListFilter className="h-5 w-5" /> {t('common.filters')}
        </h3>
        <button onClick={reset} className="text-sm font-medium text-brand-700 hover:text-saffron-600 dark:text-brand-300">
          {t('common.clearAll')}
        </button>
      </div>
      <div>
        <label className="label">{t('f.city')}</label>
        <Select value={f.city} onChange={(v) => set({ city: v, college: '' })} options={[{ value: 'all', label: 'All cities' }, ...cities.map((c) => ({ value: c.id, label: c.name }))]} />
      </div>
      <div>
        <label className="label">{t('f.college')}</label>
        <Select value={f.college} onChange={(v) => set({ college: v })} disabled={f.city === 'all'} options={[{ value: '', label: 'Any college' }, ...cityColleges.map((c) => ({ value: c.id, label: c.short }))]} />
      </div>
      <div>
        <label className="label">{t('f.budget')}</label>
        <BudgetSlider value={f.budget} onChange={(budget) => set({ budget })} />
      </div>
      <div>
        <label className="label">{t('f.gender')}</label>
        <CheckGroup value={f.gender} onChange={(gender) => set({ gender })} options={[{ value: 'boys', label: t('f.boys') }, { value: 'girls', label: t('f.girls') }, { value: 'coed', label: t('f.coed') }]} />
      </div>
      <div>
        <label className="label">{t('f.room')}</label>
        <CheckGroup value={f.room} onChange={(room) => set({ room })} options={[{ value: 'single', label: t('f.single') }, { value: 'double', label: t('f.double') }, { value: 'triple', label: t('f.triple') }]} />
      </div>
      <div className="space-y-2.5">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" className="checkbox" checked={f.ac} onChange={(e) => set({ ac: e.target.checked })} /> {t('f.ac')}
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" className="checkbox" checked={f.food} onChange={(e) => set({ food: e.target.checked })} /> {t('f.food')}
        </label>
      </div>
      <div>
        <label className="label">{t('f.distance')}</label>
        <Select value={f.distance} onChange={(distance) => set({ distance })} options={[{ value: 'any', label: t('f.any') }, { value: '1', label: 'Within 1 km' }, { value: '3', label: 'Within 3 km' }, { value: '5', label: 'Within 5 km' }, { value: '10', label: 'Within 10 km' }]} />
      </div>
      <button onClick={onApply} className="btn-primary w-full">
        {t('common.apply')}
      </button>
    </div>
  )
}

const sorters = {
  recommended: () => 0,
  rating: (a, b) => b.rating - a.rating,
  priceLow: (a, b) => a.rent - b.rent,
  priceHigh: (a, b) => b.rent - a.rent,
  distance: (a, b) => a.distanceKm - b.distanceKm,
}

/**
 * The full hostel search experience. `limit` renders a compact version (home page).
 */
export default function HostelFinder({ limit, syncUrl = false }) {
  const { t } = useLang()
  const toast = useToast()
  const { hostels } = useData()
  const [params, setParams] = useSearchParams()
  const [f, setF] = useState(() => {
    const d = defaults(params.get('city') || 'bhopal')
    if (syncUrl && params.get('college')) d.college = params.get('college')
    if (syncUrl && params.get('q')) d.q = params.get('q')
    return d
  })
  const [type, setType] = useState(syncUrl ? params.get('type') || 'all' : 'all')
  const [sort, setSort] = useState('recommended')
  const [drawer, setDrawer] = useState(false)
  const set = (patch) => setF((cur) => ({ ...cur, ...patch }))

  useEffect(() => {
    if (!syncUrl) return
    const next = {}
    if (f.city !== 'bhopal') next.city = f.city
    if (f.college) next.college = f.college
    if (type !== 'all') next.type = type
    if (f.q) next.q = f.q
    setParams(next, { replace: true })
  }, [f.city, f.college, f.q, type, syncUrl, setParams])

  const results = useMemo(() => {
    const q = f.q.trim().toLowerCase()
    return hostels
      .filter((h) => h.status === 'approved')
      .filter((h) => f.city === 'all' || h.city === f.city)
      .filter((h) => !f.college || h.college === f.college || h.type === 'government')
      .filter((h) => type === 'all' || h.type === type)
      .filter((h) => h.rent >= f.budget[0] && (f.budget[1] === BUDGET_MAX || h.rent <= f.budget[1]))
      .filter((h) => f.gender.includes(h.gender))
      .filter((h) => h.roomTypes.some((r) => f.room.includes(r)))
      .filter((h) => !f.ac || h.ac)
      .filter((h) => !f.food || h.food)
      .filter((h) => f.distance === 'any' || h.distanceKm <= +f.distance)
      .filter((h) => !q || `${h.name} ${h.area} ${h.tagline}`.toLowerCase().includes(q))
      .sort(sorters[sort])
  }, [hostels, f, type, sort])

  const shown = limit ? results.slice(0, limit) : results
  const cheapest = results.reduce((m, h) => (m === null || h.rent < m ? h.rent : m), null)

  const apply = () => {
    setDrawer(false)
    toast(`Showing ${results.length} stay${results.length === 1 ? '' : 's'}`, 'info')
    document.getElementById('hostel-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const reset = () => {
    setF(defaults(f.city))
    setType('all')
    setSort('recommended')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      {/* Desktop filters */}
      <aside className="card hidden h-fit p-5 lg:sticky lg:top-24 lg:block">
        <Filters f={f} set={set} reset={reset} onApply={apply} />
      </aside>

      <div id="hostel-results" className="min-w-0 scroll-mt-24">
        <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0 flex-1">
            <ChipGroup value={type} onChange={setType} options={hostelTypes.map((x) => ({ value: x.id, label: x.label }))} />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button onClick={() => setDrawer(true)} className="btn-outline flex-1 py-2 lg:hidden">
              <SlidersHorizontal className="h-4 w-4" /> {t('common.filters')}
            </button>
            <Select
              value={sort}
              onChange={setSort}
              aria-label="Sort by"
              className="w-auto min-w-[150px] flex-1 py-2"
              options={[
                { value: 'recommended', label: 'Recommended' },
                { value: 'rating', label: 'Top rated' },
                { value: 'priceLow', label: 'Price: Low to High' },
                { value: 'priceHigh', label: 'Price: High to Low' },
                { value: 'distance', label: 'Distance' },
              ]}
            />
          </div>
        </div>

        {!limit && (
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput value={f.q} onChange={(q) => set({ q })} placeholder="Search by name or area (e.g. Lalghati, MP Nagar)" className="flex-1" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-white">{results.length}</span> stays found
            </p>
          </div>
        )}

        {!limit && cheapest !== null && cheapest < privateCollegeHostelFee && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-400/20">
            <PiggyBank className="h-5 w-5 shrink-0" />
            <span>
              Stays from <b>{formatINR(cheapest)}/month</b> — save up to <b>{formatINR((privateCollegeHostelFee - cheapest) * 12)}</b> a year vs. an average private-college hostel ({formatINR(privateCollegeHostelFee)}/month).
            </span>
          </div>
        )}

        {shown.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title={t('common.noResults')}
            text="Try widening your budget, choosing another college or clearing filters."
            action={
              <button onClick={reset} className="btn-primary">
                {t('common.clearAll')}
              </button>
            }
          />
        ) : (
          <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shown.map((h, i) => (
                <HostelCard key={h.id} hostel={h} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {limit && results.length > limit && (
          <div className="mt-6 text-center">
            <Link to={`/hostels?city=${f.city}`} className="btn-outline">
              View all {results.length} stays <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {drawer && (
          <motion.div className="fixed inset-0 z-[85] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-slate-950/50" onClick={() => setDrawer(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-white p-5 dark:bg-ink-900">
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200 dark:bg-white/20" />
              <button onClick={() => setDrawer(false)} className="absolute right-4 top-4 rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-white/10" aria-label="Close filters">
                <X className="h-5 w-5" />
              </button>
              <Filters f={f} set={set} reset={reset} onApply={apply} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function HostelFinderHeader() {
  const { t } = useLang()
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-3">
        <HomeIcon className="h-10 w-10 shrink-0 fill-brand-800 text-brand-800 dark:fill-brand-400 dark:text-brand-400" />
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{t('hostel.title')}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('hostel.subtitle')}</p>
        </div>
      </div>
      <Link to="/owner" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-saffron-600 dark:text-brand-300">
        {t('hostel.ownerPortal')} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </Link>
    </div>
  )
}
