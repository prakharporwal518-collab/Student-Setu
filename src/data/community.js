// Local students, area guides, city communities and testimonials.

export const students = [
  { id: 's1', name: 'Ananya Sharma', college: 'rgpv', course: 'B.Tech CSE', year: 3, city: 'bhopal', area: 'Ayodhya Bypass', verified: true, bio: 'Web dev + DSA in C++. Happy to help freshers find PGs near RGPV.', interests: ['Web Dev', 'DSA', 'Hackathons'], helped: 42 },
  { id: 's2', name: 'Rohit Verma', college: 'davv', course: 'B.Sc Physics', year: 2, city: 'indore', area: 'Bhawarkuan', verified: true, bio: 'Know every good mess around Bhawarkuan. Ask me about coaching too!', interests: ['Physics', 'Cricket'], helped: 27 },
  { id: 's3', name: 'Sneha Patel', college: 'lnct', course: 'BBA', year: 3, city: 'bhopal', area: 'Raisen Road', verified: true, bio: 'Marketing club lead. Can guide on internships for BBA students.', interests: ['Marketing', 'Public Speaking'], helped: 35 },
  { id: 's4', name: 'Aditya Singh', college: 'manit', course: 'B.Tech ECE', year: 4, city: 'bhopal', area: 'MANIT Campus', verified: true, bio: 'Placed at a product company. Ask me about placements and GATE.', interests: ['VLSI', 'GATE'], helped: 58 },
  { id: 's5', name: 'Priya Nair', college: 'aiims-bhopal', course: 'MBBS', year: 2, city: 'bhopal', area: 'Saket Nagar', verified: true, bio: 'Can share anatomy notes and tips for surviving 1st prof.', interests: ['Medicine', 'Music'], helped: 19 },
  { id: 's6', name: 'Harsh Jain', college: 'rgpv', course: 'B.Tech IT', year: 2, city: 'bhopal', area: 'Anand Nagar', verified: false, bio: 'Learning React and ML. Looking for hackathon teammates.', interests: ['React', 'ML'], helped: 6 },
  { id: 's7', name: 'Megha Rathi', college: 'iit-indore', course: 'B.Tech CSE', year: 3, city: 'indore', area: 'Simrol', verified: true, bio: 'Open source contributor (GSoC). Happy to mentor juniors.', interests: ['Open Source', 'AI/ML'], helped: 64 },
  { id: 's8', name: 'Kunal Mehta', college: 'sgsits', course: 'B.Tech Mechanical', year: 4, city: 'indore', area: 'Palasia', verified: true, bio: 'SAE BAJA team captain. Ask about core internships.', interests: ['Automobile', 'CAD'], helped: 22 },
  { id: 's9', name: 'Simran Kaur', college: 'du', course: 'BA Economics', year: 2, city: 'delhi', area: 'North Campus', verified: true, bio: 'Hindu College. Know North Campus PGs and the best momos spots.', interests: ['Economics', 'Debate'], helped: 48 },
  { id: 's10', name: 'Abhishek Yadav', college: 'du', course: 'BA Political Science', year: 3, city: 'delhi', area: 'Mukherjee Nagar', verified: true, bio: 'UPSC aspirant. Can guide on coaching vs self-study.', interests: ['UPSC', 'History'], helped: 71 },
  { id: 's11', name: 'Aarav Gupta', college: 'dtu', course: 'B.Tech SE', year: 4, city: 'delhi', area: 'Rohini', verified: true, bio: 'SDE intern last summer. Resume reviews on weekends.', interests: ['System Design', 'DSA'], helped: 39 },
  { id: 's12', name: 'Tanvi Shekhawat', college: 'mnit', course: 'B.Arch', year: 3, city: 'jaipur', area: 'Malviya Nagar', verified: true, bio: 'Design + architecture. Ask me about Jaipur’s student areas.', interests: ['Design', 'Photography'], helped: 17 },
  { id: 's13', name: 'Shivam Tripathi', college: 'lu', course: 'B.Com', year: 2, city: 'lucknow', area: 'Aliganj', verified: false, bio: 'CA Foundation cleared. Can help with accounts & commerce notes.', interests: ['Finance', 'CA'], helped: 9 },
  { id: 's14', name: 'Sakshi Deshpande', college: 'vnit', course: 'B.Tech Civil', year: 3, city: 'nagpur', area: 'Dharampeth', verified: true, bio: 'Can help girls find safe PGs in Nagpur.', interests: ['Civil', 'Volunteering'], helped: 26 },
]

export const areaGuides = [
  {
    id: 'g1', city: 'bhopal', area: 'Ayodhya Bypass', author: 's1',
    summary: 'Closest residential area to RGPV with dozens of PGs and tiffin services. Quiet and student-dominated.',
    scores: { study: 4.5, safety: 4.2, transport: 3.8, cost: 4.4 },
    costOfLiving: '₹6,000 – ₹9,000 / month (stay + food)',
    transport: 'Shared autos to RGPV & Habibganj; BRTS stop 2 km away.',
    markets: ['Ayodhya Nagar Market', 'Patel Nagar Sabzi Mandi', 'DMart Ayodhya Bypass'],
    tips: ['Book PGs before July — seats fill fast in admission season', 'Carry a raincoat; roads flood in monsoon'],
  },
  {
    id: 'g2', city: 'bhopal', area: 'MP Nagar', author: 's4',
    summary: 'Commercial heart of Bhopal and coaching hub. Busy, well-connected, everything available 24×7.',
    scores: { study: 3.8, safety: 4.4, transport: 4.8, cost: 3.5 },
    costOfLiving: '₹8,000 – ₹12,000 / month',
    transport: 'BRTS corridor, city buses and metro (Priority Corridor) nearby.',
    markets: ['MP Nagar Zone-I & II', 'DB Mall', 'Board Office Square'],
    tips: ['Great for coaching students', 'Noise can be high near main road — pick inner lanes'],
  },
  {
    id: 'g3', city: 'indore', area: 'Bhawarkuan', author: 's2',
    summary: 'Indore’s coaching capital. Cheap rooms, endless food options, very student-friendly.',
    scores: { study: 4.3, safety: 4.0, transport: 4.2, cost: 4.7 },
    costOfLiving: '₹5,000 – ₹8,000 / month',
    transport: 'i-Bus BRTS stop at Bhawarkuan square; magic/autos everywhere.',
    markets: ['Bhawarkuan Square', 'Chappan Dukan (20 min)', 'Sarafa night market'],
    tips: ['Try Sarafa at night at least once', 'Indore is safe late at night compared to most cities'],
  },
  {
    id: 'g4', city: 'delhi', area: 'North Campus', author: 's9',
    summary: 'Vibrant area around DU’s top colleges. Expensive but unbeatable for college life.',
    scores: { study: 4.6, safety: 4.1, transport: 4.9, cost: 2.8 },
    costOfLiving: '₹14,000 – ₹20,000 / month',
    transport: 'Vishwavidyalaya & GTB Nagar metro stations (Yellow Line).',
    markets: ['Kamla Nagar Market', 'Hudson Lane', 'Majnu ka Tilla'],
    tips: ['Check PG owner agreements carefully', 'Metro student cards save a lot'],
  },
  {
    id: 'g5', city: 'jaipur', area: 'Malviya Nagar', author: 's12',
    summary: 'Clean, planned area near MNIT and many coaching centres with malls and cafes.',
    scores: { study: 4.2, safety: 4.5, transport: 4.0, cost: 3.9 },
    costOfLiving: '₹7,000 – ₹11,000 / month',
    transport: 'City buses and e-rickshaws; metro at Mansarovar.',
    markets: ['World Trade Park', 'Gaurav Tower', 'Malviya Nagar Sector 6 Market'],
    tips: ['Summers are intense — prefer rooms with coolers or AC'],
  },
  {
    id: 'g6', city: 'nagpur', area: 'Dharampeth', author: 's14',
    summary: 'Upscale, safe locality close to VNIT with great street food.',
    scores: { study: 4.4, safety: 4.7, transport: 4.1, cost: 3.6 },
    costOfLiving: '₹7,000 – ₹10,000 / month',
    transport: 'Nagpur Metro (Aqua line) + autos.',
    markets: ['Dharampeth Market', 'Shankar Nagar', 'Sitabuldi Main Road'],
    tips: ['Try the famous tarri poha', 'Monsoon is pleasant; summers reach 45°C'],
  },
]

// Join links are added by verified city admins. `#` = not yet published in the demo.
export const communities = [
  { city: 'bhopal', members: 4820, whatsapp: '#', telegram: '#', groups: ['RGPV Freshers 2025', 'Bhopal PG & Room Finder', 'MP Nagar Coaching Circle'] },
  { city: 'indore', members: 3910, whatsapp: '#', telegram: '#', groups: ['DAVV Students', 'Indore Tech Community', 'Bhawarkuan Aspirants'] },
  { city: 'delhi', members: 7350, whatsapp: '#', telegram: '#', groups: ['DU North Campus', 'UPSC Mukherjee Nagar', 'Delhi Tech Students'] },
  { city: 'jaipur', members: 2440, whatsapp: '#', telegram: '#', groups: ['MNIT Juniors', 'Jaipur Room Finder'] },
  { city: 'lucknow', members: 2105, whatsapp: '#', telegram: '#', groups: ['LU Students Union (unofficial)', 'AKTU Notes Exchange'] },
  { city: 'nagpur', members: 1690, whatsapp: '#', telegram: '#', groups: ['VNIT Freshers', 'Nagpur Students Hub'] },
]

export const testimonials = [
  { name: 'Ananya Sharma', photo: 'KxHcyNOIO_M', meta: 'B.Tech, RGPV', rating: 5, text: 'Skill Bridge showed my RGPV syllabus covered only a quarter of what web-developer roles need. The weekly plan filled the rest — I got my first internship!' },
  { name: 'Rohit Verma', photo: 'Y_fmOp3Gnu0', meta: 'B.Sc, DAVV', rating: 5, text: 'Free PYQs and topic quizzes with explanations helped me clear my semester. Listening to notes in Hindi on the bus is a life-saver.' },
  { name: 'Sneha Patel', photo: 'ekzJvt0xFGw', meta: 'BBA, LNCT', rating: 5, text: 'I earned verified badges in Digital Marketing and Excel — recruiters could check them with one link. Everything is in one place.' },
  { name: 'Aarav Gupta', photo: '5VOlFFnVG1Q', meta: 'B.Tech, DTU', rating: 5, text: 'Got my first internship through the year-wise guidance. The roadmap for 2nd years is gold.' },
  { name: 'Prof. Meena Joshi', meta: 'Govt. College, Bhopal', rating: 5, text: 'Teacher Copilot drafts my lesson plan and quiz in minutes, and the heatmap tells me which topic to re-teach.' },
]
