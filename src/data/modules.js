import { Book, Home, UtensilsCrossed, Building2, BookOpen, Briefcase, GraduationCap, Lightbulb, Users, FileQuestion, PlayCircle } from 'lucide-react'

// One registry for every module — used by the home cards, the navbar "More" menu and the footer.
// `solid` draws the icon filled (home page style); `badge` paints a coloured circle behind a white icon.
export const modules = [
  { id: 'hostel', solid: true, key: 'mod.hostel', to: '/hostels', icon: Home, tint: 'text-brand-800 bg-brand-50 dark:bg-brand-500/15 dark:text-brand-200' },
  { id: 'tiffin', badge: 'bg-gradient-to-br from-saffron-400 to-saffron-600 text-white', key: 'mod.tiffin', to: '/tiffin', icon: UtensilsCrossed, tint: 'text-saffron-600 bg-saffron-50 dark:bg-saffron-500/15 dark:text-saffron-300' },
  { id: 'college', solid: true, key: 'mod.college', to: '/colleges', icon: Building2, tint: 'text-brand-800 bg-brand-50 dark:bg-brand-500/15 dark:text-brand-200' },
  { id: 'resources', solid: true, key: 'mod.resources', to: '/resources', icon: BookOpen, tint: 'text-brand-800 bg-brand-50 dark:bg-brand-500/15 dark:text-brand-200' },
  { id: 'careers', solid: true, key: 'mod.careers', to: '/careers', icon: Briefcase, tint: 'text-brand-800 bg-brand-50 dark:bg-brand-500/15 dark:text-brand-200' },
  { id: 'scholarships', solid: true, key: 'mod.scholarships', to: '/scholarships', icon: GraduationCap, tint: 'text-brand-800 bg-brand-50 dark:bg-brand-500/15 dark:text-brand-200' },
  { id: 'library', solid: true, key: 'mod.library', to: '/library', icon: Book, tint: 'text-brand-800 bg-brand-50 dark:bg-brand-500/15 dark:text-brand-200' },
  { id: 'sidf', solid: true, key: 'mod.sidf', to: '/sidf', icon: Lightbulb, tint: 'text-amber-500 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300' },
  { id: 'connect', key: 'mod.connect', to: '/connect', icon: Users, tint: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-300' },
  { id: 'exams', key: 'mod.exams', to: '/exams', icon: FileQuestion, tint: 'text-violet-600 bg-violet-50 dark:bg-violet-500/15 dark:text-violet-300' },
  { id: 'skills', key: 'mod.skills', to: '/skills', icon: PlayCircle, tint: 'text-rose-600 bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300' },
]
