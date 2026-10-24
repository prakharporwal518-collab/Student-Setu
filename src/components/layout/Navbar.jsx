import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, LayoutDashboard, LogOut, Menu, Moon, Search, Sun, X, Info, LifeBuoy, HelpCircle } from 'lucide-react'
import { Avatar, Logo } from '../ui'
import { roleHome, useAuth, useLang, useTheme } from '../../context/AppContext'
import { modules } from '../../data/modules'
import SearchPalette from './SearchPalette'

const mainLinks = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/hostels', key: 'nav.hostels' },
  { to: '/tiffin', key: 'nav.tiffin' },
  { to: '/colleges', key: 'nav.colleges' },
  { to: '/resources', key: 'nav.resources' },
]
const moreModules = modules.filter((m) => !['hostel', 'tiffin', 'college', 'resources'].includes(m.id))
const extraLinks = [
  { to: '/about', key: 'nav.about', icon: Info },
  { to: '/help', key: 'nav.help', icon: LifeBuoy },
  { to: '/faq', key: 'nav.faq', icon: HelpCircle },
]

export function LangToggle({ className = '' }) {
  const { lang, setLang } = useLang()
  return (
    <div className={`flex items-center rounded-full bg-slate-100 p-0.5 text-xs font-semibold dark:bg-white/10 ${className}`} role="group" aria-label="Language">
      {[
        ['en', 'EN'],
        ['hi', 'हिंदी'],
      ].map(([code, label]) => (
        <button key={code} onClick={() => setLang(code)} aria-pressed={lang === code} className={`rounded-full px-2.5 py-1 transition ${lang === code ? 'bg-brand-800 text-white shadow dark:bg-brand-500' : 'text-slate-600 hover:text-brand-800 dark:text-slate-300'}`}>
          {label}
        </button>
      ))}
    </div>
  )
}

export function ThemeToggle({ className = '' }) {
  const { theme, toggle } = useTheme()
  return (
    <button onClick={toggle} className={`grid h-9 w-9 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 ${className}`} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
      <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>
        {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </motion.span>
    </button>
  )
}

const linkClass = ({ isActive }) =>
  `relative whitespace-nowrap px-1 py-5 text-sm font-medium transition after:absolute after:inset-x-1 after:bottom-3 after:h-0.5 after:rounded-full after:transition ${
    isActive ? 'text-brand-800 after:bg-brand-800 dark:text-white dark:after:bg-saffron-400' : 'text-slate-600 after:bg-transparent hover:text-brand-800 dark:text-slate-300 dark:hover:text-white'
  }`

export default function Navbar() {
  const { t } = useLang()
  const { user, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const moreRef = useRef(null)
  const userRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMoreOpen(false)
    setMobileOpen(false)
    setUserOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    const onClick = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false)
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false)
    }
    const onOpenSearch = () => setSearchOpen(true)
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    window.addEventListener('ss:open-search', onOpenSearch)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
      window.removeEventListener('ss:open-search', onOpenSearch)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
  }, [mobileOpen])

  const moreActive = moreModules.some((m) => location.pathname.startsWith(m.to)) || extraLinks.some((l) => location.pathname.startsWith(l.to))

  return (
    <>
      <header className={`sticky top-0 z-50 border-b transition ${scrolled ? 'border-slate-200/80 bg-white/90 shadow-soft backdrop-blur-lg dark:border-white/10 dark:bg-ink-950/85' : 'border-transparent bg-white dark:bg-ink-950'}`}>
        <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-[72px]">
          <Logo />

          <nav className="hidden items-center gap-5 xl:flex" aria-label="Main">
            {mainLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                {t(l.key)}
              </NavLink>
            ))}
            <div className="relative" ref={moreRef}>
              <button onClick={() => setMoreOpen((o) => !o)} aria-expanded={moreOpen} className={`${linkClass({ isActive: moreActive })} flex items-center gap-1`}>
                {t('nav.more')} <ChevronDown className={`h-4 w-4 transition ${moreOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {moreOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-full w-[520px] rounded-2xl border border-slate-200 bg-white p-3 shadow-lift dark:border-white/10 dark:bg-ink-900">
                    <div className="grid grid-cols-2 gap-1">
                      {moreModules.map((m) => (
                        <Link key={m.id} to={m.to} className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-slate-50 dark:hover:bg-white/5">
                          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${m.tint}`}>
                            <m.icon className="h-5 w-5" />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-slate-800 dark:text-white">{t(m.key)}</span>
                            <span className="block text-xs text-slate-500 dark:text-slate-400">{t(m.key + '.d')}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-1 border-t border-slate-100 pt-2 dark:border-white/10">
                      {extraLinks.map((l) => (
                        <Link key={l.to} to={l.to} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5">
                          <l.icon className="h-4 w-4" /> {t(l.key)}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <LangToggle className="hidden sm:flex" />
            <ThemeToggle className="hidden sm:grid" />
            <button onClick={() => setSearchOpen(true)} className="group flex h-9 items-center gap-2 rounded-full px-2.5 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10" aria-label="Search (Ctrl+K)">
              <Search className="h-5 w-5" />
              <kbd className="hidden whitespace-nowrap rounded border border-slate-200 px-1.5 text-[10px] font-semibold text-slate-400 dark:border-white/10 2xl:inline">Ctrl K</kbd>
            </button>
            {user ? (
              <div className="relative" ref={userRef}>
                <button onClick={() => setUserOpen((o) => !o)} className="flex items-center gap-2 rounded-full p-0.5 pr-2 hover:bg-slate-100 dark:hover:bg-white/10" aria-label="Account menu" aria-expanded={userOpen}>
                  <Avatar name={user.name} size="h-9 w-9 text-sm" />
                  <ChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />
                </button>
                <AnimatePresence>
                  {userOpen && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-lift dark:border-white/10 dark:bg-ink-900">
                      <div className="px-3 py-2">
                        <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">{user.name}</p>
                        <p className="truncate text-xs capitalize text-slate-500">{user.role === 'owner' ? 'Hostel owner' : user.role === 'provider' ? 'Tiffin provider' : user.role}</p>
                      </div>
                      <Link to={roleHome(user.role)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/5">
                        <LayoutDashboard className="h-4 w-4" /> {t('nav.dashboard')}
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          navigate('/')
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                      >
                        <LogOut className="h-4 w-4" /> {t('nav.logout')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link to="/login" className="btn-outline whitespace-nowrap px-4 py-2">
                  {t('nav.login')}
                </Link>
                <Link to="/signup" className="btn-accent whitespace-nowrap px-4 py-2">
                  {t('nav.signup')}
                </Link>
              </div>
            )}
            <button onClick={() => setMobileOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10 xl:hidden" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[80] xl:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col overflow-y-auto bg-white p-5 dark:bg-ink-900">
              <div className="mb-6 flex items-center justify-between">
                <Logo compact />
                <button onClick={() => setMobileOpen(false)} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-white/10" aria-label="Close menu">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="mb-5 flex items-center justify-between">
                <LangToggle />
                <ThemeToggle />
              </div>
              <nav className="flex flex-col gap-1" aria-label="Mobile">
                {mainLinks.map((l) => (
                  <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? 'bg-brand-50 text-brand-800 dark:bg-white/10 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                    {t(l.key)}
                  </NavLink>
                ))}
              </nav>
              <p className="mb-2 mt-5 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{t('nav.more')}</p>
              <div className="grid grid-cols-2 gap-2">
                {moreModules.map((m) => (
                  <Link key={m.id} to={m.to} className="flex items-center gap-2 rounded-xl border border-slate-100 p-2.5 text-xs font-semibold text-slate-700 dark:border-white/10 dark:text-slate-200">
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${m.tint}`}>
                      <m.icon className="h-4 w-4" />
                    </span>
                    {t(m.key)}
                  </Link>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-1">
                {extraLinks.map((l) => (
                  <Link key={l.to} to={l.to} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 dark:text-slate-300">
                    <l.icon className="h-4 w-4" /> {t(l.key)}
                  </Link>
                ))}
              </div>
              {!user && (
                <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
                  <Link to="/login" className="btn-outline">
                    {t('nav.login')}
                  </Link>
                  <Link to="/signup" className="btn-accent">
                    {t('nav.signup')}
                  </Link>
                </div>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
