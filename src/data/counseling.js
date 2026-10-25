// Alternative careers when a target exam doesn't go as planned, plus support resources.
// Admission routes change every year — always confirm on official counselling sites.

export const helplines = [
  { name: 'Tele-MANAS', by: 'Ministry of Health & Family Welfare, Govt. of India', phone: '14416', alt: '1-800-891-4416', text: 'Free, confidential mental-health support, 24×7, in many Indian languages.' },
  { name: 'Emergency', by: 'All-India emergency number', phone: '112', text: 'If you or a friend are in immediate danger, call now.' },
]

const A = (name, duration, route, why, careers) => ({ name, duration, route, why, careers })

export const alternatives = {
  neet: {
    exam: 'NEET UG', icon: 'Stethoscope', headline: 'Healthcare needs far more than doctors — and many of these roles are in high demand.',
    options: [
      A('BAMS / BHMS / BUMS (AYUSH)', '5.5 yrs', 'Same NEET score — usually lower cut-offs than MBBS', 'You still become a registered doctor in a recognised system of medicine.', ['AYUSH doctor', 'Wellness centres', 'Government AYUSH posts']),
      A('BDS (Dental)', '5 yrs', 'NEET counselling (MCC & state)', 'Clinical career with your own practice possible.', ['Dentist', 'MDS specialist']),
      A('B.Pharm', '4 yrs', 'State CET / CUET / merit — NEET usually not needed', 'Pharma is one of India’s biggest industries.', ['Pharmacist', 'Drug inspector', 'Clinical research']),
      A('BPT (Physiotherapy)', '4.5 yrs', 'State / university entrance or merit', 'Sports, rehab and elder care are growing fast.', ['Physiotherapist', 'Sports physio']),
      A('B.Sc Nursing', '4 yrs', 'AIIMS / state nursing entrance', 'Strong demand in India and abroad.', ['Nursing officer', 'ICU specialist']),
      A('B.Sc MLT / Radiology / Optometry', '3–4 yrs', 'University entrance or merit', 'Every hospital and lab needs these specialists.', ['Lab technologist', 'Radiographer', 'Optometrist']),
      A('B.Sc Biotechnology / Microbiology', '3 yrs', 'CUET / merit', 'Research, vaccines, food & environment labs.', ['Biotechnologist', 'Research scientist']),
      A('B.Sc Nutrition & Dietetics', '3 yrs', 'CUET / merit', 'Hospitals, fitness and food industry.', ['Dietitian', 'Nutritionist']),
      A('B.V.Sc & A.H. (Veterinary)', '5.5 yrs', 'NEET (VCI quota) / state CET', 'Doctor for animals — rural demand is huge.', ['Veterinary doctor']),
    ],
  },
  jee: {
    exam: 'JEE Main / Advanced', icon: 'Cog', headline: 'An IIT or NIT is one route — not the only one to a great tech career.',
    options: [
      A('B.Tech via State CETs', '4 yrs', 'MHT CET, KCET, WBJEE, AP/TS EAPCET…', 'Good government colleges at low fees in your own state.', ['Software engineer', 'Core engineer']),
      A('B.Tech at private universities', '4 yrs', 'BITSAT, VITEEE, MET and similar', 'Strong placements at many private institutes.', ['Software engineer']),
      A('BS-MS / Integrated M.Sc', '5 yrs', 'IISER IAT, NEST', 'World-class science research, scholarships available.', ['Scientist', 'Researcher']),
      A('B.Sc (CS / Maths / Stats / Data Science)', '3–4 yrs', 'CUET / merit', 'Leads to MCA, M.Sc, data roles — and GATE later.', ['Data analyst', 'Developer']),
      A('BCA → MCA', '3 + 2 yrs', 'Merit / CUET', 'Direct path to software jobs.', ['Software developer']),
      A('Diploma → lateral-entry B.Tech', '3 + 3 yrs', 'State polytechnic entrance', 'Earn while you learn; join B.Tech in 2nd year.', ['Technician', 'Engineer']),
      A('Merchant Navy', '3–4 yrs', 'IMU CET', 'Travel the world with a well-paid career.', ['Deck officer', 'Marine engineer']),
      A('NDA (technical branches)', '3 yrs + training', 'UPSC NDA', 'Serve the nation as an officer.', ['Army/Navy/Air Force officer']),
    ],
  },
  clat: {
    exam: 'CLAT / AILET', icon: 'Scale', headline: 'Law schools beyond NLUs, and careers that use the same skills.',
    options: [
      A('BA LLB at state & private universities', '5 yrs', 'CUET / university tests (e.g. SLAT)', 'Many excellent law faculties outside NLUs.', ['Lawyer', 'Judicial services']),
      A('3-year LLB after graduation', '3 + 3 yrs', 'Any degree, then LLB entrance', 'Try again later with a degree in hand.', ['Lawyer']),
      A('BA (Political Science / Public Policy)', '3–4 yrs', 'CUET / merit', 'Strong base for UPSC and policy careers.', ['Civil services', 'Policy analyst']),
      A('BJMC (Journalism)', '3 yrs', 'CUET / merit', 'Uses your reading, writing and current-affairs skills.', ['Journalist', 'Content strategist']),
    ],
  },
  ca: {
    exam: 'CA Foundation / Inter', icon: 'Calculator', headline: 'Finance has many respected professional routes.',
    options: [
      A('CMA (Cost & Management Accountant)', '~3–4 yrs', 'ICMAI', 'Costing & management roles in industry.', ['Cost accountant', 'Finance manager']),
      A('CS (Company Secretary)', '~3–4 yrs', 'ICSI CSEET', 'Corporate law & compliance careers.', ['Company secretary']),
      A('B.Com + banking exams', '3 yrs', 'CUET / merit, then IBPS / SBI PO', 'Stable government banking jobs.', ['Bank PO', 'Clerk']),
      A('BBA / MBA (Finance)', '3 + 2 yrs', 'CUET, then CAT / MAT', 'Corporate finance & consulting.', ['Finance analyst']),
    ],
  },
}

export const dropYearCheck = [
  'Did you miss the cut-off by a small margin (and know exactly which chapters cost you marks)?',
  'Can your family support one more year without heavy pressure on you?',
  'Do you still enjoy this field — not just the idea of the title?',
  'Would you be OK taking a parallel course (e.g. a B.Sc) as a safety net?',
]

// Demo counsellor profiles — volunteer mentors on the platform.
export const counselors = [
  { name: 'Dr. Neha Kulkarni', role: 'Career counsellor · Medical & allied health', langs: 'Hindi, English, Marathi', slots: 'Mon–Sat, 5–8 PM' },
  { name: 'Rahul Mishra', role: 'Senior mentor · Engineering & tech careers', langs: 'Hindi, English', slots: 'Weekends' },
  { name: 'Anjali Verma', role: 'Student well-being mentor', langs: 'Hindi, English', slots: 'Daily, 6–9 PM' },
]
