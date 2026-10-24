import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Bookmark, BookOpenText, Download, Eye, Flag, Library as LibraryIcon, SearchX, ShieldCheck } from 'lucide-react'
import { Badge, ChipGroup, EmptyState, Modal, PageHeader, SearchInput, Select } from '../components/ui'
import { useData } from '../context/DataContext'
import { useToast } from '../context/AppContext'
import { books, librarySubjects, licenses } from '../data/library'

export default function Library() {
  const [params] = useSearchParams()
  const { isSaved, toggleSaved, addReport } = useData()
  const toast = useToast()
  const [q, setQ] = useState(params.get('q') ?? '')
  const [subject, setSubject] = useState('All')
  const [course, setCourse] = useState('')
  const [report, setReport] = useState(null)
  const courses = Array.from(new Set(books.map((b) => b.course)))

  const list = useMemo(() => {
    const s = q.toLowerCase().trim()
    return books.filter((b) => (subject === 'All' || b.subject === subject) && (!course || b.course === course) && (!s || `${b.title} ${b.author} ${b.subject} ${b.course}`.toLowerCase().includes(s)))
  }, [q, subject, course])

  const open = (b) => {
    if (b.url === '#') toast('Demo: student-contributed PDFs open in the built-in viewer once storage is connected.', 'info')
    else window.open(b.url, '_blank', 'noopener')
  }

  return (
    <>
      <PageHeader icon={LibraryIcon} kicker="E-Library" title="Books & digital resources" subtitle="NCERT, open-licensed textbooks, NPTEL material, public-domain classics and student notes shared with permission." crumbs={[{ label: 'E-Library' }]} />
      <div className="container-x py-8">
        <div className="mb-5 flex items-center gap-3 rounded-2xl bg-brand-50 p-3 text-sm text-brand-900 ring-1 ring-brand-100 dark:bg-white/5 dark:text-brand-100 dark:ring-white/10"><ShieldCheck className="h-5 w-5 shrink-0" /> We only host legally shareable content. Every item shows its licence and links to the official source.</div>
        <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_220px]">
          <SearchInput value={q} onChange={setQ} placeholder="Search by title, author, subject or course" />
          <Select value={course} onChange={setCourse} aria-label="Course" options={[{ value: '', label: 'All courses' }, ...courses.map((c) => ({ value: c, label: c }))]} />
        </div>
        <ChipGroup value={subject} onChange={setSubject} options={librarySubjects.map((s) => ({ value: s, label: s }))} />
        {list.length === 0 ? (
          <div className="mt-6"><EmptyState icon={SearchX} title="No books found" text="Try another subject or keyword." /></div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {list.map((b) => {
              const saved = isSaved('books', b.id)
              return (
                <article key={b.id} className="card card-hover group flex flex-col overflow-hidden">
                  <div className={`relative flex aspect-[3/4] flex-col justify-between bg-gradient-to-br ${b.color} p-3 text-white`}>
                    <div className="absolute inset-y-0 left-2 w-1 rounded bg-black/15" />
                    <BookOpenText className="ml-2 h-6 w-6 opacity-80" />
                    <div className="ml-2"><p className="line-clamp-4 font-display text-sm font-extrabold leading-tight">{b.title}</p><p className="mt-1 line-clamp-1 text-[11px] text-white/80">{b.author}</p></div>
                    <button onClick={() => toggleSaved('books', b.id)} className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/20 backdrop-blur hover:bg-white/30" aria-label="Bookmark" aria-pressed={saved}><Bookmark className={`h-3.5 w-3.5 ${saved ? 'fill-white' : ''}`} /></button>
                  </div>
                  <div className="flex flex-1 flex-col p-3">
                    <div className="flex flex-wrap gap-1"><Badge tone="gray">{b.subject}</Badge></div>
                    <p className="mt-2 text-[11px] text-slate-500">{b.licenseNote ?? licenses[b.license]} · {b.format}</p>
                    <div className="mt-auto grid grid-cols-2 gap-1.5 pt-3">
                      <button onClick={() => open(b)} className="btn-outline px-2 py-1.5 text-xs"><Eye className="h-3.5 w-3.5" /> View</button>
                      <button onClick={() => open(b)} className="btn-primary px-2 py-1.5 text-xs"><Download className="h-3.5 w-3.5" /> Get</button>
                    </div>
                    <button onClick={() => setReport(b)} className="mt-2 flex items-center justify-center gap-1 text-[11px] text-slate-400 hover:text-rose-600"><Flag className="h-3 w-3" /> Report content</button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
      <Modal open={Boolean(report)} onClose={() => setReport(null)} title="Report content">
        {report && (
          <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); addReport({ item: report.title, kind: 'book', reason: fd.get('reason'), details: fd.get('details') }); setReport(null); toast('Report submitted. Our moderators will review it within 24 hours.') }} className="space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-300">Reporting: <b>{report.title}</b></p>
            <div><label className="label">Reason</label><select name="reason" className="input select-arrow"><option>Copyright infringement</option><option>Wrong or misleading content</option><option>Broken link</option><option>Inappropriate content</option><option>Other</option></select></div>
            <div><label className="label">Details</label><textarea name="details" rows={3} className="input" placeholder="Help us understand the problem" /></div>
            <button className="btn-primary w-full">Submit report</button>
          </form>
        )}
      </Modal>
    </>
  )
}
