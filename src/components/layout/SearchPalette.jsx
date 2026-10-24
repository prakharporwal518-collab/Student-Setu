import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CornerDownLeft, Search, X } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { buildIndex, searchGroups, searchIndex } from '../../services/search'

const quick = ['Hostel in Bhopal', 'B.Tech notes', 'Internships', 'Scholarships for girls', 'GATE', 'Tiffin Indore']

/** Ctrl/⌘ + K global search across every module. */
export default function SearchPalette({ open, onClose }) {
  const { hostels, tiffins } = useData()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const index = useMemo(() => buildIndex(hostels, tiffins), [hostels, tiffins])
  const results = useMemo(() => searchIndex(index, q, 12), [index, q])

  useEffect(() => {
    if (open) {
      setQ('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])
  useEffect(() => setActive(0), [q])

  const go = (to) => {
    onClose()
    navigate(to)
  }
  const onKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      if (results[active]) go(results[active].to)
      else if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`)
    } else if (e.key === 'Escape') onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[95] flex items-start justify-center bg-slate-950/60 px-3 pt-[10vh] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div
            initial={{ y: -16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -16, opacity: 0 }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 dark:bg-ink-900 dark:ring-white/10"
            role="dialog"
            aria-label="Search Student Setu"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 dark:border-white/10">
              <Search className="h-5 w-5 text-saffron-500" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKey}
                placeholder="Search hostels, colleges, notes, jobs, scholarships…"
                className="h-14 flex-1 bg-transparent text-base text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
              />
              <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10" aria-label="Close search">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {!q && (
                <div className="p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Try searching</p>
                  <div className="flex flex-wrap gap-2">
                    {quick.map((s) => (
                      <button key={s} onClick={() => setQ(s)} className="chip-off">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {q && results.length === 0 && <p className="p-6 text-center text-sm text-slate-500">No matches for “{q}”. Try a city, college or course.</p>}
              {results.map((r, i) => (
                <button
                  key={`${r.type}-${r.to}-${r.title}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r.to)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left ${active === i ? 'bg-brand-50 dark:bg-white/10' : ''}`}
                >
                  <span className="w-24 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-saffron-600 dark:text-saffron-400">{searchGroups[r.type]}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-800 dark:text-white">{r.title}</span>
                    <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{r.subtitle}</span>
                  </span>
                  {active === i && <CornerDownLeft className="h-4 w-4 text-slate-400" />}
                </button>
              ))}
              {q && (
                <button
                  onMouseEnter={() => setActive(results.length)}
                  onClick={() => go(`/search?q=${encodeURIComponent(q.trim())}`)}
                  className={`mt-1 flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-brand-700 dark:text-brand-200 ${active === results.length ? 'bg-brand-50 dark:bg-white/10' : ''}`}
                >
                  See all results for “{q}” <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="hidden items-center gap-4 border-t border-slate-100 px-4 py-2 text-[11px] text-slate-400 dark:border-white/10 sm:flex">
              <span>↑↓ to navigate</span>
              <span>↵ to open</span>
              <span>Esc to close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
