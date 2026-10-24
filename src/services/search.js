import { cities } from '../data/common'
import { colleges } from '../data/colleges'
import { students } from '../data/community'
import { courses } from '../data/resources'
import { skillCategories } from '../data/skills'
import { listings } from '../data/careers'
import { exams, quizzes } from '../data/exams'
import { scholarships } from '../data/scholarships'
import { books } from '../data/library'
import { sidfEvents, mentors } from '../data/sidf'
import { typeLabel } from '../data/hostels'

export const searchGroups = {
  city: 'Cities', hostel: 'Hostels & PGs', tiffin: 'Tiffin & Mess', college: 'Colleges', student: 'Local Students',
  course: 'Study Resources', skill: 'Skills', job: 'Internships & Jobs', exam: 'Exams', quiz: 'Quizzes',
  scholarship: 'Scholarships', book: 'E-Library', sidf: 'SIDF',
}

const cityName = (id) => cities.find((c) => c.id === id)?.name ?? id

/** Flattens every module into one searchable list. Hostels/tiffins come from live state. */
export function buildIndex(hostels = [], tiffins = []) {
  return [
    ...cities.map((c) => ({ type: 'city', title: c.name, subtitle: `${c.state} · ${c.tagline}`, to: `/connect?city=${c.id}`, text: c.areas.join(' ') })),
    ...hostels.filter((h) => h.status === 'approved').map((h) => ({ type: 'hostel', title: h.name, subtitle: `${typeLabel[h.type]} · ${h.area}, ${cityName(h.city)} · ₹${h.rent}/mo`, to: `/hostels/${h.id}`, text: `${h.city} ${h.area} ${h.type} ${h.gender} hostel pg room` })),
    ...tiffins.filter((t) => t.status === 'approved').map((t) => ({ type: 'tiffin', title: t.name, subtitle: `${t.area}, ${cityName(t.city)} · ₹${t.monthly}/mo`, to: `/tiffin?focus=${t.id}`, text: `${t.city} ${t.area} ${t.foodType} tiffin mess food` })),
    ...colleges.map((c) => ({ type: 'college', title: c.name, subtitle: `${c.short} · ${cityName(c.city)}`, to: `/colleges/${c.id}`, text: `${c.short} ${c.city} ${c.courses.join(' ')}` })),
    ...students.map((s) => ({ type: 'student', title: s.name, subtitle: `${s.course} · ${cityName(s.city)}`, to: `/connect?city=${s.city}`, text: s.interests.join(' ') })),
    ...courses.flatMap((c) => [
      { type: 'course', title: `${c.name} notes, PYQs & syllabus`, subtitle: c.full, to: `/resources?course=${c.id}`, text: 'notes pyq syllabus' },
      ...Object.entries(c.semesters).flatMap(([sem, subs]) => subs.map((s) => ({ type: 'course', title: s, subtitle: `${c.name} · Semester ${sem}`, to: `/resources?course=${c.id}&sem=${sem}`, text: c.name }))),
    ]),
    ...skillCategories.map((s) => ({ type: 'skill', title: s.name, subtitle: s.blurb, to: `/skills?cat=${s.id}`, text: s.roadmap.join(' ') })),
    ...listings.map((j) => ({ type: 'job', title: j.title, subtitle: `${j.company} · ${j.location}`, to: `/careers?q=${encodeURIComponent(j.title)}`, text: `${j.kind} ${j.tags.join(' ')} internship job` })),
    ...exams.map((e) => ({ type: 'exam', title: e.name, subtitle: e.full, to: `/exams?exam=${e.id}`, text: e.category })),
    ...quizzes.map((q) => ({ type: 'quiz', title: `${q.title} quiz`, subtitle: `${q.questions.length} questions · free`, to: `/quiz/${q.id}`, text: q.tag })),
    ...scholarships.map((s) => ({ type: 'scholarship', title: s.name, subtitle: `${s.provider} · ${s.amount}`, to: `/scholarships?q=${encodeURIComponent(s.name)}`, text: `${s.state} ${s.categories.join(' ')} scholarship` })),
    ...books.map((b) => ({ type: 'book', title: b.title, subtitle: `${b.author} · ${b.subject}`, to: `/library?q=${encodeURIComponent(b.title)}`, text: `${b.subject} ${b.course} book pdf` })),
    ...sidfEvents.map((e) => ({ type: 'sidf', title: e.title, subtitle: `${e.college} · ${e.date}`, to: '/sidf#events', text: e.tags.join(' ') })),
    ...mentors.map((m) => ({ type: 'sidf', title: m.name, subtitle: `Mentor · ${m.expertise.join(', ')}`, to: '/sidf#mentors', text: m.expertise.join(' ') })),
  ]
}

/** Every word of the query must appear somewhere in the item. Title matches rank first. */
export function searchIndex(index, query, limit = 60) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  if (!words.length) return []
  return index
    .map((item) => {
      const title = item.title.toLowerCase()
      const hay = `${title} ${item.subtitle} ${item.text ?? ''}`.toLowerCase()
      if (!words.every((w) => hay.includes(w))) return null
      const score = words.reduce((s, w) => s + (title.startsWith(w) ? 3 : title.includes(w) ? 2 : 1), 0)
      return { ...item, score }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
