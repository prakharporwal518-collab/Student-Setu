import { ArrowDown, Bot, Cloud, Database, Globe, KeyRound, Layers, Lock, MonitorSmartphone, Rocket, Server, ShieldCheck, Smartphone, Sparkles, Users, Zap } from 'lucide-react'
import { PageHeader, SectionHeader } from '../components/ui'

const Box = ({ icon: Icon, title, items, tone }) => (
  <div className={`rounded-2xl border p-4 ${tone}`}>
    <p className="flex items-center gap-2 font-bold"><Icon className="h-5 w-5" /> {title}</p>
    <ul className="mt-2 space-y-1 text-sm">{items.map((i) => <li key={i}>• {i}</li>)}</ul>
  </div>
)
const Arrow = ({ label }) => (
  <div className="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-400">
    <ArrowDown className="h-5 w-5 text-brand-400" /> {label}
  </div>
)

const blue = 'border-brand-200 bg-brand-50 text-brand-900 dark:border-brand-400/20 dark:bg-brand-500/10 dark:text-brand-100'
const saffron = 'border-saffron-200 bg-saffron-50 text-saffron-900 dark:border-saffron-400/20 dark:bg-saffron-500/10 dark:text-saffron-100'
const green = 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-100'
const violet = 'border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-400/20 dark:bg-violet-500/10 dark:text-violet-100'

export default function Architecture() {
  return (
    <>
      <PageHeader icon={Layers} kicker="Tech stack & system architecture" title="Built to scale — and to work on a budget phone" subtitle="A serverless architecture: fast on slow networks, cheap to run, and able to grow from one college to the whole country." crumbs={[{ label: 'Architecture' }]} />
      <div className="container-x py-8">
        <div className="mx-auto max-w-4xl">
          <Box icon={Users} title="Users" tone="border-slate-200 bg-white dark:border-white/10 dark:bg-ink-900" items={['School students · College students · Graduates', 'Teachers · Mentors · Hostel owners · Tiffin providers · Admins']} />
          <Arrow label="Any phone or laptop browser — no app download" />
          <div className="grid gap-3 md:grid-cols-2">
            <Box icon={MonitorSmartphone} title="Frontend · Progressive Web App" tone={blue} items={['React 18 + Vite (code-split pages)', 'Tailwind CSS · Framer Motion', 'Hindi / English · Lite mode for 2G/3G', 'Service worker: works offline, installable', 'Web Speech API: listen-aloud']} />
            <Box icon={Globe} title="Netlify global CDN" tone={blue} items={['Static files served from the nearest edge', 'HTTPS everywhere, automatic deploys from GitHub', 'Caching headers for repeat visits']} />
          </div>
          <Arrow label="Secure API calls (JSON over HTTPS)" />
          <Box icon={Server} title="Serverless backend · Netlify Functions (Node.js)" tone={saffron} items={['copilot — lesson plans, papers, quizzes, AI coach', 'badge — grades skill tests & signs badges', 'classroom — classes, quizzes, submissions, heatmap', 'chat — Setu Saathi help assistant', 'Auto-scales with traffic; pay only for use']} />
          <Arrow label="Server-side only — keys never reach the browser" />
          <div className="grid gap-3 md:grid-cols-3">
            <Box icon={Bot} title="Google Gemini AI" tone={violet} items={['Gemini 2.5 Flash, JSON mode', 'Template fallback if AI is busy']} />
            <Box icon={Database} title="Netlify Blobs" tone={green} items={['Class quizzes, notes & results', 'Strongly consistent key-value store']} />
            <Box icon={Smartphone} title="On-device storage" tone={green} items={['Profiles, progress & leaderboard (demo)', 'Works offline']} />
          </div>
        </div>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            [ShieldCheck, 'Tamper-proof badges', 'Answer keys stay on the server; every badge is signed with HMAC-SHA256 and can be verified by anyone.'],
            [KeyRound, 'Secrets stay secret', 'Gemini and signing keys live only in server environment variables.'],
            [Zap, 'Fast on slow networks', 'Code-split pages, Lite mode and offline caching keep data use low.'],
          ].map(([Icon, t, d]) => (
            <div key={t} className="card p-5"><Icon className="h-6 w-6 text-brand-700 dark:text-brand-300" /><p className="mt-2 font-bold">{t}</p><p className="mt-1 text-sm text-slate-500">{d}</p></div>
          ))}
        </section>

        <section className="mt-12">
          <SectionHeader icon={Rocket} title="Path to millions of users" subtitle="What changes when we move from prototype to national scale" />
          <div className="grid gap-3 md:grid-cols-2">
            {[
              [Lock, 'Real accounts', 'Managed authentication (e.g. Supabase or Firebase) with OTP login.'],
              [Database, 'Central database', 'PostgreSQL for profiles, progress, listings and teacher verification, with geo-search for hostels & tiffin.'],
              [Cloud, 'Content storage', 'Object storage + CDN for university lecture videos and notes.'],
              [Sparkles, 'Recommendations', 'Job and course matching computed on the server from verified skills.'],
            ].map(([Icon, t, d]) => (
              <div key={t} className="flex gap-3 rounded-2xl border border-dashed border-slate-300 p-4 dark:border-white/15"><Icon className="h-5 w-5 shrink-0 text-saffron-500" /><div><p className="font-semibold">{t}</p><p className="text-sm text-slate-500">{d}</p></div></div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
