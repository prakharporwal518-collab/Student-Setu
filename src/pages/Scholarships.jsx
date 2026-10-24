import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Bookmark, CalendarClock, CheckCircle2, ExternalLink, GraduationCap, IndianRupee, Landmark, Building2, SearchX } from 'lucide-react'
import { Badge, ChipGroup, DemoNotice, EmptyState, PageHeader, SearchInput, Select } from '../components/ui'
import { useData } from '../context/DataContext'
import { useToast } from '../context/AppContext'
import { allCourses } from '../data/colleges'
import { states } from '../data/common'
import { scholarshipCategories, scholarships } from '../data/scholarships'

const incomeOptions = [
  { value: '', label: 'Any income' },
  { value: '250000', label: 'Up to ₹2.5 lakh' },
  { value: '450000', label: 'Up to ₹4.5 lakh' },
  { value: '600000', label: 'Up to ₹6 lakh' },
  { value: '800000', label: 'Up to ₹8 lakh' },
  { value: '1500000', label: 'Up to ₹15 lakh' },
]

export default function Scholarships() {
  const [params] = useSearchParams()
  const { isSaved, toggleSaved, applied, toggleApplied } = useData()
  const toast = useToast()
  const [q, setQ] = useState(params.get('q') ?? '')
  const [kind, setKind] = useState('all')
  const [course, setCourse] = useState('')
  const [state, setState] = useState('')
  const [category, setCategory] = useState('')
  const [marks, setMarks] = useState('')
  const [income, setIncome] = useState('')

  const list = useMemo(() => {
    const s = q.toLowerCase().trim()
    return scholarships.filter(
      (x) =>
        (kind === 'all' || x.kind === kind) &&
        (!course || x.courses.includes('All') || x.courses.includes(course)) &&
        (!state || x.state === 'All India' || x.state === state) &&
        (!category || x.categories.includes(category)) &&
        (!marks || +marks >= x.minMarks) &&
        (!income || +income <= x.maxIncome) &&
        (!s || `${x.name} ${x.provider}`.toLowerCase().includes(s)),
    )
  }, [q, kind, course, state, category, marks, income])

  return (
    <>
      <PageHeader icon={GraduationCap} kicker="Scholarships" title="Money should never stop a student" subtitle="Government and private scholarships, filtered by your course, state, category, marks and family income." crumbs={[{ label: 'Scholarships' }]} />
      <div className="container-x py-8">
        <div className="card mb-5 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6 lg:items-end">
          <div className="sm:col-span-2 lg:col-span-1"><label className="label">Search</label><SearchInput value={q} onChange={setQ} placeholder="Name or provider" /></div>
          <div><label className="label">Course</label><Select value={course} onChange={setCourse} options={[{ value: '', label: 'Any course' }, ...allCourses.map((c) => ({ value: c, label: c }))]} /></div>
          <div><label className="label">State</label><Select value={state} onChange={setState} options={[{ value: '', label: 'Any state' }, ...states.map((s) => ({ value: s.name, label: s.name }))]} /></div>
          <div><label className="label">Category</label><Select value={category} onChange={setCategory} options={[{ value: '', label: 'Any category' }, ...scholarshipCategories.map((c) => ({ value: c, label: c }))]} /></div>
          <div><label className="label">Your marks (%)</label><input type="number" min="0" max="100" value={marks} onChange={(e) => setMarks(e.target.value)} placeholder="e.g. 82" className="input" /></div>
          <div><label className="label">Family income</label><Select value={income} onChange={setIncome} options={incomeOptions} /></div>
        </div>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <ChipGroup value={kind} onChange={setKind} options={[{ value: 'all', label: 'All' }, { value: 'government', label: 'Government' }, { value: 'private', label: 'Private / CSR' }]} />
          <p className="text-sm text-slate-500"><b className="text-slate-800 dark:text-white">{list.length}</b> scholarships match your profile</p>
        </div>
        {list.length === 0 ? (
          <EmptyState icon={SearchX} title="No matching scholarships" text="Relax a filter — for example, family income or marks." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {list.map((s) => {
              const saved = isSaved('scholarships', s.id)
              const isApplied = applied.includes(s.id)
              return (
                <article key={s.id} className="card card-hover flex flex-col p-5">
                  <div className="flex items-start gap-3">
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${s.kind === 'government' ? 'bg-brand-50 text-brand-800 dark:bg-white/10 dark:text-brand-200' : 'bg-saffron-50 text-saffron-600 dark:bg-saffron-500/15'}`}>{s.kind === 'government' ? <Landmark className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}</span>
                    <div className="min-w-0 flex-1"><h3 className="font-bold leading-snug">{s.name}</h3><p className="text-sm text-slate-500">{s.provider}</p></div>
                    <button onClick={() => { toggleSaved('scholarships', s.id); toast(saved ? 'Removed' : 'Saved to dashboard', saved ? 'info' : 'success') }} className="btn-ghost h-9 w-9 shrink-0 p-0" aria-label="Save" aria-pressed={saved}><Bookmark className={`h-4 w-4 ${saved ? 'fill-brand-700 text-brand-700' : ''}`} /></button>
                  </div>
                  <p className="mt-3 flex items-center gap-1.5 font-display text-lg font-extrabold text-emerald-700 dark:text-emerald-400"><IndianRupee className="h-4 w-4" /> {s.amount.replace(/^₹/, '')}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{s.eligibility}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5"><Badge tone="brand">{s.state}</Badge>{s.categories.length < 8 && s.categories.map((c) => <Badge key={c} tone="purple">{c}</Badge>)}{s.minMarks > 0 && <Badge tone="gray">{s.minMarks}%+</Badge>}</div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-500"><CalendarClock className="h-4 w-4" /> {s.deadline}</span>
                    <div className="flex gap-2">
                      <button onClick={() => { toggleApplied(s.id); toast(isApplied ? 'Marked as not applied' : 'Marked as applied — track it in your dashboard', 'info') }} className={isApplied ? 'btn py-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'btn-ghost py-2'}>{isApplied ? <><CheckCircle2 className="h-4 w-4" /> Applied</> : 'Mark applied'}</button>
                      <a href={s.url} target="_blank" rel="noreferrer" className="btn-accent py-2">Apply <ExternalLink className="h-3.5 w-3.5" /></a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
        <div className="mt-5"><DemoNotice>Amounts, eligibility and deadlines are indicative and change every year. Always read the official guidelines before applying. Student Setu never charges for scholarship applications.</DemoNotice></div>
      </div>
    </>
  )
}
