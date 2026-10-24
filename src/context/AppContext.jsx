import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
  { id: 'mentor', label: 'Mentor', home: '/mentor' },
  { id: 'admin', label: 'Admin', home: '/admin' },
]
export const roleHome = (role) => roles.find((r) => r.id === role)?.home ?? '/'

export const demoUsers = [
  { id: 'u-student', name: 'Ananya Sharma', email: 'student@demo.in', password: 'demo123', role: 'student', city: 'bhopal', college: 'rgpv' },
  { id: 'u-owner', name: 'Ramesh Yadav', email: 'owner@demo.in', password: 'demo123', role: 'owner', city: 'bhopal' },
  { id: 'u-provider', name: 'Kamla Devi', email: 'provider@demo.in', password: 'demo123', role: 'provider', city: 'bhopal' },
  { id: 'u-mentor', name: 'Dr. Kavita Rao', email: 'mentor@demo.in', password: 'demo123', role: 'mentor', city: 'bhopal' },
  { id: 'u-admin', name: 'Admin', email: 'admin@demo.in', password: 'demo123', role: 'admin', city: 'bhopal' },
]

function AuthProvider({ children }) {
  const [users, setUsers] = usePersistentState('ss-users', demoUsers)
  const [user, setUser] = usePersistentState('ss-user', null)

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
    ({ name, email, password, role, city }) => {
      if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) throw new Error('An account with this email already exists')
      const nu = { id: 'u-' + Date.now(), name, email: email.trim(), password, role, city }
      setUsers((us) => [...us, nu])
      setUser(nu)
      return nu
    },
    [users, setUsers, setUser],
  )

  const googleLogin = useCallback(
    (role = 'student') => {
      const nu = { id: 'u-google-' + role, name: 'Google User', email: `google.${role}@gmail.com`, role, city: 'bhopal', google: true }
      setUsers((us) => (us.some((u) => u.id === nu.id) ? us : [...us, nu]))
      setUser(nu)
      return nu
    },
    [setUsers, setUser],
  )

  const logout = useCallback(() => setUser(null), [setUser])

  return <AuthCtx.Provider value={{ user, users, login, signup, googleLogin, logout }}>{children}</AuthCtx.Provider>
}

/* ----------------------------------------------------------------- Root */
export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <LangProvider>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </LangProvider>
    </ThemeProvider>
  )
}
