import { useState } from 'react'
import { Eye, IndianRupee, Pencil, Plus, Soup, Star, Trash2, Truck, UtensilsCrossed } from 'lucide-react'
import { Badge, EmptyState, Modal, SmartImage } from '../components/ui'
import { DashboardShell, statusTone } from '../components/ui/Dashboard'
import { useData } from '../context/DataContext'
import { useAuth, useToast } from '../context/AppContext'
import { cities, formatINR } from '../data/common'
import { foodTypeLabel } from '../data/tiffins'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const empty = {
  name: '', city: 'bhopal', area: '', foodType: 'veg', monthly: 2800, perMeal: 60, mealsPerDay: 2, deliveryAreas: [], trial: true,
  timings: { lunch: '12:30 – 2:00 PM', dinner: '8:00 – 9:30 PM' }, speciality: '', contact: '', menu: Object.fromEntries(days.map((d) => [d, ''])),
}

function TiffinForm({ initial, onSubmit, onCancel }) {
  const { user } = useAuth()
  const [f, setF] = useState(() => ({ ...empty, provider: user?.name, ...initial, menu: { ...empty.menu, ...(initial?.menu ?? {}) }, areasText: (initial?.deliveryAreas ?? []).join(', ') }))
  const set = (patch) => setF((c) => ({ ...c, ...patch }))
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        const { areasText, ...rest } = f
        onSubmit({ ...rest, monthly: +f.monthly, perMeal: +f.perMeal, mealsPerDay: +f.mealsPerDay, deliveryAreas: areasText.split(',').map((s) => s.trim()).filter(Boolean) })
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2"><label className="label">Service name *</label><input required className="input" value={f.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Maa Ki Rasoi" /></div>
        <div><label className="label">City</label><select className="input select-arrow" value={f.city} onChange={(e) => set({ city: e.target.value })}>{cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div><label className="label">Kitchen area *</label><input required className="input" value={f.area} onChange={(e) => set({ area: e.target.value })} /></div>
        <div><label className="label">Food type</label><select className="input select-arrow" value={f.foodType} onChange={(e) => set({ foodType: e.target.value })}>{Object.entries(foodTypeLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
        <div><label className="label">Meals per day</label><select className="input select-arrow" value={f.mealsPerDay} onChange={(e) => set({ mealsPerDay: e.target.value })}><option value={1}>1</option><option value={2}>2</option><option value={3}>3 (with breakfast)</option></select></div>
        <div><label className="label">Monthly price (₹) *</label><input required type="number" min="0" className="input" value={f.monthly} onChange={(e) => set({ monthly: e.target.value })} /></div>
        <div><label className="label">Per meal (₹)</label><input type="number" min="0" className="input" value={f.perMeal} onChange={(e) => set({ perMeal: e.target.value })} /></div>
        <div><label className="label">Lunch timing</label><input className="input" value={f.timings.lunch} onChange={(e) => set({ timings: { ...f.timings, lunch: e.target.value } })} /></div>
        <div><label className="label">Dinner timing</label><input className="input" value={f.timings.dinner} onChange={(e) => set({ timings: { ...f.timings, dinner: e.target.value } })} /></div>
        <div className="sm:col-span-2"><label className="label">Delivery areas (comma separated) *</label><input required className="input" value={f.areasText} onChange={(e) => set({ areasText: e.target.value })} placeholder="MP Nagar, Habibganj, RGPV" /></div>
        <div><label className="label">Contact number *</label><input required type="tel" className="input" value={f.contact} onChange={(e) => set({ contact: e.target.value })} /></div>
        <div><label className="label">Speciality</label><input className="input" value={f.speciality} onChange={(e) => set({ speciality: e.target.value })} placeholder="Jain food, Sunday special…" /></div>
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="checkbox" checked={f.trial} onChange={(e) => set({ trial: e.target.checked })} /> Offer a free trial meal</label>
      <div>
        <p className="label">Weekly menu</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {days.map((d) => (
            <label key={d} className="flex items-center gap-2"><span className="w-9 text-sm font-semibold text-brand-700">{d}</span><input className="input py-2" value={f.menu[d]} onChange={(e) => set({ menu: { ...f.menu, [d]: e.target.value } })} placeholder="Dal, sabzi, 4 roti, rice" /></label>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2"><button type="button" onClick={onCancel} className="btn-ghost">Cancel</button><button className="btn-primary">{initial?.id ? 'Save changes' : 'Submit for verification'}</button></div>
    </form>
  )
}

export default function ProviderDashboard() {
  const { user } = useAuth()
  const { tiffins, tiffinActions } = useData()
  const toast = useToast()
  const [editing, setEditing] = useState(null)
  const mine = tiffins.filter((t) => t.ownerId === user.id || (user.role === 'admin' && t.ownerId))

  return (
    <DashboardShell
      title="Tiffin Provider Dashboard"
      subtitle={`Namaste, ${user.name.split(' ')[0]} 👋`}
      actions={<button onClick={() => setEditing({})} className="btn-accent"><Plus className="h-4 w-4" /> Add service</button>}
      stats={[
        { icon: UtensilsCrossed, label: 'Your services', value: mine.length },
        { icon: Truck, label: 'Delivery areas', value: new Set(mine.flatMap((t) => t.deliveryAreas)).size },
        { icon: Star, label: 'Reviews received', value: mine.reduce((a, t) => a + t.reviewsCount, 0), tint: 'bg-saffron-50 text-saffron-600 dark:bg-saffron-500/15' },
        { icon: Eye, label: 'Enquiries (30d)', value: mine.length * 47, tint: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15' },
      ]}
    >
      {mine.length === 0 ? (
        <EmptyState icon={Soup} title="No services yet" text="List your tiffin or mess and reach thousands of students nearby." action={<button onClick={() => setEditing({})} className="btn-primary"><Plus className="h-4 w-4" /> Add your service</button>} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {mine.map((t) => (
            <div key={t.id} className="card overflow-hidden">
              <SmartImage src={t.image} alt={t.name} icon={Soup} className="aspect-[3/1] w-full" />
              <div className="p-4">
                <div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-bold">{t.name}</h3><Badge tone={statusTone[t.status]} className="capitalize">{t.status === 'pending' ? 'Pending verification' : t.status}</Badge></div>
                <p className="text-sm text-slate-500">{foodTypeLabel[t.foodType]} · {t.area} · ★ {t.rating || 'New'} ({t.reviewsCount})</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 dark:border-white/10"><IndianRupee className="h-4 w-4 text-slate-400" /><input type="number" defaultValue={t.monthly} onBlur={(e) => { if (+e.target.value !== t.monthly) { tiffinActions.update(t.id, { monthly: +e.target.value }); toast('Price updated') } }} className="w-20 bg-transparent py-1.5 text-sm font-semibold outline-none" aria-label="Monthly price" /><span className="text-xs text-slate-400">/mo</span></label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="checkbox" checked={t.trial} onChange={(e) => tiffinActions.update(t.id, { trial: e.target.checked })} /> Trial meal</label>
                  <span className="text-sm text-slate-500">{formatINR(t.perMeal)}/meal</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => setEditing(t)} className="btn-outline flex-1 py-2"><Pencil className="h-4 w-4" /> Edit menu & details</button>
                  <button onClick={() => { if (confirm(`Delete ${t.name}?`)) { tiffinActions.remove(t.id); toast('Service deleted', 'info') } }} className="btn-ghost py-2 text-rose-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? `Edit ${editing.name}` : 'Add tiffin service'} wide>
        {editing !== null && (
          <TiffinForm
            initial={editing}
            onCancel={() => setEditing(null)}
            onSubmit={(data) => {
              if (editing.id) { tiffinActions.update(editing.id, data); toast('Service updated') } else { tiffinActions.add(data, user.id); toast('Submitted! An admin will verify it shortly.') }
              setEditing(null)
            }}
          />
        )}
      </Modal>
    </DashboardShell>
  )
}
