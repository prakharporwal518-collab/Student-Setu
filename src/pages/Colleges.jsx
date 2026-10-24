import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Building2, ExternalLink, GraduationCap, Home, Mail, MapPin, Phone, Star, Users, UtensilsCrossed } from 'lucide-react'
import { Avatar, Badge, DemoNotice, EmptyState, PageHeader, SearchInput, Select, SmartImage, VerifiedTick } from '../components/ui'
import HostelCard from '../components/hostel/HostelCard'
import { osmEmbed } from './HostelDetail'
import { useData } from '../context/DataContext'
import { cities, cityById, formatINR, states } from '../data/common'
import { allCourses, collegeById, colleges } from '../data/colleges'
import { students } from '../data/community'

export default function Colleges() {
  const [q, setQ] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [course, setCourse] = useState('')
  const [hostelOnly, setHostelOnly] = useState(false)

  const list = useMemo(() => {
    const s = q.toLowerCase().trim()
    return colleges.filter(
      (c) =>
        (!state || cityById(c.city)?.stateId === state) &&
        (!city || c.city === city) &&
        (!course || c.courses.includes(course)) &&
        (!hostelOnly || c.hostel) &&
        (!s || `${c.name} ${c.short} ${c.area}`.toLowerCase().includes(s)),
    )
  }, [q, state, city, course, hostelOnly])

  return (
    <>
      <PageHeader icon={Building2} kicker="College Directory" title="Explore colleges & courses" subtitle="Official links and contacts, courses offered, hostel availability, nearby stays and tiffin — plus students from each college." crumbs={[{ label: 'Colleges' }]} />
      <div className="container-x py-8">
        <div className="card mb-6 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto] lg:items-end">
          <div><label className="label">Search</label><SearchInput value={q} onChange={setQ} placeholder="College name, e.g. MANIT" /></div>
          <div><label className="label">State</label><Select value={state} onChange={(v) => { setState(v); setCity('') }} options={[{ value: '', label: 'All states' }, ...states.map((s) => ({ value: s.id, label: s.name }))]} /></div>
          <div><label className="label">City</label><Select value={city} onChange={setCity} options={[{ value: '', label: 'All cities' }, ...cities.filter((c) => !state || c.stateId === state).map((c) => ({ value: c.id, label: c.name }))]} /></div>
          <div><label className="label">Course</label><Select value={course} onChange={setCourse} options={[{ value: '', label: 'All courses' }, ...allCourses.map((c) => ({ value: c, label: c }))]} /></div>
          <label className="flex items-center gap-2 pb-2.5 text-sm"><input type="checkbox" className="checkbox" checked={hostelOnly} onChange={(e) => setHostelOnly(e.target.checked)} /> Has hostel</label>
        </div>
        <p className="mb-4 text-sm text-slate-500"><b className="text-slate-800 dark:text-white">{list.length}</b> colleges</p>
        {list.length === 0 ? (
          <EmptyState icon={Building2} title="No colleges match" text="Try another city or course." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => (
              <Link key={c.id} to={`/colleges/${c.id}`} className="card card-hover group flex flex-col overflow-hidden">
                <SmartImage src={c.image} alt={c.name} fallbackLabel={c.short} icon={GraduationCap} className="aspect-[16/8] w-full" />
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    <Badge tone="brand">{c.type}</Badge>
                    {c.naac !== '—' && <Badge tone="saffron">NAAC {c.naac}</Badge>}
                    {c.hostel && <Badge tone="green">Hostel</Badge>}
                  </div>
                  <h3 className="font-bold leading-snug group-hover:text-brand-700 dark:group-hover:text-brand-300">{c.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" /> {c.area}, {cityById(c.city)?.name}</p>
                  <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{c.about}</p>
                  <div className="mt-auto flex items-center justify-between pt-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-saffron-400 text-saffron-400" /> {c.rating} student rating</span>
                    <span>{c.courses.slice(0, 3).join(' · ')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export function CollegeDetail() {
  const { id } = useParams()
  const c = collegeById(id)
  const { hostels, tiffins } = useData()
  if (!c) return <div className="container-x py-16"><EmptyState icon={Building2} title="College not found" action={<Link to="/colleges" className="btn-primary">All colleges</Link>} /></div>

  const stays = hostels.filter((h) => h.status === 'approved' && (h.college === c.id || (h.city === c.city && h.type === 'government'))).slice(0, 6)
  const food = tiffins.filter((t) => t.status === 'approved' && t.city === c.city).slice(0, 4)
  const peers = students.filter((s) => s.college === c.id)

  return (
    <>
      <PageHeader icon={GraduationCap} kicker={c.type} title={c.name} subtitle={`${c.short} · Established ${c.established} · ${c.area}, ${cityById(c.city)?.name}`} crumbs={[{ label: 'Colleges', to: '/colleges' }, { label: c.short }]}>
        <a href={c.website} target="_blank" rel="noreferrer" className="btn-accent shrink-0">Official website <ExternalLink className="h-4 w-4" /></a>
      </PageHeader>
      <div className="container-x py-8">
        <Link to="/colleges" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-700"><ArrowLeft className="h-4 w-4" /> All colleges</Link>
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0 space-y-6">
            <div className="card p-5 sm:p-6">
              <h2 className="text-lg font-bold">About</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{c.about}</p>
              <h3 className="mb-2 mt-5 font-bold">Courses offered</h3>
              <div className="flex flex-wrap gap-2">{c.courses.map((x) => <Link key={x} to={`/resources?course=${x.toLowerCase().replace(/[^a-z]/g, '')}`} className="chip-off">{x}</Link>)}</div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/5"><p className="text-xs text-slate-500">Hostel on campus</p><p className="font-bold">{c.hostel ? 'Available' : 'Not available'}</p></div>
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/5"><p className="text-xs text-slate-500">NAAC grade</p><p className="font-bold">{c.naac}</p></div>
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/5"><p className="text-xs text-slate-500">Students on Setu</p><p className="font-bold">{c.students.toLocaleString('en-IN')}+</p></div>
              </div>
            </div>
            <div className="card overflow-hidden">
              <h2 className="flex items-center gap-2 p-4 text-lg font-bold"><MapPin className="h-5 w-5 text-brand-700" /> Location</h2>
              <iframe title={`Map of ${c.short}`} src={osmEmbed(c.lat, c.lng, 0.02)} className="h-72 w-full border-0" loading="lazy" />
            </div>
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold"><Home className="h-5 w-5 text-brand-700" /> Hostels & stays nearby</h2>
              {stays.length ? <div className="grid gap-5 sm:grid-cols-2">{stays.map((h) => <HostelCard key={h.id} hostel={h} />)}</div> : <p className="text-sm text-slate-500">No listed stays yet.</p>}
              <Link to={`/hostels?city=${c.city}&college=${c.id}`} className="btn-outline mt-4">See all stays near {c.short}</Link>
            </section>
          </div>
          <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
            <div className="card p-5">
              <h3 className="mb-3 font-bold">Official contact</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2"><ExternalLink className="mt-0.5 h-4 w-4 text-brand-700" /><a href={c.website} target="_blank" rel="noreferrer" className="link break-all">{c.website.replace('https://', '')}</a></li>
                <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-brand-700" /> {c.phone} <span className="text-xs text-slate-400">(landline)</span></li>
                <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-brand-700" /> {c.email}</li>
              </ul>
              <div className="mt-4"><DemoNotice>Contact numbers are partially masked in this demo. Always confirm details on the official website.</DemoNotice></div>
            </div>
            <div className="card p-5">
              <h3 className="mb-3 flex items-center gap-2 font-bold"><UtensilsCrossed className="h-4 w-4 text-saffron-500" /> Tiffin services nearby</h3>
              <ul className="space-y-2 text-sm">{food.map((t) => <li key={t.id}><Link to={`/tiffin?focus=${t.id}`} className="flex justify-between gap-2 hover:text-brand-700"><span className="truncate">{t.name} <span className="text-xs text-slate-400">· {t.area}</span></span><b className="shrink-0">{formatINR(t.monthly)}</b></Link></li>)}</ul>
            </div>
            <div className="card p-5">
              <h3 className="mb-3 flex items-center gap-2 font-bold"><Users className="h-4 w-4 text-emerald-600" /> Students from this college</h3>
              {peers.length ? (
                <ul className="space-y-3">{peers.map((s) => <li key={s.id} className="flex items-center gap-3"><Avatar name={s.name} size="h-9 w-9 text-xs" /><div className="min-w-0"><p className="flex items-center gap-1 text-sm font-semibold">{s.name} {s.verified && <VerifiedTick className="h-3.5 w-3.5" />}</p><p className="truncate text-xs text-slate-500">{s.course} · Year {s.year}</p></div></li>)}</ul>
              ) : <p className="text-sm text-slate-500">No students listed yet.</p>}
              <Link to={`/connect?city=${c.city}`} className="btn-primary mt-4 w-full py-2">Connect with students</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
