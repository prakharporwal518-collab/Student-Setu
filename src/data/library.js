// E-Library: only legally shareable content (NCERT, open-licensed, NPTEL, public domain,
// and notes contributed by students with permission). Links go to the official host.

export const licenses = {
  ncert: 'NCERT — free for personal study',
  ccby: 'CC BY 4.0',
  ccbysa: 'CC BY-SA',
  ccbyncsa: 'CC BY-NC-SA',
  pd: 'Public domain',
  nptel: 'NPTEL — free for learners',
  student: 'Shared by author with permission',
}

export const books = [
  { id: 'b1', title: 'Mathematics — Class 12 (Part I & II)', author: 'NCERT', subject: 'Mathematics', course: 'School / Entrance', license: 'ncert', format: 'PDF', url: 'https://ncert.nic.in/textbook.php', color: 'from-blue-500 to-indigo-600' },
  { id: 'b2', title: 'Physics — Class 12 (Part I & II)', author: 'NCERT', subject: 'Physics', course: 'School / Entrance', license: 'ncert', format: 'PDF', url: 'https://ncert.nic.in/textbook.php', color: 'from-sky-500 to-blue-600' },
  { id: 'b3', title: 'Indian Constitution at Work', author: 'NCERT', subject: 'Polity', course: 'BA / UPSC', license: 'ncert', format: 'PDF', url: 'https://ncert.nic.in/textbook.php', color: 'from-amber-500 to-orange-600' },
  { id: 'b4', title: 'Calculus Volume 1', author: 'OpenStax (Strang, Herman)', subject: 'Mathematics', course: 'B.Tech / B.Sc', license: 'ccbyncsa', format: 'PDF / Web', url: 'https://openstax.org/details/books/calculus-volume-1', color: 'from-emerald-500 to-teal-600' },
  { id: 'b5', title: 'University Physics Volume 1', author: 'OpenStax', subject: 'Physics', course: 'B.Tech / B.Sc', license: 'ccby', format: 'PDF / Web', url: 'https://openstax.org/details/books/university-physics-volume-1', color: 'from-cyan-500 to-sky-600' },
  { id: 'b6', title: 'Principles of Economics 3e', author: 'OpenStax', subject: 'Economics', course: 'BA / B.Com / BBA', license: 'ccby', format: 'PDF / Web', url: 'https://openstax.org/details/books/principles-economics-3e', color: 'from-yellow-500 to-amber-600' },
  { id: 'b7', title: 'Introductory Statistics', author: 'OpenStax', subject: 'Statistics', course: 'B.Sc / BBA', license: 'ccby', format: 'PDF / Web', url: 'https://openstax.org/details/books/introductory-statistics', color: 'from-lime-500 to-green-600' },
  { id: 'b8', title: 'Think Python 2e', author: 'Allen B. Downey', subject: 'Programming', course: 'B.Tech / BCA', license: 'ccbyncsa', format: 'PDF / Web', url: 'https://greenteapress.com/wp/think-python-2e/', color: 'from-indigo-500 to-violet-600' },
  { id: 'b9', title: 'Open Data Structures (C++ edition)', author: 'Pat Morin', subject: 'Data Structures', course: 'B.Tech / BCA', license: 'ccby', format: 'PDF', url: 'https://opendatastructures.org', color: 'from-violet-500 to-purple-600' },
  { id: 'b10', title: 'Structure and Interpretation of Computer Programs', author: 'Abelson & Sussman', subject: 'Programming', course: 'B.Tech', license: 'ccbysa', format: 'Web', url: 'https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/6515/sicp.zip/index.html', color: 'from-fuchsia-500 to-pink-600' },
  { id: 'b11', title: 'Dive into Deep Learning', author: 'Zhang, Lipton, Li, Smola', subject: 'AI / ML', course: 'B.Tech / M.Tech', license: 'ccbysa', format: 'PDF / Web', url: 'https://d2l.ai', color: 'from-rose-500 to-red-600' },
  { id: 'b12', title: 'Mathematics for Machine Learning', author: 'Deisenroth, Faisal, Ong', subject: 'AI / ML', course: 'B.Tech / M.Sc', license: 'student', licenseNote: 'Free PDF by the authors', format: 'PDF', url: 'https://mml-book.github.io', color: 'from-pink-500 to-rose-600' },
  { id: 'b13', title: 'Pro Git', author: 'Scott Chacon & Ben Straub', subject: 'Programming', course: 'All', license: 'ccbyncsa', format: 'PDF / Web', url: 'https://git-scm.com/book/en/v2', color: 'from-orange-500 to-red-600' },
  { id: 'b14', title: 'NPTEL — Programming, Data Structures & Algorithms (Python)', author: 'IIT Madras / NPTEL', subject: 'Data Structures', course: 'B.Tech', license: 'nptel', format: 'Video + PDF', url: 'https://nptel.ac.in/courses', color: 'from-blue-600 to-slate-700' },
  { id: 'b15', title: 'Gitanjali', author: 'Rabindranath Tagore', subject: 'Literature', course: 'BA', license: 'pd', format: 'EPUB / Web', url: 'https://www.gutenberg.org/ebooks/7164', color: 'from-amber-600 to-yellow-700' },
  { id: 'b16', title: 'The Republic', author: 'Plato (tr. Jowett)', subject: 'Philosophy', course: 'BA', license: 'pd', format: 'EPUB / Web', url: 'https://www.gutenberg.org/ebooks/1497', color: 'from-stone-500 to-stone-700' },
  { id: 'b17', title: 'Data Structures — Handwritten Notes (RGPV CSE Sem 3)', author: 'Ananya Sharma (student)', subject: 'Data Structures', course: 'B.Tech', license: 'student', format: 'PDF', url: '#', color: 'from-teal-500 to-emerald-600' },
  { id: 'b18', title: 'Financial Accounting — Solved Problems', author: 'Shivam Tripathi (student)', subject: 'Accounting', course: 'B.Com', license: 'student', format: 'PDF', url: '#', color: 'from-green-500 to-emerald-600' },
]

export const librarySubjects = ['All', ...Array.from(new Set(books.map((b) => b.subject)))]
