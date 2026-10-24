// Internships & jobs. Student Setu never copies full listings — every card links
// to the original source and credits it. Companies below are sample listings for the demo.

export const yearGuidance = [
  {
    year: 1, title: '1st Year — Explore & build basics',
    focus: ['Learn one programming language well (C++/Python)', 'Join college clubs & NSS/NCC', 'Attend workshops and hackathons as a learner'],
    suits: ['NGO / social internships', 'Campus ambassador programs', 'Content writing or design gigs', 'Virtual internships & job simulations'],
  },
  {
    year: 2, title: '2nd Year — Skill up & first internship',
    focus: ['DSA practice (150+ problems)', 'Build 2 projects and push to GitHub', 'Contribute to open source'],
    suits: ['Startup internships (remote)', 'Open source programs (GSoC, LFX, Outreachy)', 'Research internships with professors', 'Hackathons (SIH, college fests)'],
  },
  {
    year: 3, title: '3rd Year — Summer internship that converts',
    focus: ['Resume with impact numbers', 'Mock interviews', 'Apply early (Aug–Nov for summer roles)'],
    suits: ['Product company SDE / analyst internships', 'Summer research fellowships (IITs, IISc)', 'Core-branch PSU / industrial training', 'International programs (e.g. MITACS)'],
  },
  {
    year: 4, title: 'Final Year — Jobs you are eligible for',
    focus: ['Campus placements & off-campus drives', 'GATE / CAT / UPSC if planning higher studies', 'Pre-placement offers from internships'],
    suits: ['Graduate engineer trainee roles', 'Software / data / analyst jobs', 'PSU recruitment via GATE', 'Government jobs (SSC, banking, state PSC)'],
  },
]

export const sources = {
  internshala: { name: 'Internshala', url: 'https://internshala.com/internships/' },
  linkedin: { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs/' },
  naukri: { name: 'Naukri', url: 'https://www.naukri.com/fresher-jobs' },
  company: { name: 'Company site', url: '#' },
}

export const listings = [
  { id: 'j1', kind: 'internship', title: 'Frontend Developer Intern (React)', company: 'CodeCraft Labs', location: 'Remote', stipend: '₹10,000 /month', years: [2, 3], eligibility: 'B.Tech/BCA, React basics', deadline: '2026-11-20', source: 'internshala', tags: ['React', 'Tailwind'] },
  { id: 'j2', kind: 'internship', title: 'Machine Learning Intern', company: 'DataNest AI', location: 'Bengaluru (Hybrid)', stipend: '₹25,000 /month', years: [3, 4], eligibility: 'Python, ML fundamentals, 7+ CGPA', deadline: '2026-11-30', source: 'linkedin', tags: ['Python', 'PyTorch'] },
  { id: 'j3', kind: 'internship', title: 'Social Media & Content Intern', company: 'GreenRoots NGO', location: 'Remote', stipend: 'Certificate + LOR', years: [1, 2], eligibility: 'Any course, good writing skills', deadline: '2026-11-15', source: 'internshala', tags: ['Content', 'Canva'] },
  { id: 'j4', kind: 'internship', title: 'Business Development Intern', company: 'Tiffinly', location: 'Bhopal', stipend: '₹8,000 /month', years: [1, 2, 3], eligibility: 'BBA/B.Com/any, communication skills', deadline: '2026-12-05', source: 'internshala', tags: ['Sales', 'Marketing'] },
  { id: 'j5', kind: 'internship', title: 'Research Intern — IoT for Agriculture', company: 'AgriSense Labs', location: 'Indore', stipend: '₹12,000 /month', years: [2, 3], eligibility: 'ECE/CSE, Arduino or ESP32', deadline: '2026-12-10', source: 'company', tags: ['IoT', 'Embedded'] },
  { id: 'j6', kind: 'internship', title: 'Data Analyst Intern', company: 'FinEdge', location: 'Remote', stipend: '₹15,000 /month', years: [3, 4], eligibility: 'SQL, Excel, Python', deadline: '2026-11-25', source: 'linkedin', tags: ['SQL', 'Power BI'] },
  { id: 'j7', kind: 'job', title: 'Graduate Software Engineer', company: 'Nimbus Systems', location: 'Pune', stipend: '₹6–9 LPA', years: [4], eligibility: 'B.Tech/MCA 2026 batch, 6.5+ CGPA', deadline: '2026-12-01', source: 'linkedin', tags: ['Java', 'DSA'] },
  { id: 'j8', kind: 'job', title: 'Associate Analyst', company: 'Insight Analytics', location: 'Gurugram', stipend: '₹5–6 LPA', years: [4], eligibility: 'Any graduate, aptitude test', deadline: '2026-11-28', source: 'naukri', tags: ['Excel', 'Aptitude'] },
  { id: 'j9', kind: 'job', title: 'Graduate Engineer Trainee — Mechanical', company: 'Vidarbha Precision Works', location: 'Nagpur', stipend: '₹4.5 LPA', years: [4], eligibility: 'B.Tech Mechanical, 60%+', deadline: '2026-12-15', source: 'company', tags: ['Core', 'Manufacturing'] },
  { id: 'j10', kind: 'job', title: 'Management Trainee — Sales', company: 'UrbanKart', location: 'Jaipur', stipend: '₹4–5 LPA', years: [4], eligibility: 'BBA/MBA/B.Com', deadline: '2026-12-20', source: 'naukri', tags: ['Sales', 'Retail'] },
]

// Real, well-known programs — timelines are typical, always check the official site.
export const programs = [
  { name: 'Google Summer of Code', url: 'https://summerofcode.withgoogle.com', window: 'Applications usually Mar–Apr', for: '2nd–4th year · open source' },
  { name: 'LFX Mentorship', url: 'https://lfx.linuxfoundation.org/tools/mentorship/', window: 'Three terms a year', for: 'Any year · open source' },
  { name: 'Outreachy', url: 'https://www.outreachy.org', window: 'Two rounds a year', for: 'Under-represented groups in tech' },
  { name: 'Smart India Hackathon', url: 'https://www.sih.gov.in', window: 'Usually Aug–Dec', for: 'All years · team of 6' },
  { name: 'MITACS Globalink', url: 'https://www.mitacs.ca/our-programs/globalink-research-internship-students/', window: 'Applications ~Sep', for: '3rd year · research in Canada' },
  { name: 'Internshala Internships', url: 'https://internshala.com/internships/', window: 'Year-round', for: 'All years' },
]
