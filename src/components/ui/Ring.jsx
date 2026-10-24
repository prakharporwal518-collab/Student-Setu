import { motion } from 'framer-motion'

/** Circular progress ring (green ≥70, amber ≥40, red below). */
export default function Ring({ value, size = 140, stroke = 12, label = 'job-ready' }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const color = value >= 70 ? '#10b981' : value >= 40 ? '#f59e0b' : '#f43f5e'
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-slate-100 dark:text-white/10" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - value / 100) }} transition={{ duration: 0.8 }} />
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">{value}%</p>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      </div>
    </div>
  )
}

