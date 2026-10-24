import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeCheck, ChevronRight, ImageOff, Search, Star, X } from 'lucide-react'

/* ---------------------------------------------------------------- Logo */
export function Logo({ light = false, compact = false }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="Student Setu home">
      <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-brand-800 shadow-soft transition group-hover:rotate-[-6deg] dark:bg-brand-600">
        <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden>
          <path d="M32 12 6 24l26 12 22-10.2V40h4V24L32 12Z" fill="#fff" />
          <path d="M17 32v9c0 4.4 6.7 8 15 8s15-3.6 15-8v-9l-15 6.8L17 32Z" fill="#f97316" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className={`block whitespace-nowrap font-display text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-brand-900 dark:text-white'}`}>
          Student <span className="text-saffron-500">Setu</span>
        </span>
        {!compact && <span className={`block whitespace-nowrap text-[11px] font-medium ${light ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>Bridging Students, Building Futures</span>}
      </span>
    </Link>
  )
}

/* ---------------------------------------------------------- SmartImage */
/**
 * Image with graceful fallbacks: tries `src`, then each of `srcs`, then shows `fallback`
 * (or a branded placeholder) — so a missing photo never looks broken.
 */
export function SmartImage({ src, srcs, alt, className = '', fallbackLabel, icon: Icon = ImageOff, fallback, imgClassName = '' }) {
  const list = [src, ...(srcs ?? [])].filter(Boolean)
  const key = list.join('|')
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    setIndex(0)
    setLoaded(false)
  }, [key])
  const current = list[index]
  if (!current) {
    if (fallback) return <div className={`relative overflow-hidden ${className}`}>{fallback}</div>
    return (
      <div className={`grid place-items-center bg-gradient-to-br from-brand-100 via-brand-50 to-saffron-100 text-brand-700 dark:from-brand-900 dark:via-ink-900 dark:to-saffron-700/30 dark:text-brand-200 ${className}`} role="img" aria-label={alt}>
        <div className="flex flex-col items-center gap-1 p-2 text-center">
          <Icon className="h-8 w-8 opacity-70" />
          {fallbackLabel && <span className="line-clamp-1 text-xs font-semibold opacity-80">{fallbackLabel}</span>}
        </div>
      </div>
    )
  }
  return (
    <div className={`relative overflow-hidden bg-slate-200 dark:bg-white/5 ${className}`}>
      {!loaded && (fallback ? <div className="absolute inset-0">{fallback}</div> : <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-white/5 dark:via-white/10 dark:to-white/5" />)}
      <img
        key={current}
        src={current}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setLoaded(false)
          setIndex((i) => i + 1)
        }}
        className={`relative h-full w-full object-cover transition duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
      />
    </div>
  )
}

/* -------------------------------------------------------------- Badges */
const badgeTones = {
  brand: 'bg-brand-50 text-brand-800 ring-brand-200 dark:bg-brand-500/15 dark:text-brand-200 dark:ring-brand-400/30',
  saffron: 'bg-saffron-50 text-saffron-700 ring-saffron-200 dark:bg-saffron-500/15 dark:text-saffron-300 dark:ring-saffron-400/30',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/30',
  red: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-400/30',
  gray: 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10',
  purple: 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:ring-violet-400/30',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/30',
}
export function Badge({ tone = 'brand', children, className = '' }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${badgeTones[tone]} ${className}`}>{children}</span>
}

export function VerifiedPill({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-semibold text-white shadow ${className}`}>
      <BadgeCheck className="h-3.5 w-3.5" /> Verified
    </span>
  )
}

export function VerifiedTick({ className = 'h-4 w-4' }) {
  return <BadgeCheck className={`${className} shrink-0 text-sky-500`} aria-label="Verified" />
}

export function PremiumBadge() {
  return <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-saffron-500 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white shadow">★ Premium</span>
}

/* -------------------------------------------------------------- Rating */
export function Rating({ value, count, size = 'sm' }) {
  return (
    <span className={`inline-flex items-center gap-1 ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
      <Star className="h-4 w-4 fill-saffron-400 text-saffron-400" />
      <span className="font-semibold text-slate-800 dark:text-slate-100">{value ? value.toFixed(1) : 'New'}</span>
      {count !== undefined && <span className="text-xs text-slate-500 dark:text-slate-400">({count} reviews)</span>}
    </span>
  )
}

export function Stars({ value = 5, onChange, size = 'h-4 w-4' }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const star = <Star className={`${size} ${n <= value ? 'fill-saffron-400 text-saffron-400' : 'text-slate-300 dark:text-slate-600'}`} />
        return onChange ? (
          <button type="button" key={n} onClick={() => onChange(n)} aria-label={`${n} star`} className="transition hover:scale-110">
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        )
      })}
    </span>
  )
}

/* -------------------------------------------------------------- Avatar */
const avatarColors = ['from-brand-500 to-indigo-700', 'from-saffron-400 to-rose-500', 'from-emerald-400 to-teal-600', 'from-violet-500 to-fuchsia-600', 'from-sky-400 to-blue-600', 'from-amber-400 to-orange-600']
export function Avatar({ name = '?', size = 'h-12 w-12', className = '', src }) {
  const [failed, setFailed] = useState(false)
  const initials = name.replace(/^(Dr\.|Mr\.|Mrs\.)\s*/i, '').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
  const color = avatarColors[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % avatarColors.length]
  return (
    <span className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br ${color} font-display font-bold text-white ring-2 ring-white dark:ring-ink-900 ${size} ${className}`} aria-hidden>
      <span className="text-[0.9em]">{initials}</span>
      {src && !failed && <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} className="absolute inset-0 h-full w-full object-cover" />}
    </span>
  )
}

/* ------------------------------------------------------ Section header */
export function SectionHeader({ icon: Icon, title, subtitle, action, center = false }) {
  return (
    <div className={`mb-6 flex flex-col gap-3 sm:mb-8 ${center ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between'}`}>
      <div className={`flex items-start gap-3 ${center ? 'flex-col items-center' : ''}`}>
        {Icon && (
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-800 text-white shadow-soft dark:bg-brand-600">
            <Icon className="h-6 w-6" />
          </span>
        )}
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 sm:text-base">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

export function LinkArrow({ to, children }) {
  return (
    <Link to={to} className="group inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-saffron-600 dark:text-brand-300">
      {children} <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
    </Link>
  )
}

/* ---------------------------------------------------------- PageHeader */
/** Banner at the top of each module page. */
export function PageHeader({ icon: Icon, kicker, title, subtitle, children, crumbs = [] }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-saffron-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
      <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full text-white/5" preserveAspectRatio="none" viewBox="0 0 1200 60" aria-hidden>
        <path d="M0 60V35h40V20h30v15h40V10h20v25h50V25h30V5h15v30h60V18h40v17h50V8h25v27h40V22h35v13h70V12h30v23h60V28h40V15h20v20h45V6h25v29h60V20h30v15h40V25h50v35z" fill="currentColor" />
      </svg>
      <div className="container-x relative py-10 sm:py-14">
        {crumbs.length > 0 && (
          <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-brand-200" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white">Home</Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3" />
                {c.to ? <Link to={c.to} className="hover:text-white">{c.label}</Link> : <span className="text-white">{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4">
            {Icon && (
              <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="hidden h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur sm:grid">
                <Icon className="h-7 w-7 text-saffron-300" />
              </motion.span>
            )}
            <div>
              {kicker && <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-saffron-300">{kicker}</p>}
              <motion.h1 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl font-extrabold text-white sm:text-4xl">
                {title}
              </motion.h1>
              {subtitle && <p className="mt-2 max-w-2xl text-sm text-brand-100 sm:text-base">{subtitle}</p>}
            </div>
          </div>
          {children}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- SearchInput */
export function SearchInput({ value, onChange, placeholder = 'Search…', className = '' }) {
  return (
    <label className={`relative block ${className}`}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input pl-10" />
    </label>
  )
}

/* ---------------------------------------------------------- EmptyState */
export function EmptyState({ icon: Icon = Search, title, text, action }) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-white/5 dark:text-brand-200">
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="text-lg font-bold">{title}</h3>
      {text && <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">{text}</p>}
      {action}
    </div>
  )
}

/* --------------------------------------------------------------- Modal */
export function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            onMouseDown={(e) => e.stopPropagation()}
            className={`max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl dark:bg-ink-900 sm:rounded-3xl ${wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'}`}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/90 px-5 py-4 backdrop-blur dark:border-white/10 dark:bg-ink-900/90">
              <h3 className="text-lg font-bold">{title}</h3>
              <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* -------------------------------------------------------------- Reveal */
export function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.45, delay }} className={className}>
      {children}
    </motion.div>
  )
}

/* -------------------------------------------------------------- Select */
export function Select({ value, onChange, options, className = '', ...rest }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`input select-arrow ${className}`} {...rest}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

/* ----------------------------------------------------------- ChipGroup */
export function ChipGroup({ options, value, onChange }) {
  return (
    <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} className={value === o.value ? 'chip-on' : 'chip-off'}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------- DemoNotice */
export function DemoNotice({ children }) {
  return (
    <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
      {children}
    </p>
  )
}
