import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bookmark, BookOpen, ChevronRight, Download, ExternalLink, FileText, FolderOpen, Gift, Upload } from 'lucide-react'
import { Badge, ChipGroup, EmptyState, Modal, PageHeader } from '../components/ui'
import { useData } from '../context/DataContext'
import { useToast } from '../context/AppContext'
import { collegeById } from '../data/colleges'
import { courses, resourcesFor, resourceTypes } from '../data/resources'

function Crumb({ items }) {
  return (
    <nav className="mb-5 flex flex-wrap items-center gap-1 text-sm" aria-label="Selection">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-4 w-4 text-slate-300" />}
          {it.onClick ? <button onClick={it.onClick} className="font-medium text-brand-700 hover:underline dark:text-brand-300">{it.label}</button> : <span className="font-semibold text-slate-800 dark:text-white">{it.label}</span>}
        </span>
      ))}
    </nav>
  )
}

export default function Resources() {
  const [params, setParams] = useSearchParams()
  const toast = useToast()
  const { isSaved, toggleSaved } = useData()
  const course = courses.find((c) => c.id === params.get('course'))
  const [uni, setUni] = useState('')
  const [year, setYear] = useState(0)
  const [sem, setSem] = useState(0)
  const [subject, setSubject] = useState('')
  const [tab, setTab] = useState('notes')
  const [upload, setUpload] = useState(false)

  // Deep links: ?course=btech&sem=3
  useEffect(() => {
    if (!course) return
    setUni((u) => u || course.universities[0])
    const s = +params.get('sem')
    if (s) {
      setSem(s)
      setYear(Math.ceil(s / 2))
    }
  }, [course, params])

  const pickCourse = (id) => {
    setUni('')
    setYear(0)
    setSem(0)
    setSubject('')
    setParams(id ? { course: id } : {})
  }
  const uniObj = collegeById(uni)
  const subjects = course && sem ? course.semesters[sem] ?? [] : []
  const bundle = useMemo(() => (subject ? resourcesFor(subject, uniObj?.short ?? 'University') : null), [subject, uniObj])

  const crumbs = [{ label: 'All courses', onClick: course ? () => pickCourse('') : undefined }]
  if (course) crumbs.push({ label: `${course.name} · ${uniObj?.short ?? ''}`, onClick: year ? () => { setYear(0); setSem(0); setSubject('') } : undefined })
  if (year) crumbs.push({ label: `Year ${year}`, onClick: sem ? () => { setSem(0); setSubject('') } : undefined })
  if (sem) crumbs.push({ label: `Semester ${sem}`, onClick: subject ? () => setSubject('') : undefined })
  if (subject) crumbs.push({ label: subject })

  return (
    <>
      <PageHeader icon={BookOpen} kicker="Study Resources" title="Notes, PYQs & syllabus — free" subtitle="Organised by Course → University → Year → Semester → Subject, following your university’s curriculum." crumbs={[{ label: 'Study Resources' }]}>
        <button onClick={() => setUpload(true)} className="btn-accent shrink-0"><Upload className="h-4 w-4" /> Contribute notes</button>
      </PageHeader>
      <div className="container-x py-8">
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-400/20">
          <Gift className="h-5 w-5 shrink-0" /> All academic resources are free of cost — forever.
        </div>
        <Crumb items={crumbs} />

        {!course && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {courses.map((c, i) => (
              <motion.button key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => pickCourse(c.id)} className="card card-hover overflow-hidden text-left">
                <div className={`bg-gradient-to-br ${c.color} px-4 py-6 text-white`}>
                  <p className="font-display text-2xl font-extrabold">{c.name}</p>
                  <p className="text-xs text-white/80">{c.years} years</p>
                </div>
                <div className="p-3"><p className="text-xs text-slate-500">{c.full}</p></div>
              </motion.button>
            ))}
          </div>
        )}

        {course && (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="card h-fit space-y-5 p-5">
              <div>
                <p className="label">University</p>
                <div className="space-y-1.5">
                  {course.universities.map((u) => (
                    <button key={u} onClick={() => { setUni(u); setSubject('') }} className={`w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition ${uni === u ? 'bg-brand-800 text-white' : 'bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10'}`}>
                      {collegeById(u)?.short} <span className={`block text-xs ${uni === u ? 'text-brand-200' : 'text-slate-400'}`}>{collegeById(u)?.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="label">Year</p>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: course.years }, (_, i) => i + 1).map((y) => (
                    <button key={y} onClick={() => { setYear(y); setSem(0); setSubject('') }} className={year === y ? 'chip-on justify-center' : 'chip-off justify-center'}>{y}</button>
                  ))}
                </div>
              </div>
              {year > 0 && (
                <div>
                  <p className="label">Semester</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[year * 2 - 1, year * 2].map((s) => (
                      <button key={s} onClick={() => { setSem(s); setSubject('') }} className={sem === s ? 'chip-on justify-center' : 'chip-off justify-center'}>Sem {s}</button>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-xs text-slate-400">{course.branch}</p>
            </aside>

            <div className="min-w-0">
              {!sem && <EmptyState icon={FolderOpen} title="Pick a year and semester" text={`Choose your year on the left to see ${course.name} subjects for ${uniObj?.short}.`} />}
              {sem > 0 && !subject && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {subjects.map((s, i) => (
                    <motion.button key={s} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} onClick={() => { setSubject(s); setTab('notes') }} className="card card-hover flex items-center gap-3 p-4 text-left">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 font-display font-bold text-brand-800 dark:bg-white/10 dark:text-brand-200">{s[0]}</span>
                      <span className="min-w-0 flex-1"><span className="block font-semibold text-slate-800 dark:text-white">{s}</span><span className="text-xs text-slate-500">Notes · Syllabus · 4 PYQs · Links</span></span>
                      <ChevronRight className="h-5 w-5 text-slate-300" />
                    </motion.button>
                  ))}
                </div>
              )}
              {bundle && (
                <div className="card p-5">
                  <h2 className="text-xl font-bold">{subject}</h2>
                  <p className="mb-4 text-sm text-slate-500">{course.name} · {uniObj?.short} · Semester {sem}</p>
                  <ChipGroup value={tab} onChange={setTab} options={resourceTypes.map((r) => ({ value: r.id, label: `${r.label} (${bundle[r.id].length})` }))} />
                  <ul className="mt-4 divide-y divide-slate-100 dark:divide-white/10">
                    {tab === 'links'
                      ? bundle.links.map((l) => (
                          <li key={l.url} className="flex items-center gap-3 py-3">
                            <ExternalLink className="h-5 w-5 shrink-0 text-brand-700" />
                            <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{l.title}</p><p className="text-xs text-slate-500">{l.source}</p></div>
                            <a href={l.url} target="_blank" rel="noreferrer" className="btn-outline py-1.5 text-xs">Open</a>
                          </li>
                        ))
                      : bundle[tab].map((r) => {
                          const key = `${uni}|${sem}|${r.title}`
                          const saved = isSaved('resources', key)
                          return (
                            <li key={r.title} className="flex items-center gap-3 py-3">
                              <FileText className="h-5 w-5 shrink-0 text-rose-500" />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold">{r.title}</p>
                                <p className="text-xs text-slate-500">PDF · {r.pages} pages · by {r.by} · {r.downloads.toLocaleString('en-IN')} downloads</p>
                              </div>
                              <Badge tone="green" className="hidden sm:inline-flex">Free</Badge>
                              <button onClick={() => { toggleSaved('resources', key); toast(saved ? 'Bookmark removed' : 'Bookmarked', saved ? 'info' : 'success') }} className="btn-ghost h-9 w-9 p-0" aria-label="Bookmark" aria-pressed={saved}>
                                <Bookmark className={`h-4 w-4 ${saved ? 'fill-brand-700 text-brand-700' : ''}`} />
                              </button>
                              <button onClick={() => toast('Demo: files are served from cloud storage once the backend is connected.', 'info')} className="btn-primary h-9 px-3 py-0 text-xs"><Download className="h-4 w-4" /> <span className="hidden sm:inline">Download</span></button>
                            </li>
                          )
                        })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Modal open={upload} onClose={() => setUpload(false)} title="Contribute your notes">
        <form onSubmit={(e) => { e.preventDefault(); setUpload(false); toast('Thanks! Our team will review and publish with your name.') }} className="space-y-3">
          <div><label className="label">Title</label><input required className="input" placeholder="e.g. DBMS Unit 3 handwritten notes" /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="label">Course</label><select className="input select-arrow">{courses.map((c) => <option key={c.id}>{c.name}</option>)}</select></div>
            <div><label className="label">Semester</label><select className="input select-arrow">{[1, 2, 3, 4, 5, 6, 7, 8].map((s) => <option key={s}>Semester {s}</option>)}</select></div>
          </div>
          <div><label className="label">File (PDF)</label><input type="file" accept="application/pdf" required className="input file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1 file:text-brand-800" /></div>
          <label className="flex items-start gap-2 text-sm"><input type="checkbox" required className="checkbox mt-0.5" /> I own this content (or have permission) and allow Student Setu to share it free of cost.</label>
          <button className="btn-accent w-full">Submit for review</button>
        </form>
      </Modal>
    </>
  )
}
