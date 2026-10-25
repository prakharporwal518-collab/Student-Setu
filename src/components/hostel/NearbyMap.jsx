import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Home, MapPinned, UtensilsCrossed } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { colleges } from '../../data/colleges'
import { cities } from '../../data/common'

// Stays, food and colleges on one map preview. Hostels and colleges use their coordinates;
// tiffin centres are placed at the area they deliver from (approximate).
const W = 1000
const H = 420
const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)

export default function NearbyMap() {
  const { hostels, tiffins } = useData()
  const cityIds = [...new Set(hostels.filter((h) => h.status === 'approved' && h.lat).map((h) => h.city))]
  const [city, setCity] = useState(cityIds[0] ?? 'bhopal')
  const [active, setActive] = useState(null)
  const cityObj = cities.find((c) => c.id === city)

  const points = useMemo(() => {
    const hs = hostels.filter((h) => h.city === city && h.status === 'approved' && h.lat)
    const cs = colleges.filter((c) => c.city === city && c.lat)
    const areaPos = {}
    hs.forEach((h) => { areaPos[h.area] ??= { lat: h.lat, lng: h.lng } })
    const base = cityObj ?? { lat: hs[0]?.lat ?? 23, lng: hs[0]?.lng ?? 77 }
    const ts = tiffins.filter((t) => t.city === city && t.status === 'approved').map((t) => {
      const a = areaPos[t.area]
      const r = hash(t.id)
      const jitter = ((r % 100) - 50) / 6000
      const pos = a ?? { lat: base.lat + (((r >> 3) % 100) - 50) / 1500, lng: base.lng + (((r >> 9) % 100) - 50) / 1500 }
      return { ...t, lat: pos.lat + jitter, lng: pos.lng - jitter }
    })
    const all = [...hs, ...cs, ...ts]
    if (!all.length) return { list: [] }
    const lats = all.map((p) => p.lat), lngs = all.map((p) => p.lng)
    const [minLat, maxLat, minLng, maxLng] = [Math.min(...lats), Math.max(...lats), Math.min(...lngs), Math.max(...lngs)]
    const sx = (lng) => 70 + ((lng - minLng) / Math.max(1e-6, maxLng - minLng)) * (W - 140)
    const sy = (lat) => 50 + (1 - (lat - minLat) / Math.max(1e-6, maxLat - minLat)) * (H - 100)
    return {
      list: [
        ...hs.map((h) => ({ kind: 'hostel', id: h.id, name: h.name, sub: `₹${h.rent.toLocaleString('en-IN')}/mo · ${h.area}`, x: sx(h.lng), y: sy(h.lat), to: `/hostels/${h.id}` })),
        ...ts.map((t) => ({ kind: 'tiffin', id: t.id, name: t.name, sub: `₹${t.monthly.toLocaleString('en-IN')}/mo · ${t.area}`, x: sx(t.lng), y: sy(t.lat), to: `/tiffin?q=${encodeURIComponent(t.name)}` })),
        ...cs.map((c) => ({ kind: 'college', id: c.id, name: c.short ?? c.name, sub: c.type, x: sx(c.lng), y: sy(c.lat), to: `/colleges/${c.id}` })),
      ],
    }
  }, [hostels, tiffins, city, cityObj])

  const style = { college: { fill: '#7c3aed', Icon: GraduationCap }, hostel: { fill: '#1e3a8a', Icon: Home }, tiffin: { fill: '#f97316', Icon: UtensilsCrossed } }
  const count = (k) => points.list.filter((p) => p.kind === k).length
  const sel = points.list.find((p) => p.id === active)

  return (
    <section className="card mb-8 overflow-hidden" id="nearby-map">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold"><MapPinned className="h-5 w-5 text-brand-700" /> Stay & food near your college</h2>
          <p className="text-sm text-slate-500">Hostels, PGs and home-style tiffin centres around {cityObj?.name ?? city}’s colleges — tap a pin.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {cityIds.map((c) => <button key={c} onClick={() => { setCity(c); setActive(null) }} className={city === c ? 'chip-on' : 'chip-off'}>{cities.find((x) => x.id === c)?.name ?? c}</button>)}
        </div>
      </div>
      <div className="relative bg-[#eef2f7] dark:bg-ink-900">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`Map of hostels, tiffin centres and colleges in ${cityObj?.name ?? city}`}>
          <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#dbe3ee" strokeWidth="1" /></pattern></defs>
          <rect width={W} height={H} fill="url(#grid)" />
          <path d={`M0 ${H * 0.62} C ${W * 0.25} ${H * 0.5}, ${W * 0.5} ${H * 0.8}, ${W} ${H * 0.55}`} stroke="#ffffff" strokeWidth="14" fill="none" />
          <path d={`M${W * 0.35} 0 C ${W * 0.42} ${H * 0.35}, ${W * 0.3} ${H * 0.7}, ${W * 0.4} ${H}`} stroke="#ffffff" strokeWidth="10" fill="none" />
          <path d={`M${W * 0.7} 0 L ${W * 0.62} ${H}`} stroke="#ffffff" strokeWidth="8" fill="none" />
          <ellipse cx={W * 0.12} cy={H * 0.25} rx="80" ry="40" fill="#bfdbfe" opacity="0.7" />
          {points.list.map((p) => {
            const s = style[p.kind]
            const on = active === p.id
            return (
              <g key={p.kind + p.id} transform={`translate(${p.x},${p.y})`} onClick={() => setActive(on ? null : p.id)} onMouseEnter={() => setActive(p.id)} className="cursor-pointer" role="button" aria-label={`${p.name}, ${p.sub}`}>
                <circle r={on ? 22 : p.kind === 'college' ? 18 : 14} fill={s.fill} stroke="#fff" strokeWidth="3" opacity={on ? 1 : 0.92} />
                <s.Icon x={-9} y={-9} width={18} height={18} color="#fff" />
              </g>
            )
          })}
        </svg>
        {sel && (
          <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-xl bg-white px-4 py-2 text-center text-sm shadow-lift dark:bg-ink-950">
            <p className="font-bold">{sel.name}</p><p className="text-xs text-slate-500">{sel.sub}</p>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-4 p-4 text-sm">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-violet-600" /> Colleges ({count('college')})</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-brand-900" /> Hostels & PGs ({count('hostel')})</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-saffron-500" /> Tiffin centres ({count('tiffin')})</span>
        {sel && <Link to={sel.to} className="link ml-auto">Open {sel.name} →</Link>}
        <span className={`text-xs text-slate-400 ${sel ? '' : 'ml-auto'}`}>Map preview · locations approximate</span>
      </div>
    </section>
  )
}
