import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BedDouble, CalendarCheck, Heart, Map, MapPin, MessageSquare, Phone, PiggyBank, Share2, ShieldAlert, UtensilsCrossed, Users } from 'lucide-react'
import { Avatar, Badge, EmptyState, Modal, Rating, SmartImage, Stars, VerifiedPill } from '../components/ui'
import HostelCard, { facilityIcons, facilityName, mapsUrl } from '../components/hostel/HostelCard'
import { useData } from '../context/DataContext'
import { useAuth, useToast } from '../context/AppContext'
import { cityById, formatINR } from '../data/common'
import { collegeById } from '../data/colleges'
import { privateCollegeHostelFee, typeLabel } from '../data/hostels'

export const osmEmbed = (lat, lng, d = 0.012) =>
  `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d},${lat - d},${lng + d},${lat + d}&layer=mapnik&marker=${lat},${lng}`

function ReviewForm({ onSubmit }) {
  const { user } = useAuth()
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [name, setName] = useState(user?.name ?? '')
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!text.trim() || !name.trim()) return
        onSubmit({ name: name.trim(), rating, text: text.trim() })
        setText('')
      }}
      className="space-y-3 rounded-2xl bg-slate-50 p-4 dark:bg-white/5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-800 dark:text-white">Write a review</p>
        <Stars value={rating} onChange={setRating} size="h-5 w-5" />
      </div>
      {!user && <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="input" required />}
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="How was the food, safety, owner behaviour, cleanliness…" className="input" required />
      <button className="btn-primary">Post review</button>
    </form>
  )
}

export default function HostelDetail() {
  const { id } = useParams()
  const { hostels, tiffins, isSaved, toggleSaved, hostelActions } = useData()
  const toast = useToast()
  const h = hostels.find((x) => x.id === id)
  const [img, setImg] = useState(0)
  const [visit, setVisit] = useState(false)

  if (!h)
    return (
      <div className="container-x py-16">
        <EmptyState icon={BedDouble} title="Listing not found" text="It may have been removed by the owner." action={<Link to="/hostels" className="btn-primary">Browse stays</Link>} />
      </div>
    )

  const city = cityById(h.city)
  const college = collegeById(h.college)
  const saved = isSaved('hostels', h.id)
  const yearlySaving = (privateCollegeHostelFee - h.rent) * 12
  const occupancy = Math.round(((h.totalSeats - h.seats) / h.totalSeats) * 100)
  const nearbyTiffins = tiffins.filter((t) => t.city === h.city && t.status === 'approved').slice(0, 3)
  const similar = hostels.filter((x) => x.city === h.city && x.id !== h.id && x.status === 'approved').slice(0, 3)

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: h.name, url: location.href })
      else {
        await navigator.clipboard.writeText(location.href)
        toast('Link copied to clipboard')
      }
    } catch {
      /* cancelled */
    }
  }

  return (
    <div className="container-x py-6 sm:py-8">
      <Link to="/hostels" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" /> Back to all stays
      </Link>

      {h.status !== 'approved' && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200">
          <ShieldAlert className="h-5 w-5" /> This listing is awaiting admin verification and is not public yet.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-6">
          {/* Gallery */}
          <div className="card overflow-hidden p-2">
            <div className="relative">
              <SmartImage src={h.images?.[img]} alt={h.name} fallbackLabel={h.name} icon={BedDouble} className="aspect-[16/9] w-full rounded-xl" />
              {h.verified && <VerifiedPill className="absolute bottom-3 left-3" />}
            </div>
            {h.images?.length > 1 && (
              <div className="mt-2 flex gap-2">
                {h.images.map((src, i) => (
                  <button key={src + i} onClick={() => setImg(i)} className={`w-24 overflow-hidden rounded-lg ring-2 transition ${img === i ? 'ring-saffron-500' : 'ring-transparent opacity-70 hover:opacity-100'}`} aria-label={`Photo ${i + 1}`}>
                    <SmartImage src={src} alt="" className="aspect-[4/3] w-full" icon={BedDouble} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Overview */}
          <div className="card p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge>{typeLabel[h.type]}</Badge>
                  <Badge tone="saffron">{h.gender === 'coed' ? 'Co-ed' : h.gender === 'boys' ? 'Boys only' : 'Girls only'}</Badge>
                  {h.ac && <Badge tone="purple">AC rooms</Badge>}
                  {h.food && <Badge tone="green">Food included</Badge>}
                </div>
                <h1 className="text-2xl font-extrabold sm:text-3xl">{h.name}</h1>
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                  <MapPin className="h-4 w-4" /> {h.area}, {city?.name} {college && <>· {h.distanceKm} km from {college.short}</>}
                </p>
                <div className="mt-2">
                  <Rating value={h.rating} count={h.reviewsCount} />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={share} className="btn-ghost h-10 w-10 p-0" aria-label="Share">
                  <Share2 className="h-5 w-5" />
                </button>
                <button onClick={() => toggleSaved('hostels', h.id)} className="btn-ghost h-10 w-10 p-0" aria-label={saved ? 'Unsave' : 'Save'} aria-pressed={saved}>
                  <Heart className={`h-5 w-5 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
            </div>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{h.description}</p>

            <h2 className="mb-3 mt-6 text-lg font-bold">Facilities</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {h.facilities.map((f) => {
                const Icon = facilityIcons[f]
                return (
                  <div key={f} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 dark:bg-white/5 dark:text-slate-200">
                    {Icon && <Icon className="h-4 w-4 text-brand-700 dark:text-brand-300" />} {facilityName(f)}
                  </div>
                )
              })}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <h2 className="mb-2 text-lg font-bold">Room types</h2>
                <div className="flex flex-wrap gap-2">
                  {h.roomTypes.map((r) => (
                    <Badge key={r} tone="gray" className="capitalize">
                      {r} sharing
                    </Badge>
                  ))}
                </div>
              </div>
              {h.rules?.length > 0 && (
                <div>
                  <h2 className="mb-2 text-lg font-bold">House rules</h2>
                  <ul className="list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-300">
                    {h.rules.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Map className="h-5 w-5 text-brand-700" /> Location
              </h2>
              <a href={mapsUrl(h.lat, h.lng)} target="_blank" rel="noreferrer" className="link text-sm">
                Open in Google Maps ↗
              </a>
            </div>
            <iframe title={`Map of ${h.name}`} src={osmEmbed(h.lat, h.lng)} className="h-72 w-full border-0" loading="lazy" />
          </div>

          {/* Reviews */}
          <div className="card p-5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <MessageSquare className="h-5 w-5 text-brand-700" /> Ratings & reviews
            </h2>
            <ReviewForm
              onSubmit={(r) => {
                hostelActions.review(h.id, r)
                toast('Thanks! Your review is live.')
              }}
            />
            <ul className="mt-5 divide-y divide-slate-100 dark:divide-white/10">
              {(h.reviews ?? []).map((r, i) => (
                <li key={r.id ?? i} className="flex gap-3 py-4">
                  <Avatar name={r.name} size="h-10 w-10 text-sm" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{r.name}</p>
                      <Stars value={r.rating} size="h-3.5 w-3.5" />
                      <span className="text-xs text-slate-400">{r.date}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{r.text}</p>
                  </div>
                </li>
              ))}
              {!h.reviews?.length && <li className="py-4 text-sm text-slate-500">No reviews yet — be the first!</li>}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="card p-5">
            <p className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              {formatINR(h.rent)} <span className="text-sm font-medium text-slate-500">/month</span>
            </p>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  <Users className="mr-1 inline h-4 w-4" /> {h.seats} seats available
                </span>
                <span className="text-slate-500">{occupancy}% filled</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-saffron-500" style={{ width: `${occupancy}%` }} />
              </div>
            </div>
            <button onClick={() => setVisit(true)} className="btn-accent mt-5 w-full">
              <CalendarCheck className="h-4 w-4" /> Request a visit
            </button>
            <div className="mt-4 rounded-2xl border border-slate-100 p-4 dark:border-white/10">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Owner contact</p>
              <div className="mt-2 flex items-center gap-3">
                <Avatar name={h.owner?.name ?? 'Owner'} size="h-10 w-10 text-sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">{h.owner?.name}</p>
                  <p className="text-xs text-slate-500">{h.owner?.phone}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button onClick={() => toast('Demo listing — calling is disabled. Numbers are revealed after verification.', 'info')} className="btn-outline py-2">
                  <Phone className="h-4 w-4" /> Call
                </button>
                <button onClick={() => toast('Demo listing — WhatsApp chat opens once the owner is verified.', 'info')} className="btn py-2 bg-emerald-500 text-white hover:bg-emerald-600">
                  WhatsApp
                </button>
              </div>
            </div>
          </div>

          {yearlySaving > 0 && (
            <div className="card flex items-start gap-3 bg-emerald-50 p-5 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:ring-emerald-400/20">
              <PiggyBank className="h-8 w-8 shrink-0 text-emerald-600" />
              <div>
                <p className="font-bold text-emerald-800 dark:text-emerald-200">Save {formatINR(yearlySaving)} / year</p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">Compared with an average private-college hostel fee of {formatINR(privateCollegeHostelFee)}/month.</p>
              </div>
            </div>
          )}

          {nearbyTiffins.length > 0 && (
            <div className="card p-5">
              <h3 className="mb-3 flex items-center gap-2 font-bold">
                <UtensilsCrossed className="h-4 w-4 text-saffron-500" /> Tiffin services nearby
              </h3>
              <ul className="space-y-3">
                {nearbyTiffins.map((t) => (
                  <li key={t.id}>
                    <Link to={`/tiffin?focus=${t.id}`} className="flex items-center justify-between gap-2 text-sm hover:text-brand-700">
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-slate-800 dark:text-white">{t.name}</span>
                        <span className="text-xs text-slate-500">{t.area}</span>
                      </span>
                      <span className="shrink-0 font-semibold">{formatINR(t.monthly)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold">Similar stays in {city?.name}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s) => (
              <HostelCard key={s.id} hostel={s} />
            ))}
          </div>
        </section>
      )}

      <Modal open={visit} onClose={() => setVisit(false)} title={`Visit ${h.name}`}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setVisit(false)
            toast('Visit requested! The owner will confirm a time slot.')
          }}
          className="space-y-3"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Preferred date</label>
              <input type="date" required className="input" min={new Date().toISOString().slice(0, 10)} />
            </div>
            <div>
              <label className="label">Time</label>
              <select className="input select-arrow">
                <option>Morning (10–12)</option>
                <option>Afternoon (2–4)</option>
                <option>Evening (5–7)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Room type</label>
            <select className="input select-arrow capitalize">
              {h.roomTypes.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Message (optional)</label>
            <textarea rows={3} className="input" placeholder="I'm a 1st year student joining in July…" />
          </div>
          <button className="btn-accent w-full">Send request</button>
        </form>
      </Modal>
    </div>
  )
}
