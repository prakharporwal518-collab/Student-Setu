import { Suspense, useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ChatWidget from './ChatWidget'
import { WifiOff } from 'lucide-react'
import { useAuth, useLang, useLite } from '../../context/AppContext'

export function PageLoader() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-saffron-500" role="status" aria-label="Loading" />
    </div>
  )
}

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // lazy pages may still be loading — retry for a short while
      let tries = 0
      const t = setInterval(() => {
        const el = document.getElementById(hash.slice(1))
        if (el || ++tries > 20) {
          clearInterval(t)
          el?.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
      return () => clearInterval(t)
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])
  return null
}

function OfflineBanner() {
  const { online } = useLite()
  const { t } = useLang()
  if (online) return null
  return (
    <div className="flex items-center justify-center gap-2 bg-amber-400 px-4 py-1.5 text-center text-xs font-semibold text-amber-950" role="status">
      <WifiOff className="h-4 w-4" /> {t('offline.banner')}
    </div>
  )
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollManager />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <OfflineBanner />
      <Navbar />
      <main id="main" className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}

/** Guards dashboards by role. Admin can open every dashboard. */
export function RequireRole({ role, children }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}&role=${role}`} replace />
  if (role && user.role !== role && user.role !== 'admin') return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}&role=${role}&wrong=1`} replace />
  return children
}
