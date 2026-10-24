import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Search, SearchX } from 'lucide-react'
import { EmptyState, PageHeader } from '../components/ui'
import { useData } from '../context/DataContext'
import { buildIndex, searchGroups, searchIndex } from '../services/search'

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [input, setInput] = useState(q)
  const { hostels, tiffins } = useData()
  const index = useMemo(() => buildIndex(hostels, tiffins), [hostels, tiffins])
  const results = useMemo(() => searchIndex(index, q, 200), [index, q])
  const grouped = useMemo(() => results.reduce((acc, r) => ({ ...acc, [r.type]: [...(acc[r.type] ?? []), r] }), {}), [results])

  return (
    <>
      <PageHeader icon={Search} kicker="Global search" title={q ? `Results for “${q}”` : 'Search everything'} subtitle="Hostels, tiffin, colleges, notes, skills, jobs, exams, scholarships, books and SIDF — in one place.">
        <form onSubmit={(e) => { e.preventDefault(); setParams(input.trim() ? { q: input.trim() } : {}) }} className="flex w-full max-w-md items-center rounded-2xl bg-white p-1.5 shadow-lift dark:bg-ink-900">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Try “PG Indore” or “DBMS”" className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 outline-none dark:text-white" aria-label="Search" />
          <button className="btn-accent px-3 py-2"><Search className="h-4 w-4" /></button>
        </form>
      </PageHeader>
      <div className="container-x py-8">
        {!q ? (
          <EmptyState icon={Search} title="What are you looking for?" text="Search a city, college, hostel, course, exam or skill." />
        ) : results.length === 0 ? (
          <EmptyState icon={SearchX} title={`No results for “${q}”`} text="Check the spelling or try a broader term like a city name." />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-1">
                <p className="mb-2 text-sm font-semibold text-slate-500">{results.length} results</p>
                {Object.entries(grouped).map(([type, rows]) => <a key={type} href={`#g-${type}`} className="flex justify-between rounded-lg px-3 py-2 text-sm hover:bg-white dark:hover:bg-white/5"><span>{searchGroups[type]}</span><span className="text-slate-400">{rows.length}</span></a>)}
              </div>
            </aside>
            <div className="space-y-8">
              {Object.entries(grouped).map(([type, rows]) => (
                <section key={type} id={`g-${type}`} className="scroll-mt-24">
                  <h2 className="mb-3 text-lg font-bold">{searchGroups[type]} <span className="text-sm font-normal text-slate-400">({rows.length})</span></h2>
                  <div className="card divide-y divide-slate-100 dark:divide-white/10">
                    {rows.slice(0, 8).map((r) => (
                      <Link key={r.to + r.title} to={r.to} className="group flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-white/5">
                        <div className="min-w-0 flex-1"><p className="truncate font-semibold text-slate-800 group-hover:text-brand-700 dark:text-white">{r.title}</p><p className="truncate text-sm text-slate-500">{r.subtitle}</p></div>
                        <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-saffron-500" />
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
