import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BedDouble, Building2, Eye, IndianRupee, Minus, Pencil, Plus, Star, Trash2, Users } from 'lucide-react'
import { Badge, EmptyState, Modal, SmartImage } from '../components/ui'
import { DashboardShell, statusTone } from '../components/ui/Dashboard'
import { useData } from '../context/DataContext'
import { useAuth, useToast } from '../context/AppContext'
import { cities, formatINR } from '../data/common'
import { colleges } from '../data/colleges'
import { facilityList, hostelTypes, typeLabel } from '../data/hostels'

const empty = {
  name: '', type: 'pg', city: 'bhopal', area: '', college: '', rent: 3000, gender: 'boys', roomTypes: ['double'], ac: false, food: true,
  distanceKm: 1, seats: 10, totalSeats: 20, facilities: ['wifi'], description: '', owner: { name: '', phone: '' }, images: [], lat: 23.25, lng: 77.41,
}

export function HostelForm({ initial, onSubmit, onCancel }) {
  const { user } = useAuth()
  const [f, setF] = useState(() => ({ ...empty, ...initial, owner: { name: user?.name ?? '', phone: '', ...(initial?.owner ?? {}) } }))
  const set = (patch) => setF((c) => ({ ...c, ...patch }))
  const toggleIn = (key, v) => set({ [key]: f[key].includes(v) ? f[key].filter((x) => x !== v) : [...f[key], v] })
  const cityColleges = colleges.filter((c) => c.city === f.city)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const city = cities.find((c) => c.id === f.city)
        onSubmit({
          ...f, rent: +f.rent, seats: +f.seats, totalSeats: Math.max(+f.totalSeats, +f.seats), distanceKm: +f.distanceKm,
          college: f.college || null, tagline: f.area,
          lat: initial?.lat ?? city.lat + (Math.random() - 0.5) * 0.04, lng: initial?.lng ?? city.lng + (Math.random() - 0.5) * 0.04,
          images: f.imageUrl ? [f.imageUrl, ...(f.images ?? []).filter((i) => i !== f.imageUrl)] : f.images,
        })
      }}
      className="space-y-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Property name *</label>
          <input required value={f.name} onChange={(e) => set({ name: e.target.value })} className="input" placeholder="e.g. Shanti Girls PG" />
        </div>
        <div>
          <label className="label">Type</label>
          <select value={f.type} onChange={(e) => set({ type: e.target.value })} className="input select-arrow">
            {hostelTypes.filter((t) => t.id !== 'all').map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">For</label>
          <select value={f.gender} onChange={(e) => set({ gender: e.target.value })} className="input select-arrow">
            <option value="boys">Boys</option>
            <option value="girls">Girls</option>
            <option value="coed">Co-ed</option>
          </select>
        </div>
        <div>
          <label className="label">City</label>
          <select value={f.city} onChange={(e) => set({ city: e.target.value, college: '' })} className="input select-arrow">
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Area / locality *</label>
          <input required value={f.area} onChange={(e) => set({ area: e.target.value })} className="input" placeholder="e.g. Lalghati" />
        </div>
        <div>
          <label className="label">Nearest college</label>
          <select value={f.college ?? ''} onChange={(e) => set({ college: e.target.value })} className="input select-arrow">
            <option value="">None / not near a college</option>
            {cityColleges.map((c) => (
              <option key={c.id} value={c.id}>{c.short}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Distance from college (km)</label>
          <input type="number" min="0" step="0.1" value={f.distanceKm} onChange={(e) => set({ distanceKm: e.target.value })} className="input" />
        </div>
        <div>
          <label className="label">Rent per month (₹) *</label>
          <input required type="number" min="0" step="100" value={f.rent} onChange={(e) => set({ rent: e.target.value })} className="input" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Seats free</label>
            <input type="number" min="0" value={f.seats} onChange={(e) => set({ seats: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">Total seats</label>
            <input type="number" min="1" value={f.totalSeats} onChange={(e) => set({ totalSeats: e.target.value })} className="input" />
          </div>
        </div>
      </div>

      <div>
        <p className="label">Room types</p>
        <div className="flex flex-wrap gap-2">
          {['single', 'double', 'triple'].map((r) => (
            <button type="button" key={r} onClick={() => toggleIn('roomTypes', r)} className={`capitalize ${f.roomTypes.includes(r) ? 'chip-on' : 'chip-off'}`}>{r}</button>
          ))}
        </div>
      </div>
      <div>
        <p className="label">Facilities</p>
        <div className="flex flex-wrap gap-2">
          {facilityList.map((fc) => (
            <button type="button" key={fc.id} onClick={() => toggleIn('facilities', fc.id)} className={f.facilities.includes(fc.id) ? 'chip-on' : 'chip-off'}>{fc.label}</button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="checkbox" checked={f.ac} onChange={(e) => set({ ac: e.target.checked })} /> AC rooms</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="checkbox" checked={f.food} onChange={(e) => set({ food: e.target.checked })} /> Food included</label>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea rows={3} value={f.description} onChange={(e) => set({ description: e.target.value })} className="input" placeholder="What makes your place great for students?" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Contact name</label>
          <input value={f.owner.name} onChange={(e) => set({ owner: { ...f.owner, name: e.target.value } })} className="input" />
        </div>
        <div>
          <label className="label">Phone *</label>
          <input required type="tel" pattern="[0-9+ ]{10,15}" value={f.owner.phone} onChange={(e) => set({ owner: { ...f.owner, phone: e.target.value } })} className="input" placeholder="+91 9XXXXXXXXX" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Photo URL (optional)</label>
          <input type="url" value={f.imageUrl ?? ''} onChange={(e) => set({ imageUrl: e.target.value })} className="input" placeholder="https://…" />
          <p className="mt-1 text-xs text-slate-400">Photo uploads go to cloud storage once the backend is connected.</p>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
        <button className="btn-primary">{initial?.id ? 'Save changes' : 'Submit for verification'}</button>
      </div>
    </form>
  )
}

export default function OwnerDashboard() {
  const { user } = useAuth()
  const { hostels, hostelActions } = useData()
  const toast = useToast()
  const [editing, setEditing] = useState(null) // null | {} (new) | hostel
  const mine = hostels.filter((h) => h.ownerId === user.id || (user.role === 'admin' && h.ownerId))
  const seatsFree = mine.reduce((a, h) => a + h.seats, 0)
  const avgRating = mine.filter((h) => h.rating).reduce((a, h, _, arr) => a + h.rating / arr.length, 0)

  return (
    <DashboardShell
      title="Owner Dashboard"
      subtitle={`Namaste, ${user.name.split(' ')[0]} 👋`}
      actions={
        <button onClick={() => setEditing({})} className="btn-accent">
          <Plus className="h-4 w-4" /> Add listing
        </button>
      }
      stats={[
        { icon: Building2, label: 'Your listings', value: mine.length },
        { icon: Users, label: 'Seats available', value: seatsFree },
        { icon: Star, label: 'Average rating', value: avgRating ? avgRating.toFixed(1) : '—', tint: 'bg-saffron-50 text-saffron-600 dark:bg-saffron-500/15' },
        { icon: Eye, label: 'Profile views (30d)', value: mine.length * 312, tint: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15' },
      ]}
    >
      {mine.length === 0 ? (
        <EmptyState icon={BedDouble} title="No listings yet" text="Add your hostel, PG or room. Our team verifies it within 48 hours." action={<button onClick={() => setEditing({})} className="btn-primary"><Plus className="h-4 w-4" /> Add your first listing</button>} />
      ) : (
        <div className="space-y-4">
          {mine.map((h) => (
            <div key={h.id} className="card flex flex-col gap-4 p-4 md:flex-row md:items-center">
              <SmartImage src={h.images?.[0]} alt={h.name} icon={BedDouble} className="aspect-[16/10] w-full shrink-0 rounded-xl md:w-44" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold">{h.name}</h3>
                  <Badge tone={statusTone[h.status]} className="capitalize">{h.status === 'pending' ? 'Pending verification' : h.status}</Badge>
                </div>
                <p className="text-sm text-slate-500">{typeLabel[h.type]} · {h.area}, {cities.find((c) => c.id === h.city)?.name}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <div>
                    <p className="text-xs text-slate-400">Seats available</p>
                    <div className="mt-1 flex items-center gap-2">
                      <button onClick={() => hostelActions.update(h.id, { seats: Math.max(0, h.seats - 1) })} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5" aria-label="Decrease seats"><Minus className="h-4 w-4" /></button>
                      <span className="w-8 text-center font-display text-lg font-bold">{h.seats}</span>
                      <button onClick={() => hostelActions.update(h.id, { seats: Math.min(h.totalSeats, h.seats + 1) })} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5" aria-label="Increase seats"><Plus className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Rent / month</p>
                    <label className="mt-1 flex items-center gap-1 rounded-lg border border-slate-200 px-2 dark:border-white/10">
                      <IndianRupee className="h-4 w-4 text-slate-400" />
                      <input type="number" step="100" min="0" defaultValue={h.rent} onBlur={(e) => { if (+e.target.value !== h.rent) { hostelActions.update(h.id, { rent: +e.target.value }); toast('Rent updated') } }} className="w-24 bg-transparent py-1.5 text-sm font-semibold outline-none" aria-label="Rent" />
                    </label>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Rating</p>
                    <p className="mt-1 text-sm font-semibold">★ {h.rating || 'New'} <span className="font-normal text-slate-400">({h.reviewsCount})</span></p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 md:flex-col">
                <Link to={`/hostels/${h.id}`} className="btn-ghost flex-1 py-2"><Eye className="h-4 w-4" /> View</Link>
                <button onClick={() => setEditing(h)} className="btn-outline flex-1 py-2"><Pencil className="h-4 w-4" /> Edit</button>
                <button onClick={() => { if (confirm(`Delete ${h.name}?`)) { hostelActions.remove(h.id); toast('Listing deleted', 'info') } }} className="btn-ghost flex-1 py-2 text-rose-600"><Trash2 className="h-4 w-4" /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? `Edit ${editing.name}` : 'Add a new listing'} wide>
        {editing !== null && (
          <HostelForm
            initial={editing}
            onCancel={() => setEditing(null)}
            onSubmit={(data) => {
              if (editing.id) {
                hostelActions.update(editing.id, data)
                toast('Listing updated')
              } else {
                hostelActions.add(data, user.id)
                toast('Submitted! An admin will verify it shortly.')
              }
              setEditing(null)
            }}
          />
        )}
      </Modal>
    </DashboardShell>
  )
}
