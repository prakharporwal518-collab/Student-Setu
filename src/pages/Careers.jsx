import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Briefcase, Building, CalendarClock, ExternalLink, GraduationCap, MapPin, Rocket, Target, Wallet } from 'lucide-react'
import { Badge, ChipGroup, DemoNotice, EmptyState, PageHeader, SearchInput, SectionHeader } from '../components/ui'
import { listings, programs, sources, yearGuidance } from '../data/careers'
import JobMatches from '../components/careers/JobMatches'

const daysLeft = (d) => Math.ceil((new Date(d) - Date.now()) / 86400000)

export default function Careers() {
  const [params] = useSearchParams()
  const [year, setYear] = useState(2)
  const [kind, setKind] = useState('all')
  const [q, setQ] = useState(params.get('q') ?? '')
  const [forYear, setForYear] = useState(false)
  const g = yearGuidance.find((x) => x.year === year)

  const list = useMemo(() => {
    const s = q.toLowerCase().trim()
    return listings
      .filter((l) => kind === 'all' || l.kind === kind)
      .filter((l) => !forYear || l.years.includes(year))
      .filter((l) => !s || `${l.title} ${l.company} ${l.tags.join(' ')} ${l.location}`.toLowerCase().includes(s))
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
  }, [kind, q, forYear, year])

  return (
    <>
      <PageHeader icon={Briefcase} kicker="Internships & Jobs" title="The right opportunity for your year" subtitle="Year-wise guidance, curated listings and trusted programs. We always credit and link to the original source." crumbs={[{ label: 'Internships & Jobs' }]} />
      <div className="container-x py-8">
        <JobMatches />
        <SectionHeader icon={Target} title="Year-wise guidance" subtitle="What to focus on and which opportunities suit you" />
        <div className="mb-4 grid grid-cols-4 gap-2 sm:w-fit">
          {[1, 2, 3, 4].map((y) => (
            <button key={y} onClick={() => setYear(y)} className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${year === y ? 'bg-brand-800 text-white shadow-lift' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10'}`}>
              {y === 4 ? 'Final' : `${y}${['st', 'nd', 'rd'][y - 1]}`} year
            </button>
          ))}
        </div>
        <div className="card mb-12 grid gap-6 p-5 sm:p-6 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-bold">{g.title}</h3>
            <p className="mb-2 mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Focus on</p>
            <ul className="space-y-2">{g.focus.map((f) => <li key={f} className="flex gap-2 text-sm"><Rocket className="mt-0.5 h-4 w-4 shrink-0 text-saffron-500" /> {f}</li>)}</ul>
          </div>
          <div className="rounded-2xl bg-brand-50 p-4 dark:bg-white/5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">{year === 4 ? 'Jobs you are eligible for' : 'Opportunities that suit you'}</p>
            <ul className="space-y-2">{g.suits.map((f) => <li key={f} className="flex gap-2 text-sm font-medium text-slate-700 dark:text-slate-200"><GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-brand-700 dark:text-brand-300" /> {f}</li>)}</ul>
          </div>
        </div>

        <SectionHeader icon={Briefcase} title="Latest listings" subtitle="Apply on the original platform — we never copy full listings" />
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchInput value={q} onChange={setQ} placeholder="Role, skill or company" className="lg:w-80" />
          <ChipGroup value={kind} onChange={setKind} options={[{ value: 'all', label: 'All' }, { value: 'internship', label: 'Internships' }, { value: 'job', label: 'Jobs' }]} />
          <label className="flex items-center gap-2 text-sm lg:ml-auto"><input type="checkbox" className="checkbox" checked={forYear} onChange={(e) => setForYear(e.target.checked)} /> Only for {year === 4 ? 'final' : `${year}${['st', 'nd', 'rd'][year - 1]}`} year</label>
        </div>
        {list.length === 0 ? (
          <EmptyState icon={Briefcase} title="No listings match" text="Try clearing the search or year filter." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {list.map((l) => {
              const src = sources[l.source]
              const left = daysLeft(l.deadline)
              return (
                <article key={l.id} className="card card-hover flex flex-col p-5">
                  <div className="flex items-start gap-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-900 font-display text-lg font-bold text-white">{l.company[0]}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold leading-snug">{l.title}</h3>
                      <p className="flex items-center gap-1 text-sm text-slate-500"><Building className="h-3.5 w-3.5" /> {l.company}</p>
                    </div>
                    <Badge tone={l.kind === 'job' ? 'purple' : 'brand'} className="capitalize">{l.kind}</Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {l.location}</span>
                    <span className="flex items-center gap-1"><Wallet className="h-3.5 w-3.5" /> {l.stipend}</span>
                    <span className="col-span-2 flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> {l.eligibility}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">{l.tags.map((t) => <Badge key={t} tone="gray">{t}</Badge>)}<Badge tone="saffron">Years {l.years.join(', ')}</Badge></div>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                    <span className={`flex items-center gap-1 text-xs font-semibold ${left <= 7 ? 'text-rose-600' : 'text-slate-500'}`}><CalendarClock className="h-4 w-4" /> {left > 0 ? `${left} days left` : 'Closed'} · {new Date(l.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    <a href={src.url} target="_blank" rel="noreferrer" className="btn-accent py-2">Apply on {src.name} <ExternalLink className="h-3.5 w-3.5" /></a>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-400">Source: {src.name}. Student Setu is not the recruiter.</p>
                </article>
              )
            })}
          </div>
        )}
        <div className="mt-4"><DemoNotice>Listings shown are sample data for the demo. In production, each card links to the exact posting on the original platform.</DemoNotice></div>

        <section className="mt-14">
          <SectionHeader icon={Rocket} title="Trusted programs to know" subtitle="Real, recurring programs — timelines are typical, always check the official site" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => (
              <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="card card-hover group p-5">
                <div className="flex items-center justify-between"><h3 className="font-bold group-hover:text-brand-700 dark:group-hover:text-brand-300">{p.name}</h3><ExternalLink className="h-4 w-4 text-slate-400" /></div>
                <p className="mt-1 text-sm text-slate-500">{p.for}</p>
                <p className="mt-3 text-xs font-semibold text-saffron-600 dark:text-saffron-400">{p.window}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
