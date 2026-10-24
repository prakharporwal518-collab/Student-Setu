import { Link } from 'react-router-dom'
import { Instagram, Linkedin, Send, Youtube } from 'lucide-react'
import { useLang, useTheme } from '../../context/AppContext'

const XIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2H21.5l-7.5 8.57L22.75 22h-6.86l-5.37-7.02L4.4 22H1.14l8.02-9.17L.75 2h7.03l4.85 6.41L18.24 2Zm-1.2 18h1.9L7.04 3.9H5.01L17.04 20Z" />
  </svg>
)

// Social handles are placeholders until official accounts are created.
const socials = [
  { label: 'Instagram', icon: Instagram, href: '#' },
  { label: 'YouTube', icon: Youtube, href: '#' },
  { label: 'LinkedIn', icon: Linkedin, href: '#' },
  { label: 'X (Twitter)', icon: XIcon, href: '#' },
  { label: 'Telegram', icon: Send, href: '#' },
]

export default function Footer() {
  const { t } = useLang()
  const { theme, toggle } = useTheme()
  const cols = [
    {
      title: t('footer.quick'),
      links: [
        ['/', t('nav.home')],
        ['/hostels', t('nav.hostels')],
        ['/tiffin', t('nav.tiffin')],
        ['/colleges', t('mod.college')],
        ['/connect', t('nav.connect')],
      ],
    },
    {
      title: t('footer.resources'),
      links: [
        ['/resources', t('nav.resources')],
        ['/skills', t('nav.skills')],
        ['/careers', t('nav.careers')],
        ['/exams', t('nav.exams')],
        ['/scholarships', t('nav.scholarships')],
        ['/library', t('nav.library')],
      ],
    },
    {
      title: t('footer.support'),
      links: [
        ['/faq', t('nav.faq')],
        ['/help', t('nav.help')],
        ['/about', t('nav.about')],
        ['/sidf', 'SIDF'],
        ['/owner', 'List your property'],
        ['/provider', 'List your tiffin service'],
      ],
    },
  ]

  return (
    <footer className="relative mt-auto overflow-hidden bg-brand-950 text-slate-300">
      <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-saffron-500/10 blur-3xl" />
      <div className="container-x relative grid grid-cols-2 gap-8 py-10 sm:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/10">
              <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
                <path d="M32 12 6 24l26 12 22-10.2V40h4V24L32 12Z" fill="#fff" />
                <path d="M17 32v9c0 4.4 6.7 8 15 8s15-3.6 15-8v-9l-15 6.8L17 32Z" fill="#f97316" />
              </svg>
            </span>
            <span>
              <span className="block font-display text-2xl font-extrabold text-white">
                Student <span className="text-saffron-400">Setu</span>
              </span>
              <span className="text-xs text-slate-400">{t('tagline')}</span>
            </span>
          </Link>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="mb-3 text-sm font-semibold text-white">{c.title}</h4>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              {c.links.map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-slate-400 transition hover:text-saffron-400">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">{t('footer.follow')}</h4>
          <div className="flex flex-wrap gap-1 lg:flex-nowrap">
            {socials.map(({ label, icon: Icon, href }) => (
              <a key={label} href={href} aria-label={label} className="grid h-9 w-9 place-items-center rounded-full text-white transition hover:-translate-y-0.5 hover:bg-saffron-500">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-4 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Student Setu. {t('footer.rights')}</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-white">{t('footer.privacy')}</Link>
            <span className="opacity-30">|</span>
            <Link to="/terms" className="hover:text-white">{t('footer.terms')}</Link>
            <span className="opacity-30">|</span>
            <label className="flex cursor-pointer items-center gap-2">
              {t('footer.dark')}
              <button type="button" role="switch" aria-checked={theme === 'dark'} onClick={toggle} className={`relative h-5 w-9 rounded-full transition ${theme === 'dark' ? 'bg-saffron-500' : 'bg-white/20'}`}>
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${theme === 'dark' ? 'left-[18px]' : 'left-0.5'}`} />
              </button>
            </label>
          </div>
        </div>
      </div>
    </footer>
  )
}
