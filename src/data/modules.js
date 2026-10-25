import { Book, Home, UtensilsCrossed, Building2, BookOpen, Briefcase, GraduationCap, Lightbulb, Users, FileQuestion, PlayCircle, Presentation, Route, Wrench, School, Compass, LifeBuoy } from 'lucide-react'

// One registry for every module — used by the home cards, the navbar menus and the footer.
//   group 'learn' = the core education platform · group 'life' = optional student-life support
//   `solid` draws the icon filled (home page style); `badge` paints a coloured circle behind a white icon.
const navy = 'text-brand-800 bg-brand-50 dark:bg-brand-500/15 dark:text-brand-200'

export const modules = [
  { id: 'skillbridge', group: 'learn', badge: 'bg-gradient-to-br from-saffron-400 to-saffron-600 text-white', key: 'mod.skillbridge', to: '/skill-bridge', icon: Route, tint: 'text-saffron-600 bg-saffron-50 dark:bg-saffron-500/15 dark:text-saffron-300' },
  { id: 'teacher', group: 'learn', solid: true, key: 'mod.teacher', to: '/teacher', icon: Presentation, tint: navy },
  { id: 'pathways', group: 'learn', key: 'mod.pathways', to: '/pathways', icon: Compass, tint: navy },
  { id: 'resources', group: 'learn', solid: true, key: 'mod.resources', to: '/resources', icon: BookOpen, tint: navy },
  { id: 'skills', group: 'learn', solid: true, key: 'mod.skills', to: '/skills', icon: PlayCircle, tint: navy },
  { id: 'vocational', group: 'learn', solid: true, key: 'mod.vocational', to: '/vocational', icon: Wrench, tint: navy },
  { id: 'counseling', group: 'learn', solid: true, key: 'mod.counseling', to: '/counseling', icon: LifeBuoy, tint: 'text-rose-600 bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300' },
  { id: 'exams', group: 'learn', solid: true, key: 'mod.exams', to: '/exams', icon: FileQuestion, tint: navy },
  { id: 'scholarships', group: 'learn', solid: true, key: 'mod.scholarships', to: '/scholarships', icon: GraduationCap, tint: navy },
  { id: 'library', group: 'learn', solid: true, key: 'mod.library', to: '/library', icon: Book, tint: navy },
  { id: 'careers', group: 'learn', solid: true, key: 'mod.careers', to: '/careers', icon: Briefcase, tint: navy },
  { id: 'sidf', group: 'learn', solid: true, key: 'mod.sidf', to: '/sidf', icon: Lightbulb, tint: 'text-amber-500 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300' },
  { id: 'class', group: 'learn', key: 'nav.joinClass', to: '/class', icon: School, tint: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-300', desc: 'Enter your teacher’s code' },
  { id: 'hostel', group: 'life', key: 'mod.hostel', to: '/hostels', icon: Home, tint: 'text-slate-600 bg-slate-100 dark:bg-white/10 dark:text-slate-300' },
  { id: 'tiffin', group: 'life', key: 'mod.tiffin', to: '/tiffin', icon: UtensilsCrossed, tint: 'text-slate-600 bg-slate-100 dark:bg-white/10 dark:text-slate-300' },
  { id: 'connect', group: 'life', key: 'mod.connect', to: '/connect', icon: Users, tint: 'text-slate-600 bg-slate-100 dark:bg-white/10 dark:text-slate-300' },
  { id: 'college', group: 'life', key: 'mod.college', to: '/colleges', icon: Building2, tint: 'text-slate-600 bg-slate-100 dark:bg-white/10 dark:text-slate-300' },
]

export const learnModules = modules.filter((m) => m.group === 'learn')
export const lifeModules = modules.filter((m) => m.group === 'life')
