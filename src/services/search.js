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
import { roles, skills as jobSkills } from '../data/skillbridge'
import { vocationalTracks } from '../data/vocational'
import { exams as entranceExams, pathwayCourses } from '../data/pathways'
import { alternatives } from '../data/counseling'

export const searchGroups = {
  bridge: 'Skill Bridge', teacher: 'Teacher Copilot', pathway: 'After 12th', counsel: 'Counseling', vocational: 'Vocational',
  city: 'Cities', hostel: 'Hostels & PGs', tiffin: 'Tiffin & Mess', college: 'Colleges', student: 'Local Students',
  course: 'Study Resources', skill: 'Skills', job: 'Internships & Jobs', exam: 'Exams', quiz: 'Quizzes',
  scholarship: 'Scholarships', book: 'E-Library', sidf: 'SIDF',
}

const cityName = (id) => cities.find((c) => c.id === id)?.name ?? id

/** Flattens every module into one searchable list. Hostels/tiffins come from live state. */
export function buildIndex(hostels = [], tiffins = []) {
  return [
    { type: 'teacher', title: 'Teacher Copilot', subtitle: 'AI lesson plans, question papers, quizzes & class heatmap', to: '/teacher', text: 'teacher lesson plan question paper quiz class heatmap ai' },
    { type: 'teacher', title: 'Join a class with a code', subtitle: 'Students: open notes and quizzes from your teacher', to: '/class', text: 'class code join quiz notes' },
    ...roles.map((r) => ({ type: 'bridge', title: `${r.name} — skill gap & plan`, subtitle: r.blurb, to: '/skill-bridge', text: `${r.needs.map((n) => jobSkills[n.id].name).join(' ')} career job role gap` })),
    ...Object.entries(jobSkills).filter(([, sk]) => sk.badge).map(([id, sk]) => ({ type: 'bridge', title: `${sk.name} verified badge`, subtitle: 'Server-graded skill test', to: '/skill-bridge#verify', text: `${id} badge test certificate` })),
    ...pathwayCourses.map((c) => ({ type: 'pathway', title: `${c.name} after Class 12`, subtitle: `${c.duration} · ${c.exams.map((e) => entranceExams[e].name).join(', ')}`, to: `/pathways?course=${c.id}`, text: `${c.field} ${c.careers.join(' ')} entrance exam 12th school` })),
    ...Object.entries(alternatives).map(([id, a]) => ({ type: 'counsel', title: `Alternatives if ${a.exam} doesn't go well`, subtitle: a.headline, to: `/counseling?exam=${id}`, text: `${a.options.map((o) => o.name).join(' ')} counselling plan b drop year cut-off` })),
    { type: 'counsel', title: 'Talk to an expert counsellor', subtitle: 'Free sessions · Tele-MANAS 14416 for urgent support', to: '/counseling', text: 'counselling mental health stress support helpline' },
    ...vocationalTracks.map((v) => ({ type: 'vocational', title: v.name, subtitle: `${v.hi} · ${v.duration}`, to: '/vocational', text: `${v.roles.join(' ')} vocational trade iti` })),
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
