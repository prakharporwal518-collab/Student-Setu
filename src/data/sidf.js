// SIDF — Student Innovation & Development Forum (demo data).

export const sidfPillars = [
  { title: 'Incubation for every campus', text: 'Government & local colleges without incubation centres get mentors, workshops and a structured idea-to-prototype path.', icon: 'Rocket' },
  { title: 'Mentor network', text: 'Founders, engineers, researchers and alumni volunteer time to guide student teams.', icon: 'Users' },
  { title: 'Hackathon readiness', text: 'Preparation hub for national challenges — problem selection, pitch decks and team formation.', icon: 'Trophy' },
  { title: 'Idea feedback loop', text: 'Submit ideas, get structured feedback and track your progress over time.', icon: 'Lightbulb' },
]

export const sidfEvents = [
  { id: 'e1', title: 'Idea to Prototype Bootcamp', college: 'Govt. Engineering College, Ujjain', city: 'Ujjain', date: '2026-11-08', mode: 'Offline', seats: 120, tags: ['Workshop', 'Hardware'] },
  { id: 'e2', title: 'Design Thinking for Social Impact', college: 'Govt. Motilal Vigyan Mahavidyalaya', city: 'Bhopal', date: '2026-11-15', mode: 'Offline', seats: 80, tags: ['Design', 'Social'] },
  { id: 'e3', title: 'SIH Problem Statement Deep-Dive', college: 'Online · Open for all', city: 'Online', date: '2026-11-22', mode: 'Online', seats: 500, tags: ['Hackathon', 'SIH'] },
  { id: 'e4', title: 'Pitch Day — Demo your MVP', college: 'Holkar Science College', city: 'Indore', date: '2026-12-06', mode: 'Offline', seats: 60, tags: ['Pitching', 'Funding'] },
  { id: 'e5', title: 'AI for Bharat Workshop', college: 'Govt. Polytechnic, Lucknow', city: 'Lucknow', date: '2026-12-13', mode: 'Hybrid', seats: 150, tags: ['AI/ML', 'Workshop'] },
]

export const mentors = [
  { id: 'm1', name: 'Dr. Kavita Rao', role: 'Professor & Researcher', org: 'Robotics Lab (sample)', expertise: ['Robotics', 'IoT', 'Research papers'], city: 'Bhopal', rating: 4.9, sessions: 140, available: true },
  { id: 'm2', name: 'Arjun Malhotra', role: 'Startup Founder', org: 'AgriTech startup (sample)', expertise: ['Startups', 'Fundraising', 'Pitching'], city: 'Indore', rating: 4.8, sessions: 96, available: true },
  { id: 'm3', name: 'Neha Kulkarni', role: 'Senior Software Engineer', org: 'Product company (sample)', expertise: ['Web Dev', 'System Design', 'Careers'], city: 'Pune · Remote', rating: 4.9, sessions: 210, available: false },
  { id: 'm4', name: 'Rahul Mishra', role: 'ML Engineer', org: 'AI lab (sample)', expertise: ['AI/ML', 'Computer Vision', 'Kaggle'], city: 'Remote', rating: 4.7, sessions: 75, available: true },
  { id: 'm5', name: 'Fatima Sheikh', role: 'Product Designer', org: 'Design studio (sample)', expertise: ['UI/UX', 'Design Thinking', 'Prototyping'], city: 'Delhi', rating: 4.8, sessions: 88, available: true },
  { id: 'm6', name: 'Vikram Choudhary', role: 'Patent & IP Consultant', org: 'IP firm (sample)', expertise: ['Patents', 'IP', 'Legal basics'], city: 'Jaipur', rating: 4.6, sessions: 54, available: true },
]

export const challenges = [
  { name: 'Smart India Hackathon', url: 'https://www.sih.gov.in', text: 'Nationwide hackathon on problem statements from ministries and industry. Teams of 6 with at least one woman member.' },
  { name: 'MY Bharat', url: 'https://mybharat.gov.in', text: 'Youth platform with volunteering, experiential learning and innovation opportunities.' },
  { name: 'Startup India', url: 'https://www.startupindia.gov.in', text: 'Government portal for recognition, schemes and learning programs for founders.' },
]

export const pitchTips = [
  'Problem first: one slide that makes the judge feel the pain.',
  'Show who suffers and how many — use real numbers with sources.',
  'Your solution in one sentence, then a demo or screenshot.',
  'Why now and why you — your unfair advantage.',
  'Business / impact model: who pays or who benefits.',
  'Roadmap with 3 milestones and what help you need.',
  'Keep it to 10 slides, 3 minutes, no walls of text.',
]

// Illustrative examples of the kind of ideas that do well (not official winners).
export const pastIdeas = [
  { title: 'Crop disease detection on low-end phones', theme: 'Agriculture', why: 'Works offline, local-language voice output' },
  { title: 'Smart attendance with face recognition for rural schools', theme: 'Education', why: 'Low-cost hardware, privacy-friendly on-device model' },
  { title: 'Real-time bus tracking for tier-3 towns', theme: 'Transport', why: 'Uses SMS fallback where data is weak' },
  { title: 'Water quality IoT sensor for village tanks', theme: 'Health', why: 'Under ₹1,500 per unit, alerts to panchayat' },
]

export const teamPosts = [
  { id: 'tp1', title: 'Need ML + frontend devs for SIH', by: 'Harsh Jain', college: 'RGPV', skills: ['ML', 'React'], spots: 2, createdAt: '2026-10-20T10:00:00Z' },
  { id: 'tp2', title: 'Looking for a hardware person (IoT)', by: 'Megha Rathi', college: 'IIT Indore', skills: ['ESP32', 'PCB'], spots: 1, createdAt: '2026-10-22T08:00:00Z' },
  { id: 'tp3', title: 'Designer wanted for EdTech idea', by: 'Sneha Patel', college: 'LNCT', skills: ['Figma', 'UX research'], spots: 1, createdAt: '2026-10-23T15:00:00Z' },
]

// Government startup funding schemes & grants — official links only. Amounts change; check each portal.
export const fundingSchemes = [
  { name: 'Startup India Seed Fund Scheme (SISFS)', by: 'DPIIT, Govt. of India', for: 'Proof of concept, prototype & market entry via approved incubators', url: 'https://seedfund.startupindia.gov.in', tag: 'Seed grant' },
  { name: 'Atal Innovation Mission (AIM)', by: 'NITI Aayog', for: 'Atal Incubation Centres, Atal Tinkering Labs & innovation challenges', url: 'https://aim.gov.in', tag: 'Incubation' },
  { name: 'NIDHI (PRAYAS, EIR, TBI)', by: 'Dept. of Science & Technology', for: 'Prototype grants (PRAYAS) and fellowships for student founders', url: 'https://nidhi.dst.gov.in', tag: 'Prototype grant' },
  { name: 'BIRAC BIG (Biotechnology Ignition Grant)', by: 'Dept. of Biotechnology', for: 'Early-stage biotech & health-tech ideas', url: 'https://birac.nic.in', tag: 'Biotech grant' },
  { name: 'MeitY Startup Hub & TIDE 2.0', by: 'Ministry of Electronics & IT', for: 'Tech startups via incubators across India', url: 'https://msh.meity.gov.in', tag: 'Tech startups' },
  { name: 'MSME Idea Hackathon & Incubation', by: 'Ministry of MSME', for: 'Support for innovative ideas through host institutes', url: 'https://msme.gov.in', tag: 'Idea support' },
  { name: 'Stand-Up India', by: 'Dept. of Financial Services', for: 'Bank loans for SC/ST and women entrepreneurs', url: 'https://www.standupmitra.in', tag: 'Loans' },
  { name: 'PM Mudra Yojana', by: 'Govt. of India', for: 'Collateral-free loans for micro & small businesses', url: 'https://www.mudra.org.in', tag: 'Loans' },
  { name: 'MP Startup Policy', by: 'Govt. of Madhya Pradesh', for: 'State incentives & support for startups in MP', url: 'https://startup.mp.gov.in', tag: 'State scheme' },
]
