// Skills & video learning. Free courses link to the original providers.
// Video links use YouTube search so they never point to removed videos.
const yt = (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`

export const skillCategories = [
  {
    id: 'dsa', name: 'DSA in C++', icon: 'Binary', color: 'from-indigo-500 to-blue-600', learners: 18400,
    blurb: 'Crack coding rounds with a structured C++ problem-solving path.',
    roadmap: ['C++ basics, STL & complexity', 'Arrays, strings, hashing', 'Recursion & backtracking', 'Linked lists, stacks, queues', 'Trees & BST', 'Graphs (BFS/DFS, shortest paths)', 'Dynamic programming', 'Mock interviews & contests'],
    courses: [
      { title: 'LearnCpp.com — free C++ tutorial', provider: 'LearnCpp', url: 'https://www.learncpp.com', level: 'Beginner' },
      { title: 'NeetCode Roadmap (150 problems)', provider: 'NeetCode', url: 'https://neetcode.io/roadmap', level: 'Intermediate' },
      { title: 'LeetCode Problem Set', provider: 'LeetCode', url: 'https://leetcode.com/problemset/', level: 'All levels' },
      { title: 'C++ Developer Roadmap', provider: 'roadmap.sh', url: 'https://roadmap.sh/cpp', level: 'All levels' },
    ],
    videos: [
      { title: 'C++ DSA full course (Hindi)', channel: 'Apna College', url: yt('Apna College C++ DSA course'), duration: 'Playlist' },
      { title: 'Striver A2Z DSA explanations', channel: 'take U forward', url: yt('take U forward striver A2Z DSA'), duration: 'Playlist' },
      { title: 'Dynamic Programming patterns', channel: 'Aditya Verma', url: yt('Aditya Verma dynamic programming playlist'), duration: 'Playlist' },
    ],
  },
  {
    id: 'web', name: 'Web Development', icon: 'Code2', color: 'from-sky-500 to-cyan-600', learners: 22100,
    blurb: 'From HTML to full-stack React + Node apps you can deploy.',
    roadmap: ['HTML, CSS & responsive design', 'JavaScript fundamentals', 'Git & GitHub', 'React + Tailwind', 'Node.js & Express APIs', 'Databases (MongoDB / PostgreSQL)', 'Auth, deployment & CI', 'Build 3 portfolio projects'],
    courses: [
      { title: 'Responsive Web Design & JS certifications', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn', level: 'Beginner' },
      { title: 'The Odin Project — Full Stack JavaScript', provider: 'The Odin Project', url: 'https://www.theodinproject.com', level: 'Beginner → Intermediate' },
      { title: 'Full Stack Open', provider: 'University of Helsinki', url: 'https://fullstackopen.com/en/', level: 'Intermediate' },
      { title: 'MDN Learn Web Development', provider: 'MDN', url: 'https://developer.mozilla.org/en-US/docs/Learn', level: 'All levels' },
    ],
    videos: [
      { title: 'Web development full course (Hindi)', channel: 'CodeWithHarry', url: yt('CodeWithHarry web development course'), duration: 'Playlist' },
      { title: 'React full course for beginners', channel: 'freeCodeCamp.org', url: yt('freeCodeCamp React full course'), duration: '10h+' },
      { title: 'Build & deploy a MERN app', channel: 'JavaScript Mastery', url: yt('JavaScript Mastery MERN project'), duration: '3h' },
    ],
  },
  {
    id: 'aiml', name: 'AI / Machine Learning', icon: 'Brain', color: 'from-fuchsia-500 to-purple-600', learners: 16700,
    blurb: 'Math intuition, Python, classical ML, deep learning and GenAI.',
    roadmap: ['Python + NumPy/Pandas', 'Linear algebra, probability & statistics', 'Classical ML with scikit-learn', 'Model evaluation & feature engineering', 'Deep learning (PyTorch)', 'NLP & transformers', 'LLM apps (RAG, agents)', 'Kaggle + real-world projects'],
    courses: [
      { title: 'Machine Learning Specialization (audit free)', provider: 'Coursera · DeepLearning.AI', url: 'https://www.coursera.org/specializations/machine-learning-introduction', level: 'Beginner' },
      { title: 'Machine Learning Crash Course', provider: 'Google', url: 'https://developers.google.com/machine-learning/crash-course', level: 'Beginner' },
      { title: 'Practical Deep Learning for Coders', provider: 'fast.ai', url: 'https://course.fast.ai', level: 'Intermediate' },
      { title: 'Kaggle Learn micro-courses', provider: 'Kaggle', url: 'https://www.kaggle.com/learn', level: 'All levels' },
    ],
    videos: [
      { title: 'Neural networks, visually', channel: '3Blue1Brown', url: yt('3Blue1Brown neural networks'), duration: 'Series' },
      { title: 'Complete ML playlist (Hindi)', channel: 'CampusX', url: yt('CampusX 100 days of machine learning'), duration: 'Playlist' },
      { title: 'Build GPT from scratch', channel: 'Andrej Karpathy', url: yt('Andrej Karpathy let\'s build GPT'), duration: '2h' },
    ],
  },
  {
    id: 'sysdesign', name: 'System Design', icon: 'Network', color: 'from-slate-600 to-slate-800', learners: 7900,
    blurb: 'Scalability, databases, caching and real interview case studies.',
    roadmap: ['Networking & HTTP basics', 'Databases, indexing & sharding', 'Caching & CDNs', 'Load balancing & queues', 'Consistency & CAP', 'Design URL shortener, chat, feed', 'Low-level design (OOP patterns)'],
    courses: [
      { title: 'The System Design Primer', provider: 'GitHub (open source)', url: 'https://github.com/donnemartin/system-design-primer', level: 'Intermediate' },
      { title: 'System Design Roadmap', provider: 'roadmap.sh', url: 'https://roadmap.sh/system-design', level: 'All levels' },
    ],
    videos: [
      { title: 'System design for beginners', channel: 'Gaurav Sen', url: yt('Gaurav Sen system design'), duration: 'Playlist' },
      { title: 'Low level design in Hindi', channel: 'Concept && Coding', url: yt('Concept and Coding low level design'), duration: 'Playlist' },
    ],
  },
  {
    id: 'design', name: 'UI/UX Design', icon: 'Palette', color: 'from-pink-500 to-rose-600', learners: 6800,
    blurb: 'Design thinking, Figma, prototyping and a portfolio that gets noticed.',
    roadmap: ['Design principles & typography', 'Colour & layout', 'Figma basics', 'Wireframes & prototypes', 'User research & testing', 'Case-study portfolio'],
    courses: [
      { title: 'Google UX Design Certificate (financial aid)', provider: 'Coursera · Google', url: 'https://www.coursera.org/professional-certificates/google-ux-design', level: 'Beginner' },
      { title: 'UX Design Roadmap', provider: 'roadmap.sh', url: 'https://roadmap.sh/ux-design', level: 'All levels' },
    ],
    videos: [{ title: 'Figma tutorial for beginners', channel: 'Figma', url: yt('Figma tutorial for beginners official'), duration: 'Playlist' }],
  },
  {
    id: 'comm', name: 'Communication', icon: 'MessageCircle', color: 'from-amber-500 to-orange-600', learners: 11200,
    blurb: 'Spoken English, presentations, interviews and group discussions.',
    roadmap: ['Daily speaking practice', 'Vocabulary & grammar basics', 'Presentation skills', 'Email & LinkedIn writing', 'Group discussion techniques', 'Mock HR interviews'],
    courses: [
      { title: 'Improve Your English Communication Skills', provider: 'Coursera · Georgia Tech', url: 'https://www.coursera.org/specializations/improve-english', level: 'Beginner' },
      { title: 'Spoken English (NPTEL / SWAYAM)', provider: 'SWAYAM', url: 'https://swayam.gov.in/explorer?searchText=english', level: 'Beginner' },
    ],
    videos: [{ title: 'How to speak — MIT lecture', channel: 'MIT OpenCourseWare', url: yt('Patrick Winston how to speak MIT'), duration: '1h' }],
  },
  {
    id: 'aptitude', name: 'Aptitude & Reasoning', icon: 'Calculator', color: 'from-emerald-500 to-green-600', learners: 14300,
    blurb: 'Quant, logical reasoning and verbal ability for placements and exams.',
    roadmap: ['Number system & percentages', 'Ratio, profit & loss', 'Time, speed & work', 'Permutation & probability', 'Logical reasoning puzzles', 'Verbal ability', 'Timed mock tests'],
    courses: [
      { title: 'IndiaBix practice questions', provider: 'IndiaBix', url: 'https://www.indiabix.com', level: 'All levels' },
      { title: 'Free quizzes on Student Setu', provider: 'Student Setu', url: '/exams#quizzes', level: 'All levels', internal: true },
    ],
    videos: [{ title: 'Complete aptitude for placements', channel: 'CareerRide', url: yt('aptitude for placements full course'), duration: 'Playlist' }],
  },
  {
    id: 'cloud', name: 'Cloud & DevOps', icon: 'Cloud', color: 'from-blue-500 to-sky-600', learners: 5600,
    blurb: 'Linux, Docker, CI/CD and cloud fundamentals.',
    roadmap: ['Linux & shell', 'Networking basics', 'Docker', 'CI/CD with GitHub Actions', 'Cloud basics (AWS/GCP/Azure)', 'Kubernetes', 'Monitoring'],
    courses: [
      { title: 'DevOps Roadmap', provider: 'roadmap.sh', url: 'https://roadmap.sh/devops', level: 'All levels' },
      { title: 'AWS Skill Builder (free tier)', provider: 'AWS', url: 'https://skillbuilder.aws', level: 'Beginner' },
    ],
    videos: [{ title: 'Docker & Kubernetes crash course', channel: 'TechWorld with Nana', url: yt('TechWorld with Nana docker kubernetes'), duration: '3h' }],
  },
]

export const premiumCourses = [
  { id: 'p1', title: 'Full-Stack MERN Bootcamp (Live)', mentor: 'Industry mentors', weeks: 12, rating: 4.8, seats: 40, tags: ['Live classes', 'Projects', 'Certificate'] },
  { id: 'p2', title: 'Placement Interview Prep Pro', mentor: 'SDEs from product companies', weeks: 8, rating: 4.7, seats: 60, tags: ['Mock interviews', 'Resume review'] },
  { id: 'p3', title: 'AI/ML Project Mentorship', mentor: 'ML engineers & researchers', weeks: 10, rating: 4.9, seats: 25, tags: ['1:1 mentorship', 'Kaggle', 'Research'] },
]

export const pricingPlans = [
  { id: 'free', name: 'Free', price: '₹0', period: 'forever', highlight: false, features: ['All academic notes, PYQs & syllabus', 'Free quizzes with explanations', 'Curated free courses & roadmaps', 'Community & mentorship requests'] },
  { id: 'pro', name: 'Pro', price: 'TBA', period: 'pricing coming soon', highlight: true, features: ['Everything in Free', 'Premium live courses', 'Mock interviews', 'Priority mentor sessions', 'Certificates'] },
  { id: 'campus', name: 'Campus', price: 'Custom', period: 'for colleges', highlight: false, features: ['SIDF incubation support', 'Workshops on campus', 'Analytics dashboard', 'Dedicated coordinator'] },
]

// AI skill courses — all free. Hands-on practice happens on Student Setu itself (Prompt Lab, AI coach).
export const aiCourses = [
  { title: 'Elements of AI', provider: 'University of Helsinki', url: 'https://www.elementsofai.com', level: 'Beginner · no coding', hours: 30 },
  { title: 'Machine Learning Crash Course', provider: 'Google', url: 'https://developers.google.com/machine-learning/crash-course', level: 'Beginner → Intermediate', hours: 15 },
  { title: 'AI for Beginners (24 lessons)', provider: 'Microsoft', url: 'https://github.com/microsoft/AI-For-Beginners', level: 'Beginner', hours: 24 },
  { title: 'Kaggle Learn: Python, ML & Intro to AI', provider: 'Kaggle', url: 'https://www.kaggle.com/learn', level: 'Hands-on', hours: 20 },
  { title: 'Practical Deep Learning for Coders', provider: 'fast.ai', url: 'https://course.fast.ai', level: 'Intermediate', hours: 40 },
  { title: 'Introduction to Machine Learning (NPTEL)', provider: 'IIT · SWAYAM', url: 'https://nptel.ac.in', level: 'Certificate', hours: 48 },
]

// Sample classmates for the demo leaderboard.
export const leaderboardPeers = [
  { name: 'Aarav Mehta', college: 'RGPV', points: 860 },
  { name: 'Sneha Patil', college: 'DAVV', points: 720 },
  { name: 'Ishaan Khan', college: 'MANIT', points: 610 },
  { name: 'Priya Rawat', college: 'RGPV', points: 480 },
  { name: 'Kabir Singh', college: 'LNCT', points: 350 },
  { name: 'Meera Joshi', college: 'IES', points: 240 },
]
