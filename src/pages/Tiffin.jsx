import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Clock, Heart, MapPin, Phone, SearchX, Soup, Store, Truck, UtensilsCrossed } from 'lucide-react'
import { Avatar, Badge, ChipGroup, EmptyState, Modal, PageHeader, Rating, SearchInput, Select, SmartImage, Stars, VerifiedPill } from '../components/ui'
import { useData } from '../context/DataContext'
import { useAuth, useToast } from '../context/AppContext'
import { cities, cityById, formatINR } from '../data/common'
import { foodTypeLabel } from '../data/tiffins'

export function FoodDot({ type }) {
  const color = type === 'veg' ? 'border-emerald-600 after:bg-emerald-600' : type === 'nonveg' ? 'border-rose-600 after:bg-rose-600' : 'border-amber-500 after:bg-amber-500'
  return <span className={`relative inline-block h-3.5 w-3.5 rounded-sm border-2 after:absolute after:inset-[2px] after:rounded-full ${color}`} aria-hidden />
}

function TiffinCard({ t, onOpen }) {
  const { isSaved, toggleSaved } = useData()
  const toast = useToast()
  const saved = isSaved('tiffins', t.id)
  return (
    <motion.article layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card card-hover group relative flex flex-col overflow-hidden">
      <button onClick={() => onOpen(t)} className="relative block text-left" aria-label={`Open ${t.name}`}>
        <SmartImage src={t.image} alt={t.name} fallbackLabel={t.name} icon={Soup} className="aspect-[16/9] w-full transition duration-500 group-hover:scale-[1.03]" />
        {t.verified && <VerifiedPill className="absolute bottom-2.5 left-2.5" />}
        {t.trial && <span className="absolute left-2.5 top-2.5 rounded-full bg-saffron-500 px-2 py-0.5 text-[11px] font-semibold text-white shadow">Free trial meal</span>}
      </button>
      <button onClick={() => { toggleSaved('tiffins', t.id); toast(saved ? 'Removed from saved' : 'Saved to your dashboard', saved ? 'info' : 'success') }} aria-label={saved ? 'Unsave' : 'Save'} aria-pressed={saved} className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-white shadow-md transition hover:scale-110 dark:bg-ink-900">
        <Heart className={`h-4 w-4 ${saved ? 'fill-rose-500 text-rose-500' : 'text-rose-500'}`} />
      </button>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold leading-snug">{t.name}</h3>
          <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300"><FoodDot type={t.foodType} /> {foodTypeLabel[t.foodType]}</span>
        </div>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" /> {t.area}, {cityById(t.city)?.name}</p>
        <div className="mt-2"><Rating value={t.rating} count={t.reviewsCount} /></div>
        <p className="mt-2 font-display text-xl font-extrabold text-slate-900 dark:text-white">{formatINR(t.monthly)} <span className="text-xs font-medium text-slate-500">/month · {t.mealsPerDay} meals/day</span></p>
        <p className="text-xs text-slate-500">or {formatINR(t.perMeal)} per meal</p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t.speciality}</p>
        <div className="mt-auto space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
          <p className="mt-3 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-brand-700 dark:text-brand-300" /> Lunch {t.timings.lunch} · Dinner {t.timings.dinner}</p>
          <p className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-brand-700 dark:text-brand-300" /> Delivers to {t.deliveryAreas.join(', ')}</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={() => onOpen(t)} className="btn-outline py-2">Menu & reviews</button>
          <button onClick={() => toast(`Request sent to ${t.name}! They'll call you back.`)} className="btn-accent py-2">Subscribe</button>
        </div>
      </div>
    </motion.article>
  )
}

function TiffinModal({ t, onClose }) {
  const { tiffinActions } = useData()
  const { user } = useAuth()
  const toast = useToast()
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  if (!t) return null
  return (
    <Modal open={Boolean(t)} onClose={onClose} title={t.name} wide>
      <div className="grid gap-5 md:grid-cols-[1fr_1.1fr]">
        <div>
          <SmartImage src={t.image} alt={t.name} icon={Soup} className="aspect-[4/3] w-full rounded-2xl" />
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="green"><FoodDot type={t.foodType} /> {foodTypeLabel[t.foodType]}</Badge>
            {t.verified && <Badge tone="brand">Verified provider</Badge>}
            {t.trial && <Badge tone="saffron">Trial available</Badge>}
          </div>
          <div className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm dark:bg-white/5">
            <p><b>Provider:</b> {t.provider}</p>
            <p className="mt-1"><b>Contact:</b> {t.contact}</p>
            <p className="mt-1"><b>Price:</b> {formatINR(t.monthly)}/month · {formatINR(t.perMeal)}/meal</p>
            <button onClick={() => toast('Demo listing — calls are enabled after provider verification.', 'info')} className="btn-primary mt-3 w-full py-2"><Phone className="h-4 w-4" /> Contact provider</button>
          </div>
        </div>
        <div>
          <h4 className="mb-2 font-bold">This week’s menu</h4>
          <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-100 text-sm dark:divide-white/10 dark:border-white/10">
            {Object.entries(t.menu ?? {}).map(([d, m]) => (
              <li key={d} className="flex gap-3 px-3 py-2"><span className="w-9 shrink-0 font-semibold text-brand-700 dark:text-brand-300">{d}</span><span className="text-slate-600 dark:text-slate-300">{m}</span></li>
            ))}
          </ul>
        </div>
      </div>
      <h4 className="mb-2 mt-6 font-bold">Reviews</h4>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!text.trim()) return
          tiffinActions.review(t.id, { name: user?.name ?? 'Student', rating, text: text.trim() })
          setText('')
          toast('Review posted')
          onClose()
        }}
        className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center"
      >
        <Stars value={rating} onChange={setRating} size="h-5 w-5" />
        <input value={text} onChange={(e) => setText(e.target.value)} className="input flex-1" placeholder="Taste, quantity, punctuality…" />
        <button className="btn-primary">Post</button>
      </form>
      <ul className="space-y-3">
        {(t.reviews ?? []).map((r, i) => (
          <li key={r.id ?? i} className="flex gap-3">
            <Avatar name={r.name} size="h-9 w-9 text-xs" />
            <div><p className="text-sm font-semibold">{r.name} <span className="ml-1"><Stars value={r.rating} size="h-3 w-3" /></span></p><p className="text-sm text-slate-600 dark:text-slate-300">{r.text}</p></div>
          </li>
        ))}
      </ul>
    </Modal>
  )
}

export default function Tiffin() {
  const { tiffins } = useData()
  const [params, setParams] = useSearchParams()
  const [city, setCity] = useState('all')
  const [food, setFood] = useState('all')
  const [maxPrice, setMaxPrice] = useState(5000)
  const [q, setQ] = useState('')
  const [trial, setTrial] = useState(false)
  const [sort, setSort] = useState('rating')
  const [open, setOpen] = useState(null)

  useEffect(() => {
    const focus = params.get('focus')
    if (focus) setOpen(tiffins.find((t) => t.id === focus) ?? null)
  }, [params, tiffins])

  const results = useMemo(() => {
    const s = q.toLowerCase().trim()
    return tiffins
      .filter((t) => t.status === 'approved')
      .filter((t) => city === 'all' || t.city === city)
      .filter((t) => food === 'all' || t.foodType === food || (food !== 'both' && t.foodType === 'both'))
      .filter((t) => t.monthly <= maxPrice)
      .filter((t) => !trial || t.trial)
      .filter((t) => !s || `${t.name} ${t.area} ${t.deliveryAreas.join(' ')}`.toLowerCase().includes(s))
      .sort((a, b) => (sort === 'rating' ? b.rating - a.rating : sort === 'low' ? a.monthly - b.monthly : b.monthly - a.monthly))
  }, [tiffins, city, food, maxPrice, trial, q, sort])

  return (
    <>
      <PageHeader icon={UtensilsCrossed} kicker="Tiffin & Mess Finder" title="Ghar jaisa khana, near you" subtitle="Home-style tiffin and mess services with weekly menus, monthly pricing, delivery areas and honest student reviews." crumbs={[{ label: 'Tiffin & Mess' }]}>
        <Link to="/provider" className="btn-accent shrink-0"><Store className="h-4 w-4" /> List your tiffin service</Link>
      </PageHeader>
      <div className="container-x py-8">
        <div className="card mb-6 grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-end">
          <div>
            <label className="label">Search area or name</label>
            <SearchInput value={q} onChange={setQ} placeholder="e.g. MP Nagar, Bhawarkuan" />
          </div>
          <div>
            <label className="label">City</label>
            <Select value={city} onChange={setCity} options={[{ value: 'all', label: 'All cities' }, ...cities.map((c) => ({ value: c.id, label: c.name }))]} />
          </div>
          <div>
            <label className="label">Max monthly price: <b>{formatINR(maxPrice)}</b></label>
            <input type="range" min={2000} max={5000} step={100} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-brand-700" />
          </div>
          <label className="flex items-center gap-2 pb-2.5 text-sm"><input type="checkbox" className="checkbox" checked={trial} onChange={(e) => setTrial(e.target.checked)} /> Free trial</label>
        </div>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <ChipGroup value={food} onChange={setFood} options={[{ value: 'all', label: 'All food' }, { value: 'veg', label: '🟢 Pure Veg' }, { value: 'nonveg', label: '🔴 Non-Veg' }, { value: 'both', label: 'Veg & Non-Veg' }]} />
          <Select value={sort} onChange={setSort} aria-label="Sort" className="w-auto py-2" options={[{ value: 'rating', label: 'Sort: Top rated' }, { value: 'low', label: 'Price: Low to High' }, { value: 'high', label: 'Price: High to Low' }]} />
        </div>
        {results.length === 0 ? (
          <EmptyState icon={SearchX} title="No tiffin services match" text="Try another city or increase your budget." />
        ) : (
          <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">{results.map((t) => <TiffinCard key={t.id} t={t} onOpen={setOpen} />)}</AnimatePresence>
          </motion.div>
        )}
      </div>
      <TiffinModal t={open ? tiffins.find((x) => x.id === open.id) : null} onClose={() => { setOpen(null); if (params.get('focus')) setParams({}, { replace: true }) }} />
    </>
  )
}
