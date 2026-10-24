import { Link } from 'react-router-dom'
import { Building, Home, ShieldCheck, PiggyBank, Landmark } from 'lucide-react'
import HostelFinder from '../components/hostel/HostelFinder'
import { PageHeader } from '../components/ui'

const perks = [
  { icon: ShieldCheck, title: 'Verified listings', text: 'Owners submit documents; our team and local students verify.' },
  { icon: Landmark, title: 'Government hostels too', text: 'We list post-matric & welfare department hostels most students never hear about.' },
  { icon: PiggyBank, title: 'Save on fees', text: 'Compare with expensive private-college hostel fees before you decide.' },
]

export default function Hostels() {
  return (
    <>
      <PageHeader icon={Home} kicker="Hostel & Stay Finder" title="Find your home away from home" subtitle="College hostels, government hostels, private hostels, PGs and rent rooms — filtered by budget, gender, food, AC and distance from your college." crumbs={[{ label: 'Hostels & Stay' }]}>
        <Link to="/owner" className="btn-accent shrink-0">
          <Building className="h-4 w-4" /> List your property
        </Link>
      </PageHeader>
      <div className="container-x py-8">
        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          {perks.map((p) => (
            <div key={p.title} className="card flex items-start gap-3 p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-800 dark:bg-white/10 dark:text-brand-200">
                <p.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{p.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
        <HostelFinder syncUrl />
      </div>
    </>
  )
}
