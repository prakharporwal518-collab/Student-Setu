import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BookOpen, Bus, Check, IndianRupee, MapPin, MessageCircle, Send, ShieldCheck, ShoppingBag, UserPlus, Users } from 'lucide-react'
import { Avatar, Badge, EmptyState, PageHeader, SectionHeader, Select, VerifiedTick } from '../components/ui'
import { CityArt } from '../components/ui/Illustrations'
import { useData } from '../context/DataContext'
import { useAuth, useToast } from '../context/AppContext'
import { cities, cityById, states } from '../data/common'
import { colleges, collegeById } from '../data/colleges'
import { areaGuides, communities, students } from '../data/community'

const yearLabel = (y) => `${y}${['st', 'nd', 'rd'][y - 1] ?? 'th'} year`

function ScoreBar({ icon: Icon, label, value }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300"><Icon className="h-3.5 w-3.5" /> {label}</span>
        <span className="font-semibold">{value}/5</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-brand-700 dark:bg-brand-400" style={{ width: `${value * 20}%` }} /></div>
    </div>
  )
}

export default function Connect() {
  const [params, setParams] = useSearchParams()
  const initialCity = params.get('city') ?? ''
  const [state, setState] = useState(cityById(initialCity)?.stateId ?? '')
  const [city, setCity] = useState(initialCity)
  const [area, setArea] = useState('')
  const [college, setCollege] = useState('')
  const { connections, connect } = useData()
  const { user } = useAuth()
  const toast = useToast()

  const stateCities = cities.filter((c) => !state || c.stateId === state)
  const cityObj = cityById(city)
  const areaOptions = cityObj ? Array.from(new Set([...cityObj.areas, ...students.filter((s) => s.city === city).map((s) => s.area)])) : []
  const collegeOptions = colleges.filter((c) => (!city || c.city === city) && (!state || stateCities.some((sc) => sc.id === c.city)))

  const list = useMemo(
    () =>
      students.filter(
        (s) => (!state || cityById(s.city)?.stateId === state) && (!city || s.city === city) && (!area || s.area === area) && (!college || s.college === college),
      ),
    [state, city, area, college],
  )
  const guides = areaGuides.filter((g) => !city || g.city === city)
  const comms = communities.filter((c) => !city || c.city === city)

  const pickCity = (id) => {
    setCity(id)
    setArea('')
    setCollege('')
    setParams(id ? { city: id } : {}, { replace: true })
  }

  return (
    <>
      <PageHeader icon={Users} kicker="Connect with Local Students" title="Moving to a new city? Ask a local." subtitle="Genuine guidance from verified students who already live there — about areas, PGs, food, safety, transport and college life." crumbs={[{ label: 'Connect' }]} />

      <div className="container-x py-8">
        <div className="card mb-8 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label">State</label>
            <Select value={state} onChange={(v) => { setState(v); pickCity('') }} options={[{ value: '', label: 'All states' }, ...states.map((s) => ({ value: s.id, label: s.name }))]} />
          </div>
          <div>
            <label className="label">City</label>
            <Select value={city} onChange={pickCity} options={[{ value: '', label: 'All cities' }, ...stateCities.map((c) => ({ value: c.id, label: c.name }))]} />
          </div>
          <div>
            <label className="label">Area</label>
            <Select value={area} onChange={setArea} disabled={!city} options={[{ value: '', label: city ? 'All areas' : 'Pick a city first' }, ...areaOptions.map((a) => ({ value: a, label: a }))]} />
          </div>
          <div>
            <label className="label">College</label>
            <Select value={college} onChange={setCollege} options={[{ value: '', label: 'All colleges' }, ...collegeOptions.map((c) => ({ value: c.id, label: c.short }))]} />
          </div>
        </div>

        <SectionHeader title={`Local students${cityObj ? ` in ${cityObj.name}` : ''}`} subtitle={`${list.length} students ready to help`} />
        {list.length === 0 ? (
          <EmptyState icon={Users} title="No students here yet" text="Be the first local guide for this area — sign up as a student and turn on 'Help newcomers'." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((s) => {
              const done = connections.includes(s.id)
              const col = collegeById(s.college)
              return (
                <article key={s.id} className="card card-hover flex flex-col p-5">
                  <div className="flex items-start gap-3">
                    <Avatar name={s.name} size="h-14 w-14 text-lg" />
                    <div className="min-w-0">
                      <p className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">{s.name} {s.verified && <VerifiedTick />}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{s.course} · {yearLabel(s.year)}</p>
                      <p className="truncate text-xs text-slate-500">{col?.short} · <MapPin className="inline h-3 w-3" /> {s.area}, {cityById(s.city)?.name}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{s.bio}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">{s.interests.map((i) => <Badge key={i} tone="gray">{i}</Badge>)}</div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="text-xs text-slate-500">Helped {s.helped} newcomers</span>
                    <button
                      disabled={done}
                      onClick={() => {
                        connect(s.id)
                        toast(user ? `Request sent to ${s.name.split(' ')[0]}!` : `Request sent! Log in to chat with ${s.name.split(' ')[0]}.`)
                      }}
                      className={done ? 'btn py-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'btn-primary py-2'}
                    >
                      {done ? <><Check className="h-4 w-4" /> Requested</> : <><UserPlus className="h-4 w-4" /> Connect</>}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        <section className="mt-14">
          <SectionHeader icon={MessageCircle} title="City communities" subtitle="Discussion groups moderated by verified local students" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {comms.map((c, i) => {
              const ci = cityById(c.city)
              return (
                <div key={c.city} className="card overflow-hidden">
                  <div className="relative">
                    <CityArt palette={ci.palette} landmark={ci.landmark} seed={i + 3} className="aspect-[3/1] w-full" />
                    <p className="absolute bottom-2 left-3 font-display text-xl font-extrabold text-white drop-shadow">{ci.name}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-slate-500">{c.members.toLocaleString('en-IN')} members · {ci.tagline}</p>
                    <ul className="mt-2 space-y-1 text-sm">{c.groups.map((g) => <li key={g} className="flex items-center gap-2 text-slate-700 dark:text-slate-200"><span className="h-1.5 w-1.5 rounded-full bg-saffron-500" /> {g}</li>)}</ul>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <a href={c.whatsapp} onClick={(e) => { if (c.whatsapp === '#') { e.preventDefault(); toast('Invite links are shared by verified city admins after you sign up.', 'info') } }} className="btn py-2 bg-emerald-500 text-white hover:bg-emerald-600"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
                      <a href={c.telegram} onClick={(e) => { if (c.telegram === '#') { e.preventDefault(); toast('Invite links are shared by verified city admins after you sign up.', 'info') } }} className="btn py-2 bg-sky-500 text-white hover:bg-sky-600"><Send className="h-4 w-4" /> Telegram</a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="mt-14">
          <SectionHeader icon={MapPin} title="Area guides by local students" subtitle="Study environment, safety, transport, cost of living and nearby markets" />
          <div className="grid gap-4 lg:grid-cols-2">
            {guides.map((g) => {
              const author = students.find((s) => s.id === g.author)
              return (
                <article key={g.id} className="card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold">{g.area}, {cityById(g.city)?.name}</h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{g.summary}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <ScoreBar icon={BookOpen} label="Study environment" value={g.scores.study} />
                    <ScoreBar icon={ShieldCheck} label="Safety" value={g.scores.safety} />
                    <ScoreBar icon={Bus} label="Transport" value={g.scores.transport} />
                    <ScoreBar icon={IndianRupee} label="Affordability" value={g.scores.cost} />
                  </div>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex gap-2"><dt className="w-28 shrink-0 font-semibold text-slate-700 dark:text-slate-200">Cost of living</dt><dd className="text-slate-600 dark:text-slate-300">{g.costOfLiving}</dd></div>
                    <div className="flex gap-2"><dt className="w-28 shrink-0 font-semibold text-slate-700 dark:text-slate-200">Transport</dt><dd className="text-slate-600 dark:text-slate-300">{g.transport}</dd></div>
                    <div className="flex gap-2"><dt className="w-28 shrink-0 font-semibold text-slate-700 dark:text-slate-200"><ShoppingBag className="mr-1 inline h-3.5 w-3.5" />Markets</dt><dd className="text-slate-600 dark:text-slate-300">{g.markets.join(' · ')}</dd></div>
                  </dl>
                  <ul className="mt-3 space-y-1 rounded-xl bg-saffron-50 p-3 text-sm text-saffron-800 dark:bg-saffron-500/10 dark:text-saffron-200">{g.tips.map((t) => <li key={t}>💡 {t}</li>)}</ul>
                  {author && <p className="mt-3 flex items-center gap-2 text-xs text-slate-500"><Avatar name={author.name} size="h-6 w-6 text-[10px]" /> Written by {author.name}, {author.course}</p>}
                </article>
              )
            })}
            {guides.length === 0 && <EmptyState icon={MapPin} title="No guides for this city yet" text="Local students are writing them — check back soon." />}
          </div>
        </section>
      </div>
    </>
  )
}
