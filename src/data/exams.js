// Competitive & government exams + free quizzes (no registration, instant score).

export const examCategories = ['All', 'Engineering', 'Civil Services', 'SSC', 'Banking', 'Management', 'Medical']

export const exams = [
  {
    id: 'gate', name: 'GATE', full: 'Graduate Aptitude Test in Engineering', category: 'Engineering', body: 'IISc & IITs (rotating organiser)',
    frequency: 'Yearly · Feb', eligibility: '3rd year UG onwards (engineering / science)', website: null,
    websiteNote: 'Official site changes every year with the organising IIT.',
    pattern: '65 questions · 100 marks · 3 hours (MCQ, MSQ, NAT)',
    syllabus: ['General Aptitude', 'Engineering Mathematics', 'Discipline subjects (e.g. CS: DSA, Algorithms, OS, DBMS, CN, TOC, COA, Compiler)'],
    quiz: 'dsa',
  },
  {
    id: 'upsc', name: 'UPSC CSE', full: 'Civil Services Examination (IAS/IPS/IFS)', category: 'Civil Services', body: 'Union Public Service Commission',
    frequency: 'Yearly · Prelims ~May/June', eligibility: 'Any graduate, 21–32 yrs (relaxation as per category)', website: 'https://upsc.gov.in',
    pattern: 'Prelims (GS + CSAT) → Mains (9 papers) → Interview',
    syllabus: ['Indian Polity & Governance', 'History & Culture', 'Geography', 'Economy', 'Environment', 'Science & Tech', 'Current Affairs', 'CSAT'],
    quiz: 'polity',
  },
  {
    id: 'mppsc', name: 'MPPSC', full: 'MP State Service Examination', category: 'Civil Services', body: 'MP Public Service Commission',
    frequency: 'Yearly', eligibility: 'Graduate, 21–40 yrs', website: 'https://mppsc.mp.gov.in',
    pattern: 'Prelims → Mains → Interview', syllabus: ['MP GK', 'Indian Polity', 'History', 'Geography', 'Economy', 'General Aptitude'], quiz: 'polity',
  },
  {
    id: 'ras', name: 'RPSC RAS', full: 'Rajasthan Administrative Service', category: 'Civil Services', body: 'Rajasthan Public Service Commission',
    frequency: 'Every 1–2 years', eligibility: 'Graduate, 21–40 yrs', website: 'https://rpsc.rajasthan.gov.in',
    pattern: 'Prelims → Mains → Interview', syllabus: ['Rajasthan History & Culture', 'Polity', 'Economy', 'Science', 'Reasoning'], quiz: 'polity',
  },
  {
    id: 'uppsc', name: 'UPPSC PCS', full: 'UP Combined State/Upper Subordinate Services', category: 'Civil Services', body: 'UP Public Service Commission',
    frequency: 'Yearly', eligibility: 'Graduate, 21–40 yrs', website: 'https://uppsc.up.nic.in',
    pattern: 'Prelims → Mains → Interview', syllabus: ['UP GK', 'Polity', 'History', 'Geography', 'CSAT'], quiz: 'polity',
  },
  {
    id: 'ssc-cgl', name: 'SSC CGL', full: 'Combined Graduate Level Examination', category: 'SSC', body: 'Staff Selection Commission',
    frequency: 'Yearly', eligibility: 'Any graduate, 18–32 yrs (post-wise)', website: 'https://ssc.gov.in',
    pattern: 'Tier-I (CBT) → Tier-II (CBT)', syllabus: ['Quantitative Aptitude', 'Reasoning', 'English', 'General Awareness'], quiz: 'quant',
  },
  {
    id: 'ssc-chsl', name: 'SSC CHSL', full: 'Combined Higher Secondary Level', category: 'SSC', body: 'Staff Selection Commission',
    frequency: 'Yearly', eligibility: '12th pass, 18–27 yrs', website: 'https://ssc.gov.in',
    pattern: 'Tier-I → Tier-II (incl. typing/skill test)', syllabus: ['Quant', 'Reasoning', 'English', 'GA'], quiz: 'reasoning',
  },
  {
    id: 'ibps-po', name: 'IBPS PO', full: 'Probationary Officer (Public Sector Banks)', category: 'Banking', body: 'Institute of Banking Personnel Selection',
    frequency: 'Yearly · Aug–Oct', eligibility: 'Any graduate, 20–30 yrs', website: 'https://www.ibps.in',
    pattern: 'Prelims → Mains → Interview', syllabus: ['Quant', 'Reasoning', 'English', 'Banking & Economy Awareness', 'Computer Aptitude'], quiz: 'banking',
  },
  {
    id: 'sbi-po', name: 'SBI PO', full: 'State Bank of India Probationary Officer', category: 'Banking', body: 'State Bank of India',
    frequency: 'Yearly', eligibility: 'Any graduate, 21–30 yrs', website: 'https://sbi.co.in/web/careers',
    pattern: 'Prelims → Mains → Psychometric + GD/Interview', syllabus: ['Quant / Data Interpretation', 'Reasoning', 'English', 'General Awareness'], quiz: 'banking',
  },
  {
    id: 'cat', name: 'CAT', full: 'Common Admission Test (IIMs)', category: 'Management', body: 'IIMs (rotating organiser)',
    frequency: 'Yearly · Nov', eligibility: 'Graduate with 50% (45% reserved)', website: 'https://iimcat.ac.in',
    pattern: 'VARC · DILR · QA — 2 hours', syllabus: ['Verbal Ability & Reading Comprehension', 'Data Interpretation & Logical Reasoning', 'Quantitative Ability'], quiz: 'quant',
  },
  {
    id: 'neet-pg', name: 'NEET PG', full: 'National Eligibility cum Entrance Test (PG)', category: 'Medical', body: 'National Board of Examinations',
    frequency: 'Yearly', eligibility: 'MBBS with internship', website: 'https://natboard.edu.in',
    pattern: '200 MCQs · 3.5 hours', syllabus: ['Pre-clinical', 'Para-clinical', 'Clinical subjects'], quiz: 'science',
  },
]

const q = (question, options, answer, explanation) => ({ question, options, answer, explanation })

export const quizzes = [
  {
    id: 'dsa', title: 'Data Structures & Algorithms', tag: 'GATE CS · Placements', minutes: 8, level: 'Medium',
    questions: [
      q('What is the time complexity of binary search on a sorted array of n elements?', ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], 1, 'Each step halves the search space, so it takes about log₂n steps.'),
      q('Which data structure is used to implement Breadth-First Search (BFS)?', ['Stack', 'Queue', 'Heap', 'Hash table'], 1, 'BFS visits nodes level by level — a FIFO queue keeps them in that order.'),
      q('What is the worst-case time complexity of QuickSort?', ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'], 2, 'When the pivot is always the smallest/largest element (e.g. sorted input with first-element pivot), partitions are unbalanced → O(n²).'),
      q('A tree with n vertices has how many edges?', ['n', 'n − 1', 'n + 1', '2n'], 1, 'A tree is connected and acyclic; it always has exactly n − 1 edges.'),
      q('Which traversal of a Binary Search Tree gives keys in sorted order?', ['Preorder', 'Postorder', 'Inorder', 'Level order'], 2, 'Inorder visits left subtree → node → right subtree, which is ascending order in a BST.'),
      q('Which data structure is best suited to check balanced parentheses?', ['Queue', 'Stack', 'Array of size 2', 'Graph'], 1, 'Push every opening bracket and pop when a matching closing bracket appears (LIFO).'),
      q('Average-case search time in a well-designed hash table is:', ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], 0, 'With a good hash function and load factor, lookups take constant time on average.'),
    ],
  },
  {
    id: 'quant', title: 'Quantitative Aptitude', tag: 'SSC · CAT · Placements', minutes: 8, level: 'Easy',
    questions: [
      q('What is 20% of 250?', ['25', '50', '45', '60'], 1, '20/100 × 250 = 50.'),
      q('A 120 m long train crosses a pole in 6 seconds. Its speed in km/h is:', ['60', '72', '80', '54'], 1, 'Speed = 120/6 = 20 m/s; 20 × 18/5 = 72 km/h.'),
      q('Cost price ₹400, selling price ₹500. Profit percentage?', ['20%', '25%', '30%', '15%'], 1, 'Profit = 100; 100/400 × 100 = 25%.'),
      q('A finishes a work in 10 days and B in 15 days. Together they finish it in:', ['5 days', '6 days', '8 days', '12.5 days'], 1, '1/10 + 1/15 = 5/30 = 1/6, so 6 days.'),
      q('Simple interest on ₹5,000 at 8% per annum for 3 years:', ['₹1,000', '₹1,200', '₹1,500', '₹800'], 1, 'SI = P×R×T/100 = 5000×8×3/100 = ₹1,200.'),
      q('Two numbers are in the ratio 3:5 and their sum is 64. The larger number is:', ['24', '40', '32', '48'], 1, 'Total parts 8 → one part = 8; larger = 5 × 8 = 40.'),
    ],
  },
  {
    id: 'reasoning', title: 'Logical Reasoning', tag: 'SSC · Banking', minutes: 6, level: 'Easy',
    questions: [
      q('Find the next number: 2, 6, 12, 20, 30, ?', ['40', '42', '36', '44'], 1, 'Pattern n(n+1): 1×2, 2×3, 3×4, 4×5, 5×6, 6×7 = 42.'),
      q('If CAT is coded as DBU, how is DOG coded?', ['EPH', 'EOH', 'DPH', 'FPI'], 0, 'Each letter shifts +1: D→E, O→P, G→H.'),
      q('Find the odd one out: Apple, Mango, Potato, Banana', ['Apple', 'Mango', 'Potato', 'Banana'], 2, 'Potato is a vegetable (tuber); the rest are fruits.'),
      q('You face North, turn right, then turn right again. Which direction do you face now?', ['East', 'West', 'South', 'North'], 2, 'North → right = East → right = South.'),
      q('Next in series: 3, 9, 27, 81, ?', ['162', '243', '216', '324'], 1, 'Each term is multiplied by 3: 81 × 3 = 243.'),
      q('A is B’s brother and B is C’s sister. How is A related to C?', ['Sister', 'Brother', 'Cousin', 'Cannot be determined'], 1, 'A is male and a sibling of B, and B is C’s sibling — so A is C’s brother.'),
    ],
  },
  {
    id: 'polity', title: 'Indian Polity', tag: 'UPSC · State PSC', minutes: 7, level: 'Medium',
    questions: [
      q('The Constitution of India came into force on:', ['15 August 1947', '26 November 1949', '26 January 1950', '2 October 1950'], 2, 'It was adopted on 26 Nov 1949 and came into force on 26 Jan 1950 (Republic Day).'),
      q('Who is known as the chief architect of the Indian Constitution?', ['Jawaharlal Nehru', 'Dr. B. R. Ambedkar', 'Dr. Rajendra Prasad', 'Sardar Patel'], 1, 'Dr. Ambedkar chaired the Drafting Committee.'),
      q('Fundamental Rights are contained in which Part of the Constitution?', ['Part II', 'Part III', 'Part IV', 'Part IVA'], 1, 'Part III (Articles 12–35) contains Fundamental Rights.'),
      q('Minimum age to be elected President of India:', ['25 years', '30 years', '35 years', '40 years'], 2, 'Article 58 requires the President to be at least 35 years old.'),
      q('Article 21 of the Constitution deals with:', ['Right to equality', 'Protection of life and personal liberty', 'Right to education', 'Freedom of religion'], 1, 'Article 21: No person shall be deprived of life or personal liberty except by procedure established by law.'),
      q('Who appoints the Chief Justice of India?', ['Prime Minister', 'Parliament', 'President', 'Law Minister'], 2, 'Under Article 124, the President appoints the CJI.'),
    ],
  },
  {
    id: 'banking', title: 'Banking Awareness', tag: 'IBPS · SBI · RBI', minutes: 6, level: 'Easy',
    questions: [
      q('The Reserve Bank of India was established in:', ['1935', '1947', '1949', '1969'], 0, 'RBI was set up on 1 April 1935 under the RBI Act, 1934 (nationalised in 1949).'),
      q('Repo rate is the rate at which:', ['Banks lend to customers', 'RBI lends to commercial banks', 'Banks borrow from public', 'Government borrows from RBI'], 1, 'Repo = RBI lends short-term funds to banks against government securities.'),
      q('Where is the headquarters of RBI?', ['New Delhi', 'Mumbai', 'Kolkata', 'Chennai'], 1, 'RBI’s central office is in Mumbai.'),
      q('UPI stands for:', ['Unified Payments Interface', 'Universal Payment Index', 'United Payment Integration', 'Unified Pay Instrument'], 0, 'UPI is operated by NPCI.'),
      q('Which body regulates the securities market in India?', ['RBI', 'IRDAI', 'SEBI', 'NABARD'], 2, 'SEBI (Securities and Exchange Board of India) regulates the securities market.'),
    ],
  },
  {
    id: 'science', title: 'General Science', tag: 'All exams', minutes: 5, level: 'Easy',
    questions: [
      q('SI unit of force is:', ['Joule', 'Newton', 'Pascal', 'Watt'], 1, '1 Newton = 1 kg·m/s².'),
      q('Most abundant gas in Earth’s atmosphere:', ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Argon'], 2, 'Nitrogen is about 78% of the atmosphere.'),
      q('The “powerhouse of the cell” is:', ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi body'], 2, 'Mitochondria produce ATP through cellular respiration.'),
      q('pH of pure water at 25 °C is:', ['5', '7', '9', '14'], 1, 'Pure water is neutral, pH 7.'),
      q('Which vitamin is produced in the skin on exposure to sunlight?', ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin K'], 2, 'UVB light helps the skin synthesise Vitamin D.'),
    ],
  },
]

export const quizById = (id) => quizzes.find((x) => x.id === id)
