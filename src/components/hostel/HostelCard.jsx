import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, MapPin, Map, Wifi, Utensils, UtensilsCrossed, WashingMachine, ShieldCheck, AirVent, Zap, Droplets, BookOpen, Dumbbell, Camera, Car, BedDouble } from 'lucide-react'
import { Rating, SmartImage, VerifiedPill } from '../ui'
import { useData } from '../../context/DataContext'
import { useLang, useToast } from '../../context/AppContext'
import { colleges } from '../../data/colleges'
import { facilityList, typeLabel } from '../../data/hostels'
import { formatINR } from '../../data/common'

export const facilityIcons = {
  wifi: Wifi, meals: Utensils, mess: UtensilsCrossed, laundry: WashingMachine, security: ShieldCheck, ac: AirVent,
  power: Zap, water: Droplets, study: BookOpen, gym: Dumbbell, cctv: Camera, parking: Car,
}
export const facilityName = (id) => facilityList.find((f) => f.id === id)?.label ?? id
export const mapsUrl = (lat, lng) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

const genderLabel = { boys: 'Boys', girls: 'Girls', coed: 'Co-ed' }

export default function HostelCard({ hostel: h, index = 0 }) {
  const { t } = useLang()
  const { isSaved, toggleSaved } = useData()
  const toast = useToast()
  const saved = isSaved('hostels', h.id)
  const college = colleges.find((c) => c.id === h.college)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      className="card card-hover group relative flex flex-col overflow-hidden"
    >
      <Link to={`/hostels/${h.id}`} className="relative block" aria-label={`View ${h.name}`}>
        <SmartImage src={h.images?.[0]} alt={h.name} fallbackLabel={h.name} icon={BedDouble} className="aspect-[16/9] w-full transition duration-500 group-hover:scale-[1.03]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
        {h.verified && <VerifiedPill className="absolute bottom-2.5 left-2.5" />}
        <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur dark:bg-ink-900/80 dark:text-slate-200">{genderLabel[h.gender]}</span>
      </Link>
      <button
        onClick={() => {
          toggleSaved('hostels', h.id)
          toast(saved ? 'Removed from saved stays' : 'Saved to your dashboard', saved ? 'info' : 'success')
        }}
        aria-label={saved ? 'Remove from saved' : 'Save hostel'}
        aria-pressed={saved}
        className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-white shadow-md transition hover:scale-110 dark:bg-ink-900"
      >
        <Heart className={`h-4 w-4 transition ${saved ? 'fill-rose-500 text-rose-500' : 'text-rose-500'}`} />
      </button>

      <div className="flex flex-1 flex-col p-4">
        <Link to={`/hostels/${h.id}`}>
          <h3 className="text-base font-bold leading-snug transition group-hover:text-brand-700 dark:group-hover:text-brand-300">{h.name}</h3>
        </Link>
        <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
          {typeLabel[h.type]} <span className="mx-1">•</span> {h.tagline || college?.short || h.area}
        </p>
        <div className="mt-2">
          <Rating value={h.rating} count={h.reviewsCount} />
        </div>
        <p className="mt-2 font-display text-xl font-extrabold text-slate-900 dark:text-white">
          {formatINR(h.rent)} <span className="text-xs font-medium text-slate-500">{t('common.month')}</span>
        </p>
        <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300">
          {h.facilities.slice(0, 4).map((f) => {
            const Icon = facilityIcons[f] ?? Wifi
            return (
              <li key={f} className="flex items-center gap-1">
                <Icon className="h-3.5 w-3.5 text-brand-700 dark:text-brand-300" /> {facilityName(f)}
              </li>
            )
          })}
        </ul>
        <div className="mt-auto">
          <p className="mt-3 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-700 dark:border-white/10 dark:text-slate-200">
            {t('common.seats')}: <span className={h.seats <= 5 ? 'text-rose-600' : 'text-emerald-600'}>{h.seats}</span>
          </p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <MapPin className="h-3.5 w-3.5" /> {h.distanceKm} km {t('common.fromCollege')}
            </span>
            <a href={mapsUrl(h.lat, h.lng)} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-semibold text-brand-700 hover:text-saffron-600 dark:text-brand-300">
              <Map className="h-3.5 w-3.5" /> {t('common.viewMap')}
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
