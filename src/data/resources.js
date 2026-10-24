// Study resources: Course → University → Year → Semester → Subject.
// Subjects follow the common curriculum pattern of the listed universities.
// Files are placeholders in the demo — uploads come from verified contributors.

export const courses = [
  {
    id: 'btech', name: 'B.Tech', full: 'Bachelor of Technology', years: 4, branch: 'Computer Science (CSE)',
    universities: ['rgpv', 'aktu', 'davv', 'dtu'], color: 'from-blue-500 to-indigo-600',
    semesters: {
      1: ['Engineering Chemistry', 'Mathematics-I', 'English for Communication', 'Basic Electrical & Electronics Engg.', 'Engineering Graphics'],
      2: ['Engineering Physics', 'Mathematics-II', 'Basic Mechanical Engg.', 'Basic Civil Engg. & Mechanics', 'Basic Computer Engg. (C++)'],
      3: ['Energy & Environmental Engg.', 'Discrete Structures', 'Data Structures', 'Digital Systems', 'Object Oriented Programming'],
      4: ['Mathematics-III', 'Analog & Digital Communication', 'Analysis & Design of Algorithms', 'Software Engineering', 'Computer Organization & Architecture'],
      5: ['Theory of Computation', 'Database Management Systems', 'Operating Systems', 'Cyber Security', 'Data Analytics (Python)'],
      6: ['Machine Learning', 'Computer Networks', 'Compiler Design', 'Project Management', 'Web Technology'],
      7: ['Cloud Computing', 'Artificial Intelligence', 'Information Retrieval', 'Major Project-I'],
      8: ['Internet of Things', 'Blockchain Technology', 'Big Data', 'Major Project-II'],
    },
  },
  {
    id: 'mbbs', name: 'MBBS', full: 'Bachelor of Medicine & Surgery', years: 4, branch: 'Professional years (NMC CBME)',
    universities: ['aiims-bhopal'], color: 'from-rose-500 to-pink-600',
    semesters: {
      1: ['Anatomy', 'Physiology'], 2: ['Biochemistry', 'Foundation Course & AETCOM'],
      3: ['Pathology', 'Microbiology'], 4: ['Pharmacology', 'Forensic Medicine'],
      5: ['Community Medicine', 'ENT'], 6: ['Ophthalmology', 'Community Medicine (Part II)'],
      7: ['General Medicine', 'General Surgery', 'Paediatrics'], 8: ['Obstetrics & Gynaecology', 'Orthopaedics', 'Clinical Postings'],
    },
  },
  {
    id: 'bsc', name: 'B.Sc', full: 'Bachelor of Science', years: 3, branch: 'PCM / Physics Honours',
    universities: ['davv', 'du', 'uniraj', 'lu'], color: 'from-emerald-500 to-teal-600',
    semesters: {
      1: ['Mechanics', 'Calculus', 'Inorganic Chemistry-I', 'Environmental Studies'],
      2: ['Electricity & Magnetism', 'Differential Equations', 'Organic Chemistry-I'],
      3: ['Waves & Optics', 'Real Analysis', 'Physical Chemistry'],
      4: ['Thermal Physics', 'Group Theory', 'Mathematical Physics'],
      5: ['Quantum Mechanics', 'Solid State Physics', 'Numerical Methods'],
      6: ['Nuclear & Particle Physics', 'Electronics', 'Project / Dissertation'],
    },
  },
  {
    id: 'bcom', name: 'B.Com', full: 'Bachelor of Commerce', years: 3, branch: 'General / Honours',
    universities: ['du', 'lu', 'davv', 'rtmnu'], color: 'from-amber-500 to-orange-600',
    semesters: {
      1: ['Financial Accounting', 'Business Organisation', 'Business Communication'],
      2: ['Corporate Accounting', 'Business Law', 'Micro Economics'],
      3: ['Cost Accounting', 'Company Law', 'Macro Economics'],
      4: ['Income Tax', 'Business Statistics', 'Banking & Insurance'],
      5: ['Management Accounting', 'Auditing', 'GST & Indirect Taxes'],
      6: ['Financial Management', 'Entrepreneurship', 'E-Commerce'],
    },
  },
  {
    id: 'bba', name: 'BBA', full: 'Bachelor of Business Administration', years: 3, branch: 'General',
    universities: ['davv', 'lnct', 'lu', 'dtu'], color: 'from-violet-500 to-purple-600',
    semesters: {
      1: ['Principles of Management', 'Business Mathematics', 'Financial Accounting'],
      2: ['Organisational Behaviour', 'Business Economics', 'Business Communication'],
      3: ['Marketing Management', 'Cost Accounting', 'Business Statistics'],
      4: ['Human Resource Management', 'Financial Management', 'Research Methodology'],
      5: ['Digital Marketing', 'Strategic Management', 'Summer Internship Report'],
      6: ['Entrepreneurship & Startups', 'International Business', 'Major Project'],
    },
  },
  {
    id: 'ba', name: 'BA', full: 'Bachelor of Arts', years: 3, branch: 'Political Science / History / Economics',
    universities: ['du', 'uniraj', 'lu', 'rtmnu'], color: 'from-sky-500 to-cyan-600',
    semesters: {
      1: ['Indian Political Thought', 'Ancient Indian History', 'Introductory Microeconomics'],
      2: ['Indian Constitution', 'Medieval India', 'Introductory Macroeconomics'],
      3: ['Comparative Politics', 'Modern India (1757–1857)', 'Indian Economy'],
      4: ['Public Administration', 'Indian National Movement', 'Development Economics'],
      5: ['International Relations', 'World History', 'Public Finance'],
      6: ['Contemporary Political Issues', 'History of Modern Europe', 'Environmental Economics'],
    },
  },
]

export const resourceTypes = [
  { id: 'notes', label: 'Notes' },
  { id: 'syllabus', label: 'Syllabus' },
  { id: 'pyq', label: 'PYQs' },
  { id: 'links', label: 'Reference Links' },
]

const refLinks = (subject) => [
  { title: `NPTEL courses on ${subject}`, url: `https://nptel.ac.in/courses?searchText=${encodeURIComponent(subject)}`, source: 'NPTEL' },
  { title: `SWAYAM — ${subject}`, url: `https://swayam.gov.in/explorer?searchText=${encodeURIComponent(subject)}`, source: 'SWAYAM' },
  { title: `Free video lectures — ${subject}`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(subject + ' lecture')}`, source: 'YouTube' },
]

/** Builds the resource bundle for one subject (demo data). */
export const resourcesFor = (subject, uniShort) => ({
  notes: [
    { title: `${subject} — Complete Unit-wise Notes`, pages: 86, by: 'Verified contributor', downloads: 1240 },
    { title: `${subject} — Quick Revision (1 night before exam)`, pages: 18, by: 'Student Setu Team', downloads: 3120 },
  ],
  syllabus: [{ title: `${uniShort} ${subject} syllabus (latest scheme)`, pages: 2, by: uniShort, downloads: 860 }],
  pyq: [2024, 2023, 2022, 2021].map((y) => ({ title: `${uniShort} ${subject} — ${y} question paper`, pages: 2, by: uniShort, downloads: 400 + (y % 7) * 90 })),
  links: refLinks(subject),
})
