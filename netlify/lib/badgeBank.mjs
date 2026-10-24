// Server-only question bank for Setu Skill Badges.
// Answers never leave the server: the browser only receives questions + options,
// and grading happens in netlify/functions/badge.mts.

const q = (question, options, answer) => ({ question, options, answer })

export const PASS_MARK = 4 // out of 5

export const badgeBank = {
  html_css: {
    title: 'HTML & CSS',
    questions: [
      q('Which HTML tag creates the largest heading?', ['<h6>', '<h1>', '<head>', '<header>'], 1),
      q('Which CSS property changes the colour of text?', ['font-color', 'text-color', 'color', 'foreground'], 2),
      q('In the CSS box model, what sits between the border and the content?', ['margin', 'padding', 'outline', 'gap'], 1),
      q('Which CSS unit is relative to the root element’s font size?', ['em', 'px', 'rem', 'vh'], 2),
      q('Which display value lays out child elements in a row by default?', ['block', 'none', 'flex', 'table-cell'], 2),
    ],
  },
  js: {
    title: 'JavaScript',
    questions: [
      q('What does typeof null return?', ['"null"', '"object"', '"undefined"', '"number"'], 1),
      q('Which keyword declares a block-scoped variable that cannot be reassigned?', ['var', 'let', 'const', 'static'], 2),
      q('What does [1, 2, 3].map(x => x * 2) return?', ['[2, 4, 6]', '6', '[1, 2, 3, 1, 2, 3]', 'undefined'], 0),
      q("What is the result of '5' + 2?", ['7', '"52"', 'NaN', 'An error'], 1),
      q('Which method converts a JSON string into an object?', ['JSON.stringify()', 'JSON.parse()', 'Object.from()', 'JSON.toObject()'], 1),
    ],
  },
  react: {
    title: 'React',
    questions: [
      q('Which hook stores state inside a function component?', ['useEffect', 'useState', 'useMemo', 'useRef'], 1),
      q('Why should list items have a key prop?', ['For styling', 'So React can identify items between renders', 'HTML requires it', 'To make them clickable'], 1),
      q('Props in React are…', ['changed freely by the child', 'read-only inputs passed from the parent', 'global variables', 'CSS classes'], 1),
      q('useEffect(() => { … }, []) with an empty dependency array runs…', ['on every render', 'after the first render (mount)', 'never', 'before the component renders'], 1),
      q('JSX is…', ['a database', 'a syntax extension that compiles to JavaScript', 'a CSS framework', 'a browser API'], 1),
    ],
  },
  python: {
    title: 'Python',
    questions: [
      q('What is len([1, [2, 3], 4])?', ['4', '3', '2', 'Error'], 1),
      q('Which of these data types is immutable?', ['list', 'dict', 'tuple', 'set'], 2),
      q('What does list(range(2, 8, 2)) produce?', ['[2, 4, 6]', '[2, 4, 6, 8]', '[2, 3, 4, 5, 6, 7, 8]', '[4, 6, 8]'], 0),
      q('Which keyword defines a function?', ['func', 'def', 'function', 'fn'], 1),
      q('What is 7 // 2?', ['3.5', '3', '4', '1'], 1),
    ],
  },
  dsa: {
    title: 'Data Structures & Algorithms',
    questions: [
      q('Time complexity of binary search on a sorted array of n elements?', ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], 1),
      q('A stack follows which order?', ['FIFO', 'LIFO', 'Random', 'Priority'], 1),
      q('Which of these sorts runs in O(n log n) in the average and worst case?', ['Bubble sort', 'Merge sort', 'Selection sort', 'Insertion sort'], 1),
      q('How many edges does a tree with n vertices have?', ['n', 'n − 1', 'n + 1', '2n'], 1),
      q('Which structure gives O(1) average lookup by key?', ['Linked list', 'Hash map', 'Binary heap', 'Unsorted array'], 1),
    ],
  },
  sql: {
    title: 'SQL',
    questions: [
      q('Which clause filters groups after GROUP BY?', ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'], 1),
      q('Which JOIN returns only rows that match in both tables?', ['LEFT JOIN', 'INNER JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'], 1),
      q('Which statement removes a table and its structure permanently?', ['DELETE FROM t', 'TRUNCATE TABLE t', 'DROP TABLE t', 'REMOVE t'], 2),
      q('A PRIMARY KEY column must be…', ['allowed to repeat', 'unique and not NULL', 'of type TEXT', 'empty for new rows'], 1),
      q('What does COUNT(*) return?', ['The sum of a column', 'The number of rows', 'The average value', 'The largest value'], 1),
    ],
  },
  git: {
    title: 'Git & GitHub',
    questions: [
      q('Which command creates a new local Git repository?', ['git start', 'git init', 'git create', 'git new'], 1),
      q('Which command stages all changed files in the current folder?', ['git add .', 'git push', 'git log', 'git clone'], 0),
      q('What does git clone do?', ['Deletes a repository', 'Copies a remote repository to your machine', 'Creates a branch', 'Merges two branches'], 1),
      q('Which command shows the commit history?', ['git history', 'git log', 'git list', 'git status'], 1),
      q('A pull request is…', ['a way to download Git', 'a proposal to merge changes from one branch into another', 'a command that deletes commits', 'a type of file'], 1),
    ],
  },
  excel: {
    title: 'Excel / Google Sheets',
    questions: [
      q('Which function adds up a range of cells?', ['=ADD()', '=SUM()', '=TOTAL()', '=PLUS()'], 1),
      q('Which reference stays fixed when a formula is copied?', ['A1', '$A$1', '#A1', 'A1!'], 1),
      q('What is the quickest way to summarise large data by category?', ['Pivot table', 'Freeze panes', 'Format painter', 'Spell check'], 0),
      q('VLOOKUP is used to…', ['sort data', 'find a value in the first column and return a value from another column', 'remove duplicates', 'draw a chart'], 1),
      q('What is =AVERAGE(10, 20, 30)?', ['60', '30', '20', '10'], 2),
    ],
  },
  communication: {
    title: 'Workplace English & Communication',
    questions: [
      q('Choose the correct sentence.', ["She don't like coffee.", "She doesn't like coffee.", 'She not like coffee.', "She doesn't likes coffee."], 1),
      q('Best subject line for an internship application email?', ['Hi', 'Application for Frontend Intern – Ananya Sharma, B.Tech CSE', 'Please read urgently!!!', '(no subject)'], 1),
      q('Active listening means…', ['waiting for your turn to talk', 'focusing on, understanding and responding to the speaker', 'interrupting with your own ideas', 'only taking notes'], 1),
      q('The most appropriate closing for a formal email is…', ['Bye!!', 'Regards, followed by your name', 'Cya', 'Love,'], 1),
      q('Writing “concisely” means…', ['using as many words as possible', 'expressing ideas clearly in few words', 'using difficult vocabulary', 'writing in capital letters'], 1),
    ],
  },
  accounting: {
    title: 'Accounting & Bookkeeping',
    questions: [
      q('The basic accounting equation is…', ['Assets = Liabilities + Capital', 'Assets = Income − Expenses', 'Capital = Assets + Liabilities', 'Liabilities = Assets + Capital'], 0),
      q('In double-entry bookkeeping, every transaction affects…', ['one account', 'at least two accounts', 'only cash', 'only the trial balance'], 1),
      q('Rent paid by a business is…', ['revenue', 'an expense', 'an asset', 'a liability'], 1),
      q('Which statement shows profit or loss for a period?', ['Balance sheet', 'Profit & Loss account', 'Bank statement', 'Trial balance'], 1),
      q('Depreciation is…', ['an increase in asset value', 'the reduction in value of a fixed asset over time', 'a type of tax', 'cash received from customers'], 1),
    ],
  },
  gst: {
    title: 'GST & Tax Basics',
    questions: [
      q('GST stands for…', ['Goods and Services Tax', 'General Sales Tax', 'Government Service Tax', 'Gross Sales Tax'], 0),
      q('For a sale within the same state, GST is split into…', ['IGST only', 'CGST + SGST', 'Customs + IGST', 'TDS + TCS'], 1),
      q('For a sale from one state to another, which tax applies?', ['CGST', 'SGST', 'IGST', 'UTGST'], 2),
      q('How many characters does a GSTIN have?', ['10', '12', '15', '20'], 2),
      q('Input Tax Credit means…', ['a loan from the government', 'GST paid on purchases that can be set off against GST on sales', 'a late-filing penalty', 'an income-tax refund'], 1),
    ],
  },
  seo_social: {
    title: 'SEO & Social Media Marketing',
    questions: [
      q('SEO stands for…', ['Search Engine Optimization', 'Social Engagement Online', 'Sales and Email Outreach', 'Site Error Output'], 0),
      q('Click-through rate (CTR) is calculated as…', ['Clicks ÷ Impressions', 'Impressions ÷ Clicks', 'Sales ÷ Visitors', 'Likes ÷ Followers'], 0),
      q('“Organic” traffic means visitors who come from…', ['paid ads', 'unpaid search results', 'email only', 'bots'], 1),
      q('A/B testing means…', ['comparing two versions to see which performs better', 'testing a website for bugs', 'a type of ad', 'an SEO penalty'], 0),
      q('A meta description is…', ['a short page summary shown in search results', 'the main heading of a page', 'an image tag', 'a social media post'], 0),
    ],
  },
  electrician: {
    title: 'Electrician (Domestic Wiring)',
    questions: [
      q('What is the SI unit of electrical resistance?', ['Volt', 'Ampere', 'Ohm', 'Watt'], 2),
      q("Ohm's law is written as…", ['V = I × R', 'P = V ÷ I', 'R = V × I', 'I = V × R'], 0),
      q('An MCB protects a circuit mainly from…', ['overcurrent and short circuits', 'dust', 'high humidity', 'low light'], 0),
      q('In Indian house wiring, the earth wire is usually…', ['red', 'black', 'green (or green-yellow)', 'blue'], 2),
      q('Two 10 Ω resistors connected in series give a total of…', ['5 Ω', '10 Ω', '20 Ω', '100 Ω'], 2),
    ],
  },
  mobile_repair: {
    title: 'Mobile Phone Repair',
    questions: [
      q('Most smartphones use which type of battery?', ['Lead-acid', 'Lithium-ion / lithium-polymer', 'Nickel-cadmium', 'Alkaline'], 1),
      q('Which tool checks continuity and voltage?', ['Soldering iron', 'Multimeter', 'Heat gun', 'Tweezers'], 1),
      q('An ESD wrist strap is used to…', ['keep the phone warm', 'stop static electricity damaging components', 'measure the battery', 'hold screws'], 1),
      q('Before opening a phone for repair you should first…', ['charge it to 100%', 'switch it off and disconnect the battery where possible', 'wet the screen', 'update all apps'], 1),
      q('Most new Android phones use which charging port?', ['Micro-USB', 'USB Type-C', 'Mini-USB', 'Barrel jack'], 1),
    ],
  },
  solar: {
    title: 'Solar PV Installation',
    questions: [
      q('Solar panels produce…', ['AC electricity', 'DC electricity', 'gas', 'only heat'], 1),
      q('In a solar system, the inverter…', ['stores energy', 'converts DC to AC', 'cleans the panels', 'measures sunlight'], 1),
      q('In India (northern hemisphere), fixed panels should generally face…', ['North', 'South', 'Straight down', 'Any direction'], 1),
      q('MPPT stands for…', ['Maximum Power Point Tracking', 'Multi Panel Power Transfer', 'Minimum Power Protection Tool', 'Main Panel Power Test'], 0),
      q('Panel capacity is usually rated in…', ['kWp (kilowatt-peak)', 'kVA', 'litres', 'decibels'], 0),
    ],
  },
}
