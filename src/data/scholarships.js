// Amounts & eligibility are indicative summaries. Schemes change every year —
// the UI always asks students to confirm on the official portal.

export const scholarshipCategories = ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority', 'Girls', 'PwD']

export const scholarships = [
  {
    id: 'sc1', name: 'Central Sector Scheme of Scholarship for College & University Students', provider: 'Ministry of Education (NSP)', kind: 'government',
    amount: '₹12,000/yr (UG) · ₹20,000/yr (PG)', state: 'All India', courses: ['All'], categories: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority', 'Girls', 'PwD'],
    minMarks: 80, maxIncome: 450000, deadline: 'Usually Oct – Dec', url: 'https://scholarships.gov.in',
    eligibility: 'Above 80th percentile in Class 12 of your board, regular UG/PG course, family income ≤ ₹4.5 lakh.',
  },
  {
    id: 'sc2', name: 'AICTE Pragati Scholarship for Girls', provider: 'AICTE', kind: 'government',
    amount: '₹50,000/yr', state: 'All India', courses: ['B.Tech', 'B.Pharm', 'Diploma'], categories: ['Girls'],
    minMarks: 0, maxIncome: 800000, deadline: 'Usually Oct – Dec', url: 'https://www.aicte-india.org/schemes/students-development-schemes',
    eligibility: 'Girl students admitted to 1st/2nd year (lateral) of an AICTE-approved degree/diploma; family income ≤ ₹8 lakh.',
  },
  {
    id: 'sc3', name: 'AICTE Saksham Scholarship', provider: 'AICTE', kind: 'government',
    amount: '₹50,000/yr', state: 'All India', courses: ['B.Tech', 'B.Pharm', 'Diploma'], categories: ['PwD'],
    minMarks: 0, maxIncome: 800000, deadline: 'Usually Oct – Dec', url: 'https://www.aicte-india.org/schemes/students-development-schemes',
    eligibility: 'Students with disability ≥ 40% in AICTE-approved technical courses; family income ≤ ₹8 lakh.',
  },
  {
    id: 'sc4', name: 'Post-Matric Scholarship for SC/ST/OBC Students', provider: 'Central & State Governments', kind: 'government',
    amount: 'Tuition fee + maintenance allowance', state: 'All India', courses: ['All'], categories: ['SC', 'ST', 'OBC'],
    minMarks: 0, maxIncome: 250000, deadline: 'Varies by state', url: 'https://scholarships.gov.in',
    eligibility: 'SC/ST/OBC students in post-matric courses. Income limits differ by scheme and state.',
  },
  {
    id: 'sc5', name: 'Mukhyamantri Medhavi Vidyarthi Yojana (MMVY)', provider: 'Government of Madhya Pradesh', kind: 'government',
    amount: 'Full tuition fee', state: 'Madhya Pradesh', courses: ['B.Tech', 'MBBS', 'B.Sc', 'B.Com', 'BA', 'BBA'], categories: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority', 'Girls', 'PwD'],
    minMarks: 70, maxIncome: 600000, deadline: 'Usually after admission', url: 'https://scholarshipportal.mp.nic.in',
    eligibility: 'MP domicile, ≥ 70% in MP Board 12th (≥ 85% CBSE/ICSE), family income ≤ ₹6 lakh.',
  },
  {
    id: 'sc6', name: 'Mukhyamantri Uchch Shiksha Chhatravriti Yojana', provider: 'Government of Rajasthan', kind: 'government',
    amount: '₹5,000/yr', state: 'Rajasthan', courses: ['All'], categories: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority', 'Girls', 'PwD'],
    minMarks: 60, maxIncome: 250000, deadline: 'Usually Sep – Nov', url: 'https://hte.rajasthan.gov.in',
    eligibility: 'Rajasthan domicile in the board merit list, family income ≤ ₹2.5 lakh.',
  },
  {
    id: 'sc7', name: 'UP Post-Matric Scholarship', provider: 'Government of Uttar Pradesh', kind: 'government',
    amount: 'Fee reimbursement + allowance', state: 'Uttar Pradesh', courses: ['All'], categories: ['General', 'OBC', 'SC', 'ST', 'Minority'],
    minMarks: 0, maxIncome: 250000, deadline: 'Usually Jul – Nov', url: 'https://scholarship.up.gov.in',
    eligibility: 'UP domicile students in post-matric courses. Income limit varies by category.',
  },
  {
    id: 'sc8', name: 'INSPIRE Scholarship for Higher Education (SHE)', provider: 'Department of Science & Technology', kind: 'government',
    amount: '₹80,000/yr', state: 'All India', courses: ['B.Sc', 'Integrated M.Sc'], categories: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority', 'Girls', 'PwD'],
    minMarks: 85, maxIncome: 99999999, deadline: 'Usually Oct – Dec', url: 'https://online-inspire.gov.in',
    eligibility: 'Top 1% in Class 12 board (or JEE/NEET rank criteria) pursuing natural/basic sciences.',
  },
  {
    id: 'sc9', name: 'Reliance Foundation Undergraduate Scholarship', provider: 'Reliance Foundation', kind: 'private',
    amount: 'Up to ₹2 lakh (over the degree)', state: 'All India', courses: ['All'], categories: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority', 'Girls', 'PwD'],
    minMarks: 60, maxIncome: 1500000, deadline: 'Usually Sep – Oct', url: 'https://www.scholarships.reliancefoundation.org',
    eligibility: '1st-year UG students, 60%+ in Class 12, aptitude test, family income below ₹15 lakh (preference < ₹2.5 lakh).',
  },
  {
    id: 'sc10', name: 'Kotak Kanya Scholarship', provider: 'Kotak Education Foundation', kind: 'private',
    amount: '₹1.5 lakh/yr', state: 'All India', courses: ['B.Tech', 'MBBS', 'B.Arch', 'LLB'], categories: ['Girls'],
    minMarks: 75, maxIncome: 600000, deadline: 'Usually Aug – Sep', url: 'https://kotakeducationfoundation.org',
    eligibility: 'Meritorious girl students in 1st year of professional courses, 75%+ in Class 12, family income ≤ ₹6 lakh.',
  },
  {
    id: 'sc11', name: 'HDFC Badhte Kadam Scholarship', provider: 'HDFC Bank', kind: 'private',
    amount: 'Up to ₹1 lakh', state: 'All India', courses: ['All'], categories: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority', 'Girls', 'PwD'],
    minMarks: 60, maxIncome: 600000, deadline: 'Varies', url: 'https://www.buddy4study.com',
    eligibility: 'Students facing financial hardship; merit and need-based. Check Buddy4Study for current cycle.',
  },
  {
    id: 'sc12', name: 'Tata Capital Pankh Scholarship', provider: 'Tata Capital', kind: 'private',
    amount: 'Up to 80% of fees', state: 'All India', courses: ['All'], categories: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority', 'Girls', 'PwD'],
    minMarks: 60, maxIncome: 250000, deadline: 'Varies', url: 'https://www.buddy4study.com',
    eligibility: 'Students in Class 11 to UG with 60%+ marks and family income ≤ ₹2.5 lakh.',
  },
]
