import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'
import usePersistentState from '../hooks/usePersistentState'
import { translations } from '../i18n/translations'

/* ------------------------------------------------------------------ Theme */
const ThemeCtx = createContext(null)
export const useTheme = () => useContext(ThemeCtx)

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => (document.documentElement.classList.contains('dark') ? 'dark' : 'light'))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem('ss-theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])
  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>
}

/* -------------------------------------------------- Lite mode + offline */
// Lite mode = data saver for slow or expensive mobile data: no photos, no animations.
const LiteCtx = createContext(null)
export const useLite = () => useContext(LiteCtx)

function LiteProvider({ children }) {
  const [lite, setLite] = usePersistentState('ss-lite', false)
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine))
  useEffect(() => {
    document.documentElement.classList.toggle('lite', lite)
  }, [lite])
  useEffect(() => {
    const up = () => setOnline(true)
    const down = () => setOnline(false)
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    return () => {
      window.removeEventListener('online', up)
      window.removeEventListener('offline', down)
    }
  }, [])
  const toggleLite = useCallback(() => setLite((v) => !v), [setLite])
  return (
    <LiteCtx.Provider value={{ lite, toggleLite, online }}>
      <MotionConfig reducedMotion={lite ? 'always' : 'user'}>{children}</MotionConfig>
    </LiteCtx.Provider>
  )
}

/* --------------------------------------------------------------- Language */
const LangCtx = createContext(null)
export const useLang = () => useContext(LangCtx)

function LangProvider({ children }) {
  const [lang, setLang] = usePersistentState('ss-lang', 'en')
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  const t = useCallback((key) => translations[lang]?.[key] ?? translations.en[key] ?? key, [lang])
  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>
}

/* ------------------------------------------------------------------ Toast */
const ToastCtx = createContext(null)
export const useToast = () => useContext(ToastCtx)

const toastIcons = { success: CheckCircle2, info: Info, warning: AlertTriangle }

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const dismiss = useCallback((id) => setToasts((ts) => ts.filter((x) => x.id !== id)), [])
  const toast = useCallback(
    (message, type = 'success') => {
      const id = Math.random().toString(36).slice(2)
      setToasts((ts) => [...ts.slice(-2), { id, message, type }])
      setTimeout(() => dismiss(id), 3500)
    },
    [dismiss],
  )
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6">
        <AnimatePresence>
          {toasts.map(({ id, message, type }) => {
            const Icon = toastIcons[type] ?? Info
            return (
              <motion.div
                key={id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="pointer-events-auto flex max-w-md items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lift dark:bg-white dark:text-slate-900"
                role="status"
              >
                <Icon className={`h-5 w-5 shrink-0 ${type === 'warning' ? 'text-amber-400' : type === 'info' ? 'text-sky-400' : 'text-emerald-400'}`} />
                <span>{message}</span>
                <button onClick={() => dismiss(id)} className="ml-1 opacity-60 hover:opacity-100" aria-label="Dismiss">
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}

/* ------------------------------------------------------------------- Auth */
// Mock auth for the demo — replace with Firebase/Supabase/your API (see src/services/api.js).
const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export const roles = [
  { id: 'student', label: 'Student', home: '/dashboard' },
  { id: 'owner', label: 'Hostel Owner', home: '/owner' },
  { id: 'provider', label: 'Tiffin Provider', home: '/provider' },
  { id: 'teacher', label: 'Teacher', home: '/teacher' },
  { id: 'mentor', label: 'Mentor', home: '/mentor' },
  { id: 'admin', label: 'Admin', home: '/admin' },
]
export const roleHome = (role) => roles.find((r) => r.id === role)?.home ?? '/'
/** Students land on the page that fits their stage: school → pathways, graduate → matched jobs. */
export const homeFor = (u) => (u?.role === 'student' && u.stage === 'school' ? '/pathways' : u?.role === 'student' && u.stage === 'graduate' ? '/careers' : roleHome(u?.role))
export const studentStages = [
  { id: 'school', label: 'School student', text: 'Class 9–12: courses & entrance exams' },
  { id: 'college', label: 'College student', text: 'Skill gap, plan & verified badges' },
  { id: 'graduate', label: 'Graduate', text: 'Jobs matched to my degree & skills' },
]

const daysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString()

// `hidden` demo users don't get a one-click button on the login page (they exist so the
// admin has teacher applications to review).
export const demoUsers = [
  { id: 'u-school', label: 'School student', name: 'Rohan Verma', email: 'school@demo.in', password: 'demo123', role: 'student', stage: 'school', city: 'bhopal' },
  { id: 'u-student', label: 'College student', name: 'Ananya Sharma', email: 'student@demo.in', password: 'demo123', role: 'student', stage: 'college', city: 'bhopal', college: 'rgpv' },
  { id: 'u-graduate', label: 'Graduate', name: 'Vikram Rao', email: 'graduate@demo.in', password: 'demo123', role: 'student', stage: 'graduate', city: 'indore' },
  { id: 'u-owner', name: 'Ramesh Yadav', email: 'owner@demo.in', password: 'demo123', role: 'owner', city: 'bhopal' },
  { id: 'u-provider', name: 'Kamla Devi', email: 'provider@demo.in', password: 'demo123', role: 'provider', city: 'bhopal' },
  {
    id: 'u-teacher', name: 'Prof. Meena Joshi', email: 'teacher@demo.in', password: 'demo123', role: 'teacher', city: 'bhopal',
    teacherProfile: { college: 'Govt. Motilal Vigyan Mahavidyalaya, Bhopal', employeeId: 'MVM-2041', subjects: 'DBMS, Data Structures', status: 'verified', submittedAt: daysAgo(30), reviewedAt: daysAgo(29) },
  },
  { id: 'u-mentor', name: 'Dr. Kavita Rao', email: 'mentor@demo.in', password: 'demo123', role: 'mentor', city: 'bhopal' },
  { id: 'u-admin', name: 'Admin', email: 'admin@demo.in', password: 'demo123', role: 'admin', city: 'bhopal' },
  {
    id: 'u-teacher-2', hidden: true, name: 'Rakesh Verma', email: 'rakesh.verma@demo.in', password: 'demo123', role: 'teacher', city: 'lucknow',
    teacherProfile: { college: 'Govt. Polytechnic, Lucknow', employeeId: 'GPL-1187', subjects: 'Electrical Engineering, Basic Electronics', status: 'pending', submittedAt: daysAgo(1) },
  },
  {
    id: 'u-teacher-3', hidden: true, name: 'Sunita Iyer', email: 'sunita.iyer@demo.in', password: 'demo123', role: 'teacher', city: 'indore',
    teacherProfile: { college: 'Holkar Science College, Indore', employeeId: 'HSC-0932', subjects: 'Mathematics, Statistics', status: 'pending', submittedAt: daysAgo(2) },
  },
]

/** Teacher verification: 'incomplete' → 'pending' → 'verified' | 'rejected'. Admins count as verified. */
export const teacherStatus = (u) => (u?.role === 'admin' ? 'verified' : u?.role === 'teacher' ? u.teacherProfile?.status ?? 'incomplete' : null)

function AuthProvider({ children }) {
  const [users, setUsers] = usePersistentState('ss-users', demoUsers)
  const [user, setUser] = usePersistentState('ss-user', null)

  // Older visitors: add any new demo accounts / fields (stored values win).
  useEffect(() => {
    setUsers((us) => {
      const merged = us.map((u) => {
        const d = demoUsers.find((x) => x.id === u.id)
        return d ? { ...d, ...u, teacherProfile: u.teacherProfile ?? d.teacherProfile } : u
      })
      return [...merged, ...demoUsers.filter((d) => !us.some((u) => u.id === d.id))]
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the signed-in session in sync with the account list (e.g. after an admin approves a teacher).
  useEffect(() => {
    if (!user) return
    const fresh = users.find((u) => u.id === user.id)
    if (fresh && JSON.stringify(fresh) !== JSON.stringify(user)) setUser(fresh)
  }, [users]) // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(
    (email, password) => {
      const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
      if (!found || found.password !== password) throw new Error('Invalid email or password')
      setUser(found)
      return found
    },
    [users, setUser],
  )

  const signup = useCallback(
    ({ name, email, password, role, city, teacherProfile, stage }) => {
      if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) throw new Error('An account with this email already exists')
      const nu = { id: 'u-' + Date.now(), name, email: email.trim(), password, role, city }
      if (role === 'student') nu.stage = stage ?? 'college'
      if (role === 'teacher') nu.teacherProfile = { ...teacherProfile, status: 'pending', submittedAt: new Date().toISOString() }
      setUsers((us) => [...us, nu])
      setUser(nu)
      return nu
    },
    [users, setUsers, setUser],
  )

  const googleLogin = useCallback(
    (role = 'student') => {
      const existing = users.find((u) => u.id === 'u-google-' + role)
      const nu = existing ?? { id: 'u-google-' + role, name: 'Google User', email: `google.${role}@gmail.com`, role, city: 'bhopal', google: true, ...(role === 'teacher' ? { teacherProfile: { status: 'incomplete' } } : {}) }
      if (!existing) setUsers((us) => [...us, nu])
      setUser(nu)
      return nu
    },
    [users, setUsers, setUser],
  )

  /** Update any account (used by teachers completing their profile and admins verifying them). */
  const updateUser = useCallback(
    (id, patch) => {
      setUsers((us) => us.map((u) => (u.id === id ? { ...u, ...(typeof patch === 'function' ? patch(u) : patch) } : u)))
    },
    [setUsers],
  )

  const logout = useCallback(() => setUser(null), [setUser])

  return <AuthCtx.Provider value={{ user, users, login, signup, googleLogin, updateUser, logout }}>{children}</AuthCtx.Provider>
}

/* ----------------------------------------------------------------- Root */
export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <LiteProvider>
        <LangProvider>
          <ToastProvider>
            <AuthProvider>{children}</AuthProvider>
          </ToastProvider>
        </LangProvider>
      </LiteProvider>
    </ThemeProvider>
  )
}
