import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Compass, FileText, HandHeart, Heart, HelpCircle, Info, LifeBuoy, Mail, MapPin, MessageCircle, Phone, Shield, Target, Users } from 'lucide-react'
import { PageHeader, SectionHeader } from '../components/ui'
import { useToast } from '../context/AppContext'

/* ------------------------------------------------------------------ About */
export function About() {
  const values = [
    { icon: HandHeart, title: 'Students first', text: 'Academic resources are free forever. We never charge students for scholarships or listings.' },
    { icon: Shield, title: 'Trust & safety', text: 'Verified badges for listings and students, ratings everywhere and quick moderation.' },
    { icon: Users, title: 'Local wisdom', text: 'Guidance comes from students who already live in the city — not from ads.' },
    { icon: Target, title: 'Reach every campus', text: 'SIDF brings incubation-style support to government and local colleges.' },
  ]
  return (
    <>
      <PageHeader icon={Info} kicker="About Student Setu" title="Bridging Students, Building Futures" subtitle="Every year lakhs of students move to a new city for college. Student Setu makes sure none of them start alone." crumbs={[{ label: 'About' }]} />
      <div className="container-x py-10">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">Why we built this</h2>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">Finding an affordable PG, decent food, the right notes or a first internship usually depends on knowing the right senior. Students from small towns and government colleges often don’t have that network — and end up overpaying or missing opportunities.</p>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">Student Setu (“setu” means bridge) puts everything a student needs on one platform: stay, food, colleges, study material, exams, careers, scholarships, an e-library and mentorship — powered by a community of verified local students.</p>
            <div className="mt-6 flex gap-3"><Link to="/signup" className="btn-accent">Join the community</Link><Link to="/help" className="btn-outline">Partner with us</Link></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['50,000+', 'Students connected'], ['5,000+', 'Hostels & PGs'], ['1,200+', 'Colleges covered'], ['10,000+', 'Free resources']].map(([n, l]) => (
              <div key={l} className="card p-6 text-center"><p className="font-display text-3xl font-extrabold text-brand-800 dark:text-brand-300">{n}</p><p className="mt-1 text-sm text-slate-500">{l}</p></div>
            ))}
          </div>
        </div>
        <section className="mt-16">
          <SectionHeader center title="What we stand for" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{values.map((v) => <div key={v.title} className="card p-6"><v.icon className="h-8 w-8 text-saffron-500" /><h3 className="mt-3 font-bold">{v.title}</h3><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{v.text}</p></div>)}</div>
        </section>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------- Help */
export function Help() {
  const toast = useToast()
  return (
    <>
      <PageHeader icon={LifeBuoy} kicker="Help & Contact" title="We’re here to help" subtitle="Questions about a listing, your account, partnerships or reporting a problem — reach out anytime." crumbs={[{ label: 'Help & Contact' }]} />
      <div className="container-x grid gap-6 py-10 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4">
          {[
            { icon: Mail, title: 'Email', text: 'hello@studentsetu.in', sub: 'Replies within 24 hours' },
            { icon: Phone, title: 'Helpline', text: 'Mon–Sat, 10 AM – 6 PM', sub: 'Number shared after launch' },
            { icon: MessageCircle, title: 'Chat', text: 'Setu Saathi assistant', sub: 'Bottom-right corner, any time' },
            { icon: MapPin, title: 'Office', text: 'Bhopal, Madhya Pradesh', sub: 'Student-run initiative' },
          ].map((c) => (
            <div key={c.title} className="card flex items-center gap-4 p-5"><span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-800 dark:bg-white/10 dark:text-brand-200"><c.icon className="h-5 w-5" /></span><div><p className="text-xs text-slate-400">{c.title}</p><p className="font-semibold">{c.text}</p><p className="text-xs text-slate-500">{c.sub}</p></div></div>
          ))}
          <Link to="/faq" className="card card-hover flex items-center gap-3 p-5"><HelpCircle className="h-6 w-6 text-saffron-500" /><span className="font-semibold">Read frequently asked questions →</span></Link>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); e.currentTarget.reset(); toast('Message sent! Ticket #SS' + Math.floor(Math.random() * 90000 + 10000) + ' created.') }} className="card space-y-4 p-6">
          <h2 className="text-xl font-bold">Send us a message</h2>
          <div className="grid gap-4 sm:grid-cols-2"><div><label className="label">Name</label><input required className="input" /></div><div><label className="label">Email</label><input type="email" required className="input" /></div></div>
          <div><label className="label">Topic</label><select className="input select-arrow"><option>Help with a hostel / PG listing</option><option>Tiffin service</option><option>Account & login</option><option>Report a problem or fraud</option><option>Partnership / list my college</option><option>Other</option></select></div>
          <div><label className="label">Message</label><textarea required rows={5} className="input" /></div>
          <button className="btn-primary w-full">Send message</button>
        </form>
      </div>
    </>
  )
}

/* -------------------------------------------------------------------- FAQ */
const faqs = [
  ['Is Student Setu free for students?', 'Yes. Searching hostels and tiffin, connecting with students, all academic resources, quizzes, scholarships and e-library are completely free. Only some premium skill programs will be paid in future.'],
  ['How are hostels and PGs verified?', 'Owners submit ID and property details. Our admin team reviews them and, where possible, a local student volunteer visits. Verified listings show a green “Verified” badge.'],
  ['I own a PG. How do I list it?', 'Sign up as a “Hostel Owner”, open your Owner Dashboard and click “Add listing”. You can update rent, facilities and available seats anytime.'],
  ['Can I list my tiffin or mess service?', 'Yes — sign up as a “Tiffin Provider” to add your menu, monthly price, delivery areas and timings.'],
  ['Do I need to register to take quizzes?', 'No. Quizzes are free with no registration. Your score and explanations appear instantly. If you log in, your history is saved on your dashboard.'],
  ['Are e-library books legal to download?', 'We only host or link legally shareable content: NCERT, open-licensed textbooks (e.g. OpenStax), NPTEL, public-domain books and notes shared by students with permission. Use “Report content” if you spot a problem.'],
  ['Does Student Setu post jobs itself?', 'No. We curate and guide, but every internship or job card links to and credits the original source such as LinkedIn, Internshala or the company website.'],
  ['What is SIDF?', 'The Student Innovation & Development Forum brings incubation-style support — mentors, workshops and hackathon preparation — to government and local colleges that don’t have incubation centres.'],
]
export function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <>
      <PageHeader icon={HelpCircle} kicker="FAQ" title="Frequently asked questions" crumbs={[{ label: 'FAQ' }]} />
      <div className="container-x max-w-3xl py-10">
        <div className="space-y-3">
          {faqs.map(([q, a], i) => (
            <div key={q} className="card overflow-hidden">
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-3 p-5 text-left font-semibold text-slate-800 dark:text-white">{q}<ChevronDown className={`h-5 w-5 shrink-0 transition ${open === i ? 'rotate-180 text-saffron-500' : 'text-slate-400'}`} /></button>
              <AnimatePresence initial={false}>{open === i && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden"><p className="px-5 pb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{a}</p></motion.div>}</AnimatePresence>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">Still have questions? <Link to="/help" className="link">Contact us</Link></p>
      </div>
    </>
  )
}

/* ---------------------------------------------------------- Legal pages */
function Legal({ title, icon, sections }) {
  return (
    <>
      <PageHeader icon={icon} kicker="Legal" title={title} subtitle="Last updated: October 2026" crumbs={[{ label: title }]} />
      <div className="container-x max-w-3xl py-10">
        <div className="card space-y-6 p-6 sm:p-8">
          {sections.map(([h, p]) => <section key={h}><h2 className="text-lg font-bold">{h}</h2><p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{p}</p></section>)}
          <p className="text-xs text-slate-400">This is a template for the prototype and should be reviewed by a legal professional before launch.</p>
        </div>
      </div>
    </>
  )
}
export const Privacy = () => (
  <Legal title="Privacy Policy" icon={Shield} sections={[
    ['What we collect', 'Account details (name, email, role, city), content you post (listings, reviews, ideas) and basic usage analytics to improve the platform.'],
    ['How we use it', 'To show relevant stays, resources and opportunities, verify listings, prevent fraud and contact you about your account. We never sell your personal data.'],
    ['Contact details', 'Owner and provider phone numbers are shown only for verified listings. Students control what appears on their public profile.'],
    ['Your choices', 'You can edit or delete your account and content at any time from your dashboard, or by writing to hello@studentsetu.in.'],
    ['Security', 'Passwords are hashed and data is encrypted in transit. Report any vulnerability to security@studentsetu.in.'],
  ]} />
)
export const Terms = () => (
  <Legal title="Terms & Conditions" icon={FileText} sections={[
    ['Using Student Setu', 'Student Setu is an information and community platform. Agreements for stay or food are directly between students and owners/providers.'],
    ['Listings', 'Owners and providers must post accurate information. False or misleading listings will be removed and accounts may be suspended.'],
    ['Content & copyright', 'Only upload content you own or have permission to share. We respond to copyright complaints promptly via “Report content”.'],
    ['External links', 'Jobs, scholarships and courses link to third-party sites. Always verify details on the official website before applying or paying.'],
    ['Community conduct', 'Be respectful. Harassment, spam and discrimination are not allowed and will lead to removal.'],
  ]} />
)

/* --------------------------------------------------------------- 404 */
export function NotFound() {
  return (
    <div className="container-x flex flex-col items-center py-24 text-center">
      <Compass className="h-16 w-16 text-saffron-500" />
      <h1 className="mt-4 text-4xl font-extrabold">Lost in a new city?</h1>
      <p className="mt-2 text-slate-500">This page doesn’t exist — but your next step is just a click away.</p>
      <div className="mt-6 flex gap-3"><Link to="/" className="btn-primary">Go home</Link><Link to="/search" className="btn-outline">Search</Link></div>
      <p className="mt-10 flex items-center gap-1 text-xs text-slate-400">Made with <Heart className="h-3 w-3 fill-rose-500 text-rose-500" /> for students</p>
    </div>
  )
}
