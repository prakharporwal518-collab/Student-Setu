import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building, Eye, EyeOff, GraduationCap, Lightbulb, LogIn, Presentation, ShieldCheck, UserPlus, UtensilsCrossed } from 'lucide-react'
import { Logo } from '../components/ui'
import { CityArt } from '../components/ui/Illustrations'
import { demoUsers, roleHome, useAuth, useToast } from '../context/AppContext'
import { cities } from '../data/common'

const signupRoles = [
  { id: 'student', label: 'Student', icon: GraduationCap, text: 'Skill gap map, learning plan & badges' },
  { id: 'teacher', label: 'Teacher', icon: Presentation, text: 'AI lesson plans, quizzes & class insights' },
  { id: 'owner', label: 'Hostel Owner', icon: Building, text: 'List hostels, PGs or rooms' },
  { id: 'provider', label: 'Tiffin Provider', icon: UtensilsCrossed, text: 'List tiffin & mess services' },
  { id: 'mentor', label: 'Mentor', icon: Lightbulb, text: 'Guide students under SIDF' },
]

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
)

function AuthShell({ title, subtitle, children }) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <CityArt palette={['#fb923c', '#e11d48', '#1c2c7a']} landmark="gate" seed={9} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <p className="font-hand text-4xl">New City, New People, Same Dreams</p>
          <p className="mt-3 max-w-md text-brand-100">Join 50,000+ students who found stays, food, notes and mentors through Student Setu.</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="mb-6 lg:hidden"><Logo /></div>
          <h1 className="text-3xl font-extrabold">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </motion.div>
      </div>
    </div>
  )
}

function PasswordInput({ value, onChange }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input type={show ? 'text' : 'password'} required minLength={6} value={value} onChange={(e) => onChange(e.target.value)} className="input pr-10" placeholder="••••••••" autoComplete="current-password" />
      <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
    </div>
  )
}

export function Login() {
  const { login, googleLogin } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(params.get('wrong') ? `Please log in with a ${params.get('role')} account to open that page.` : '')
  const done = (u) => {
    toast(`Welcome back, ${u.name.split(' ')[0]}!`)
    navigate(params.get('next') ?? roleHome(u.role), { replace: true })
  }

  return (
    <AuthShell title={params.get('role') === 'teacher' ? 'Teacher login 👩‍🏫' : 'Welcome back 👋'} subtitle={params.get('role') === 'teacher' ? 'Log in to run classes, see your class heatmap and save lesson plans' : 'Log in to your Student Setu account'}>
      <button onClick={() => done(googleLogin(signupRoles.some((r) => r.id === params.get('role')) ? params.get('role') : 'student'))} className="btn w-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"><GoogleIcon /> Continue with Google</button>
      <div className="my-5 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200 dark:bg-white/10" /> or with email <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" /></div>
      <form onSubmit={(e) => { e.preventDefault(); try { done(login(email, password)) } catch (err) { setError(err.message) } }} className="space-y-4">
        <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@college.edu" autoComplete="email" /></div>
        <div><div className="flex justify-between"><label className="label">Password</label><button type="button" onClick={() => toast('Password reset link sent (demo).', 'info')} className="text-xs font-medium text-brand-700 dark:text-brand-300">Forgot?</button></div><PasswordInput value={password} onChange={setPassword} /></div>
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{error}</p>}
        <button className="btn-primary w-full"><LogIn className="h-4 w-4" /> Log in</button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">New here? <Link to="/signup" className="link">Create an account</Link></p>
      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-4 dark:border-white/15">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500"><ShieldCheck className="h-4 w-4" /> Demo accounts (password: demo123)</p>
        <div className="flex flex-wrap gap-2">
          {demoUsers.filter((u) => !u.hidden).map((u) => (
            <button key={u.id} onClick={() => done(login(u.email, u.password))} className="chip-off capitalize">{u.role === 'owner' ? 'Hostel owner' : u.role === 'provider' ? 'Tiffin provider' : u.role}</button>
          ))}
        </div>
      </div>
    </AuthShell>
  )
}

export function Signup() {
  const { signup, googleLogin } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [role, setRole] = useState(params.get('role') && signupRoles.some((r) => r.id === params.get('role')) ? params.get('role') : 'student')
  const [form, setForm] = useState({ name: '', email: '', password: '', city: 'bhopal' })
  const [teacher, setTeacher] = useState({ college: '', employeeId: '', subjects: '' })
  const [error, setError] = useState('')
  const done = (u) => {
    toast(`Welcome to Student Setu, ${u.name.split(' ')[0]}! 🎉`)
    navigate(roleHome(u.role), { replace: true })
  }

  return (
    <AuthShell title="Create your account" subtitle="Choose how you’ll use Student Setu">
      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {signupRoles.map((r) => (
          <button key={r.id} type="button" onClick={() => setRole(r.id)} aria-pressed={role === r.id} className={`rounded-2xl border p-3 text-left transition ${role === r.id ? 'border-brand-700 bg-brand-50 ring-2 ring-brand-200 dark:border-brand-400 dark:bg-brand-500/10 dark:ring-brand-500/30' : 'border-slate-200 hover:border-brand-300 dark:border-white/10'}`}>
            <r.icon className={`h-5 w-5 ${role === r.id ? 'text-brand-800 dark:text-brand-200' : 'text-slate-400'}`} />
            <p className="mt-1.5 text-sm font-bold text-slate-800 dark:text-white">{r.label}</p>
            <p className="text-[11px] leading-snug text-slate-500">{r.text}</p>
          </button>
        ))}
      </div>
      <button onClick={() => done(googleLogin(role))} className="btn w-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"><GoogleIcon /> Sign up with Google</button>
      <div className="my-5 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200 dark:bg-white/10" /> or with email <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" /></div>
      <form onSubmit={(e) => { e.preventDefault(); try { done(signup({ ...form, role, ...(role === 'teacher' ? { teacherProfile: { college: teacher.college.trim(), employeeId: teacher.employeeId.trim(), subjects: teacher.subjects.trim() } } : {}) })) } catch (err) { setError(err.message) } }} className="space-y-4">
        <div><label className="label">Full name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" autoComplete="name" /></div>
        <div><label className="label">Email</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" autoComplete="email" /></div>
        {role === 'teacher' && (
          <fieldset className="space-y-3 rounded-2xl bg-brand-50 p-4 dark:bg-white/5">
            <legend className="sr-only">Teacher verification details</legend>
            <p className="flex items-start gap-2 text-xs text-brand-900 dark:text-brand-100"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /> We verify every teacher before they can run classes for students. Usually within 24 hours.</p>
            <div><label className="label" htmlFor="t-college">College / institute</label><input id="t-college" required value={teacher.college} onChange={(e) => setTeacher({ ...teacher, college: e.target.value })} className="input" placeholder="e.g. Govt. Polytechnic, Bhopal" /></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className="label" htmlFor="t-emp">Employee / faculty ID</label><input id="t-emp" required value={teacher.employeeId} onChange={(e) => setTeacher({ ...teacher, employeeId: e.target.value })} className="input" placeholder="As on your college ID card" /></div>
              <div><label className="label" htmlFor="t-sub">Subjects you teach</label><input id="t-sub" required value={teacher.subjects} onChange={(e) => setTeacher({ ...teacher, subjects: e.target.value })} className="input" placeholder="DBMS, Data Structures" /></div>
            </div>
          </fieldset>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Password</label><PasswordInput value={form.password} onChange={(password) => setForm({ ...form, password })} /></div>
          <div><label className="label">City</label><select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input select-arrow">{cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        </div>
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{error}</p>}
        <label className="flex items-start gap-2 text-xs text-slate-500"><input type="checkbox" required className="checkbox mt-0.5" /> I agree to the <Link to="/terms" className="link">Terms</Link> and <Link to="/privacy" className="link">Privacy Policy</Link>.</label>
        <button className="btn-accent w-full"><UserPlus className="h-4 w-4" /> Create account</button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">Already have an account? <Link to="/login" className="link">Log in</Link></p>
    </AuthShell>
  )
}
