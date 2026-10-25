// After-12th pathways for school students: subjects -> courses -> entrance exams -> roadmap.
// Exam months are "usually" — always confirm dates on the official website.

export const subjects = [
  'Physics', 'Chemistry', 'Maths', 'Biology', 'Computer Science',
  'Accountancy', 'Business Studies', 'Economics',
  'History', 'Political Science', 'Geography', 'Psychology',
]

export const streamPresets = [
  { id: 'pcm', label: 'Science (PCM)', subjects: ['Physics', 'Chemistry', 'Maths'] },
  { id: 'pcb', label: 'Science (PCB)', subjects: ['Physics', 'Chemistry', 'Biology'] },
  { id: 'pcmb', label: 'Science (PCMB)', subjects: ['Physics', 'Chemistry', 'Maths', 'Biology'] },
  { id: 'commerce', label: 'Commerce', subjects: ['Accountancy', 'Business Studies', 'Economics'] },
  { id: 'arts', label: 'Arts / Humanities', subjects: ['History', 'Political Science', 'Geography'] },
]

/* ---------------------------------------------------------------- exams */
const R = (when, step) => ({ when, step })
export const exams = {
  jeemain: {
    name: 'JEE Main', body: 'NTA', when: 'Usually January & April (2 sessions)', url: 'https://jeemain.nta.nic.in',
    counselling: { name: 'JoSAA / CSAB', url: 'https://josaa.nic.in' },
    roadmap: [R('Class 11', 'Finish NCERT Physics, Chemistry & Maths chapter by chapter; solve NCERT exemplar.'), R('Class 12', 'Complete the syllabus by December; 1 full mock test every week.'), R('Jan', 'JEE Main session 1 — analyse mistakes, fix weak chapters.'), R('Apr', 'JEE Main session 2 — best score counts.'), R('Jun–Jul', 'JoSAA counselling for NITs, IIITs & GFTIs; state counselling as backup.')],
  },
  jeeadv: {
    name: 'JEE Advanced', body: 'IITs', when: 'Usually May–June', url: 'https://jeeadv.ac.in',
    counselling: { name: 'JoSAA', url: 'https://josaa.nic.in' },
    roadmap: [R('Class 11–12', 'NCERT first, then advanced problem books for deeper concepts.'), R('Jan–Apr', 'Qualify JEE Main (top ~2.5 lakh are eligible).'), R('May', 'Past-paper practice for JEE Advanced (2 papers).'), R('Jun–Jul', 'JoSAA counselling for IITs.')],
  },
  bitsat: { name: 'BITSAT', body: 'BITS Pilani', when: 'Usually May–June', url: 'https://www.bitsadmission.com', counselling: { name: 'BITS admission portal', url: 'https://www.bitsadmission.com' }, roadmap: [R('Class 12', 'Speed + accuracy: BITSAT is computer-based with English & logical reasoning too.'), R('Apr–May', 'Timed online mock tests.')] },
  statecet: { name: 'State CETs', body: 'State boards (MHT CET, KCET, WBJEE, AP/TS EAPCET…)', when: 'Usually April–May', url: 'https://www.google.com/search?q=state+common+entrance+test+engineering+official', counselling: { name: 'State counselling', url: 'https://www.google.com/search?q=state+engineering+counselling' }, roadmap: [R('Class 12', 'State CETs follow the Class 11–12 syllabus closely — NCERT + state board books.'), R('Apr–May', 'Exam; then state counselling for government colleges.')] },
  nata: { name: 'NATA', body: 'Council of Architecture', when: 'Usually April–June (multiple attempts)', url: 'https://www.nata.in', counselling: { name: 'State / college counselling', url: 'https://www.coa.gov.in' }, roadmap: [R('Class 11–12', 'Practise freehand drawing, perspective and design aptitude daily.'), R('Apr–Jun', 'Take NATA (best score counts); JEE Main Paper 2 for NITs.')] },
  neet: {
    name: 'NEET UG', body: 'NTA', when: 'Usually May', url: 'https://neet.nta.nic.in',
    counselling: { name: 'MCC (All India Quota) + state counselling', url: 'https://mcc.nic.in' },
    roadmap: [R('Class 11', 'NCERT Biology line by line; Physics numericals daily; NCERT Chemistry.'), R('Class 12', 'Complete syllabus by December; revise Class 11 together.'), R('Jan–Apr', '2–3 full mock tests a week (180 questions, 3 h 20 min).'), R('May', 'NEET UG exam.'), R('Jun–Aug', 'MCC (AIQ) and state counselling — MBBS, BDS, AYUSH, BVSc.')],
  },
  aiims_nursing: { name: 'Nursing entrance', body: 'AIIMS / state nursing boards', when: 'Varies by state', url: 'https://www.aiimsexams.ac.in', counselling: { name: 'Institute / state counselling', url: 'https://www.aiimsexams.ac.in' }, roadmap: [R('Class 12', 'Biology & Chemistry NCERT + general aptitude.'), R('After boards', 'Apply to AIIMS and your state nursing entrance.')] },
  cuet: {
    name: 'CUET UG', body: 'NTA', when: 'Usually May–June', url: 'https://cuet.nta.nic.in',
    counselling: { name: 'CSAS (DU) & university portals', url: 'https://admission.uod.ac.in' },
    roadmap: [R('Class 12', 'CUET tests your Class 12 subjects (domain), a language and a general test.'), R('Feb–Mar', 'Pick universities & matching domain subjects; register on NTA.'), R('May–Jun', 'CUET UG exam.'), R('Jul–Aug', 'Apply through each university portal (e.g. DU CSAS).')],
  },
  iat: { name: 'IISER Aptitude Test', body: 'IISERs', when: 'Usually June', url: 'https://www.iiseradmission.in', counselling: { name: 'IISER joint admission', url: 'https://www.iiseradmission.in' }, roadmap: [R('Class 12', 'Concept-heavy NCERT science + maths; focus on understanding, not shortcuts.'), R('Jun', 'IAT exam, then IISER counselling.')] },
  nest: { name: 'NEST', body: 'NISER & UM-DAE CEBS', when: 'Usually June', url: 'https://www.nestexam.in', counselling: { name: 'NEST counselling', url: 'https://www.nestexam.in' }, roadmap: [R('Class 12', 'Solve past NEST papers; strong NCERT basics.'), R('Jun', 'NEST exam.')] },
  nda: { name: 'NDA & NA', body: 'UPSC', when: 'Usually April & September', url: 'https://upsc.gov.in', counselling: { name: 'SSB interview', url: 'https://joinindianarmy.nic.in' }, roadmap: [R('Class 12', 'Maths + General Ability (English, GK) practice; daily fitness.'), R('Apr / Sep', 'Written exam, then 5-day SSB interview and medicals.')] },
  clat: { name: 'CLAT', body: 'Consortium of NLUs', when: 'Usually December', url: 'https://consortiumofnlus.ac.in', counselling: { name: 'Consortium counselling', url: 'https://consortiumofnlus.ac.in' }, roadmap: [R('Class 11–12', 'Read a newspaper editorial daily; practise reading comprehension.'), R('Jul–Nov', 'Legal & logical reasoning, current affairs, weekly mocks.'), R('Dec', 'CLAT; then NLU counselling.')] },
  ailet: { name: 'AILET', body: 'NLU Delhi', when: 'Usually December', url: 'https://nationallawuniversitydelhi.in', counselling: { name: 'NLU Delhi', url: 'https://nationallawuniversitydelhi.in' }, roadmap: [R('Jul–Dec', 'Same preparation as CLAT; NLU Delhi admits only through AILET.')] },
  nid: { name: 'NID DAT', body: 'National Institute of Design', when: 'Usually December–January', url: 'https://admissions.nid.edu', counselling: { name: 'NID studio test & interview', url: 'https://admissions.nid.edu' }, roadmap: [R('Class 11–12', 'Sketch daily; build a portfolio of observations and ideas.'), R('Dec–Jan', 'DAT prelims; then studio test & interview.')] },
  nift: { name: 'NIFT Entrance', body: 'NIFT', when: 'Usually February', url: 'https://www.nift.ac.in', counselling: { name: 'NIFT counselling', url: 'https://www.nift.ac.in' }, roadmap: [R('Class 12', 'Creative ability test practice + general ability.'), R('Feb', 'Entrance; then situation test for B.Des.')] },
  uceed: { name: 'UCEED', body: 'IIT Bombay', when: 'Usually January', url: 'https://www.uceed.iitb.ac.in', counselling: { name: 'UCEED seat allocation', url: 'https://www.uceed.iitb.ac.in' }, roadmap: [R('Class 12', 'Visual reasoning, observation and drawing practice.'), R('Jan', 'UCEED for B.Des at IITs.')] },
  ipmat: { name: 'IPMAT', body: 'IIM Indore / IIM Rohtak', when: 'Usually May', url: 'https://www.iimidr.ac.in', counselling: { name: 'IIM interview', url: 'https://www.iimidr.ac.in' }, roadmap: [R('Class 12', 'Quantitative aptitude + verbal ability; weekly mocks.'), R('May', 'IPMAT, then personal interview.')] },
  nchm: { name: 'NCHM JEE', body: 'NTA', when: 'Usually April', url: 'https://exams.nta.ac.in/NCHM', counselling: { name: 'NCHM counselling', url: 'https://nchm.gov.in' }, roadmap: [R('Class 12', 'Aptitude for service sector, English, reasoning, GK.'), R('Apr', 'NCHM JEE; then counselling for IHMs.')] },
  ca: { name: 'CA Foundation', body: 'ICAI', when: 'Multiple sessions a year', url: 'https://www.icai.org', counselling: { name: 'ICAI registration', url: 'https://eservices.icai.org' }, roadmap: [R('After Class 12', 'Register with ICAI; prepare Accounting, Law, Maths & Economics.'), R('Next 4–5 yrs', 'Foundation → Intermediate → articleship → Final.')] },
  cseet: { name: 'CSEET', body: 'ICSI', when: 'Multiple sessions a year', url: 'https://www.icsi.edu', counselling: { name: 'ICSI registration', url: 'https://www.icsi.edu' }, roadmap: [R('After Class 12', 'CSEET → Executive → Professional programme.')] },
  ncet: { name: 'NCET (ITEP)', body: 'NTA', when: 'Usually mid-year', url: 'https://ncet.samarth.ac.in', counselling: { name: 'Institute counselling', url: 'https://ncet.samarth.ac.in' }, roadmap: [R('Class 12', 'Domain subjects, a language and teaching aptitude.'), R('Mid-year', 'NCET for the 4-year Integrated Teacher Education Programme.')] },
  merit: { name: 'Class 12 merit', body: 'Many state & private universities', when: 'After board results', url: 'https://www.google.com/search?q=university+admission+merit+list', counselling: { name: 'University portal', url: 'https://www.google.com/search?q=university+admission' }, roadmap: [R('Class 12', 'Score well in boards — many state universities admit on merit.')] },
}

/* -------------------------------------------------------------- courses */
// needs: every subject required · any: at least one of these
export const pathwayCourses = [
  { id: 'btech', field: 'Engineering & Tech', name: 'B.Tech / B.E.', duration: '4 years', needs: ['Physics', 'Chemistry', 'Maths'], exams: ['jeemain', 'jeeadv', 'bitsat', 'statecet'], public: 'IITs, NITs, IIITs, state govt engineering colleges', private: 'BITS Pilani, VIT, Manipal, Thapar', careers: ['Software engineer', 'Core engineer', 'PSU jobs via GATE'] },
  { id: 'barch', field: 'Engineering & Tech', name: 'B.Arch', duration: '5 years', needs: ['Physics', 'Chemistry', 'Maths'], exams: ['nata', 'jeemain'], public: 'SPA Delhi/Bhopal, NIT architecture departments', private: 'Private architecture colleges', careers: ['Architect', 'Urban planner', 'Interior designer'] },
  { id: 'bsms', field: 'Science & Research', name: 'BS-MS (Science research)', duration: '5 years', needs: ['Physics', 'Chemistry'], any: ['Maths', 'Biology'], exams: ['iat', 'nest'], public: 'IISERs, NISER, UM-DAE CEBS', private: '—', careers: ['Scientist', 'Researcher', 'Professor'] },
  { id: 'bsc', field: 'Science & Research', name: 'B.Sc (Physics / Maths / CS / Stats)', duration: '3–4 years', any: ['Maths', 'Physics'], exams: ['cuet', 'merit'], public: 'Central & state universities (DU, BHU…)', private: 'Christ, Amity, private universities', careers: ['Data analyst', 'Teacher', 'M.Sc & research'] },
  { id: 'bca', field: 'Engineering & Tech', name: 'BCA', duration: '3 years', any: ['Maths', 'Computer Science', 'Accountancy', 'Economics', 'Physics'], exams: ['cuet', 'merit'], public: 'State universities', private: 'Private universities & colleges', careers: ['Software developer', 'Web developer', 'MCA → IT jobs'] },
  { id: 'nda', field: 'Defence', name: 'NDA (Army / Navy / Air Force)', duration: '3 years + training', needs: ['Physics', 'Maths'], exams: ['nda'], public: 'National Defence Academy, Khadakwasla', private: '—', careers: ['Commissioned officer'], note: 'Army wing is open to any stream; Navy & Air Force need Physics and Maths.' },
  { id: 'mbbs', field: 'Medical & Health', name: 'MBBS', duration: '5.5 years (incl. internship)', needs: ['Physics', 'Chemistry', 'Biology'], exams: ['neet'], public: 'AIIMS, government medical colleges', private: 'Private & deemed medical colleges', careers: ['Doctor', 'MD/MS specialist', 'Public health'] },
  { id: 'bds', field: 'Medical & Health', name: 'BDS (Dental)', duration: '5 years', needs: ['Physics', 'Chemistry', 'Biology'], exams: ['neet'], public: 'Government dental colleges', private: 'Private dental colleges', careers: ['Dentist', 'Orthodontist (MDS)'] },
  { id: 'ayush', field: 'Medical & Health', name: 'BAMS / BHMS / BUMS (AYUSH)', duration: '5.5 years', needs: ['Physics', 'Chemistry', 'Biology'], exams: ['neet'], public: 'Government AYUSH colleges', private: 'Private AYUSH colleges', careers: ['Ayurveda / Homeopathy / Unani doctor'] },
  { id: 'bvsc', field: 'Medical & Health', name: 'B.V.Sc & A.H. (Veterinary)', duration: '5.5 years', needs: ['Physics', 'Chemistry', 'Biology'], exams: ['neet', 'statecet'], public: 'Veterinary colleges (VCI quota via NEET)', private: '—', careers: ['Veterinary doctor', 'Animal husbandry officer'] },
  { id: 'nursing', field: 'Medical & Health', name: 'B.Sc Nursing', duration: '4 years', needs: ['Physics', 'Chemistry', 'Biology'], exams: ['aiims_nursing'], public: 'AIIMS, government nursing colleges', private: 'Private nursing colleges', careers: ['Nursing officer', 'Nurse educator'] },
  { id: 'bpharm', field: 'Medical & Health', name: 'B.Pharm', duration: '4 years', needs: ['Physics', 'Chemistry'], any: ['Biology', 'Maths'], exams: ['statecet', 'cuet'], public: 'Government pharmacy colleges, NIPER (PG)', private: 'Private pharmacy colleges', careers: ['Pharmacist', 'Drug inspector', 'Pharma R&D'] },
  { id: 'allied', field: 'Medical & Health', name: 'Allied Health (BPT, BMLT, B.Optom, Radiology)', duration: '3–4.5 years', needs: ['Physics', 'Chemistry', 'Biology'], exams: ['statecet', 'merit'], public: 'AIIMS (paramedical), state universities', private: 'Private health-science universities', careers: ['Physiotherapist', 'Lab technologist', 'Optometrist', 'Radiographer'] },
  { id: 'bscbio', field: 'Science & Research', name: 'B.Sc Biotech / Life Sciences / Agriculture', duration: '3–4 years', needs: ['Chemistry', 'Biology'], exams: ['cuet', 'statecet'], public: 'Central universities, ICAR agriculture universities', private: 'Private universities', careers: ['Biotechnologist', 'Agriculture officer', 'Research'] },
  { id: 'bcom', field: 'Commerce & Management', name: 'B.Com / B.Com (Hons)', duration: '3–4 years', exams: ['cuet', 'merit'], public: 'DU, BHU, state universities', private: 'Christ, NMIMS, private colleges', careers: ['Accountant', 'Banking', 'Finance analyst'] },
  { id: 'ca', field: 'Commerce & Management', name: 'Chartered Accountancy (CA)', duration: '~4.5–5 years', exams: ['ca'], public: 'ICAI (professional course)', private: '—', careers: ['Chartered accountant', 'Auditor', 'Tax consultant'] },
  { id: 'cs', field: 'Commerce & Management', name: 'Company Secretary (CS)', duration: '~3–4 years', exams: ['cseet'], public: 'ICSI (professional course)', private: '—', careers: ['Company secretary', 'Compliance officer'] },
  { id: 'bba', field: 'Commerce & Management', name: 'BBA / 5-yr IPM', duration: '3–5 years', exams: ['ipmat', 'cuet'], public: 'IIM Indore & Rohtak (IPM), central universities', private: 'NMIMS, Symbiosis, Christ', careers: ['Manager', 'Marketing', 'Entrepreneur'] },
  { id: 'llb', field: 'Law, Arts & Media', name: 'BA LLB (5-year Law)', duration: '5 years', exams: ['clat', 'ailet', 'cuet'], public: 'National Law Universities, DU, BHU', private: 'Symbiosis, Jindal, private law schools', careers: ['Lawyer', 'Judge (judicial services)', 'Corporate counsel'] },
  { id: 'ba', field: 'Law, Arts & Media', name: 'BA (History, Pol. Science, Psychology, English…)', duration: '3–4 years', exams: ['cuet', 'merit'], public: 'DU, JNU, BHU, state universities', private: 'Ashoka, Christ, private universities', careers: ['Civil services (UPSC)', 'Teacher', 'Psychologist (with PG)'] },
  { id: 'bjmc', field: 'Law, Arts & Media', name: 'BJMC (Journalism & Mass Communication)', duration: '3 years', exams: ['cuet', 'merit'], public: 'Central & state universities', private: 'Private media schools', careers: ['Journalist', 'Content creator', 'PR & media'] },
  { id: 'bdes', field: 'Design & Hospitality', name: 'B.Des (Design / Fashion)', duration: '4 years', exams: ['nid', 'nift', 'uceed'], public: 'NID, NIFT, IIT design departments', private: 'MIT ID, Pearl, private design schools', careers: ['Product designer', 'UI/UX designer', 'Fashion designer'] },
  { id: 'bhm', field: 'Design & Hospitality', name: 'BHM (Hotel Management)', duration: '3–4 years', exams: ['nchm'], public: 'IHMs (Institutes of Hotel Management)', private: 'Private hotel-management colleges', careers: ['Hotel manager', 'Chef', 'Hospitality & tourism'] },
  { id: 'itep', field: 'Law, Arts & Media', name: 'ITEP (B.A./B.Sc./B.Com + B.Ed)', duration: '4 years', exams: ['ncet'], public: 'IITs, NITs, RIEs, central universities', private: '—', careers: ['School teacher'] },
]

export const isEligible = (course, have) => {
  const set = new Set(have)
  const allOk = (course.needs ?? []).every((s) => set.has(s))
  const anyOk = !course.any || course.any.some((s) => set.has(s))
  return allOk && anyOk
}

export const fields = ['Engineering & Tech', 'Medical & Health', 'Science & Research', 'Commerce & Management', 'Law, Arts & Media', 'Design & Hospitality', 'Defence']

/** Free notes & videos for a course: NCERT books + YouTube lessons + official syllabus. */
export const studyLinks = (course) => {
  const exam = exams[course.exams[0]]
  return [
    { kind: 'Notes', label: 'NCERT textbooks (Class 11–12), free', url: 'https://ncert.nic.in/textbook.php' },
    { kind: 'Notes', label: `${exam.name} official syllabus & notices`, url: exam.url },
    { kind: 'Videos', label: `${exam.name} preparation lectures (YouTube)`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${exam.name} preparation full course`)}` },
    { kind: 'Videos', label: `What is ${course.name}? Career talk (YouTube)`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${course.name} course career scope`)}` },
  ]
}
