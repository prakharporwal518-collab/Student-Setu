import { Avatar } from './index'
import { useAuth } from '../../context/AppContext'

/** Shared header + stat tiles for every role dashboard. */
export function DashboardShell({ title, subtitle, stats = [], actions, children }) {
  const { user } = useAuth()
  return (
    <div className="container-x py-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-brand-900 to-brand-700 p-5 text-white shadow-lift sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="flex items-center gap-4">
          <Avatar name={user?.name ?? 'Guest'} size="h-14 w-14 text-lg" className="ring-white/30" />
          <div>
            <p className="text-sm text-brand-200">{subtitle}</p>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl">{title}</h1>
          </div>
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      {stats.length > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card flex items-center gap-3 p-4">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${s.tint ?? 'bg-brand-50 text-brand-800 dark:bg-white/10 dark:text-brand-200'}`}>
                <s.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">{s.value}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {children}
    </div>
  )
}

export const statusTone = { approved: 'green', pending: 'amber', rejected: 'red' }
