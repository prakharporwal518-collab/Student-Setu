/*
 * Minimal REST API for Student Setu (optional).
 * Serves the same dummy data the frontend uses, stored in memory.
 * Run: npm run server  →  http://localhost:4000/api/hostels
 * Swap the in-memory `db` for MongoDB / PostgreSQL / Firebase when going to production.
 */
import express from 'express'
import cors from 'cors'
import { hostels } from '../src/data/hostels.js'
import { tiffins } from '../src/data/tiffins.js'
import { colleges } from '../src/data/colleges.js'
import { students, areaGuides, communities } from '../src/data/community.js'
import { scholarships } from '../src/data/scholarships.js'
import { books } from '../src/data/library.js'
import { exams, quizzes } from '../src/data/exams.js'
import { listings } from '../src/data/careers.js'
import { sidfEvents, mentors } from '../src/data/sidf.js'
import { courses } from '../src/data/resources.js'

const db = {
  hostels: hostels.map((h) => ({ ...h, status: 'approved' })),
  tiffins: tiffins.map((t) => ({ ...t, status: 'approved' })),
  colleges, students, guides: areaGuides, communities, scholarships, books, exams, quizzes,
  jobs: listings, events: sidfEvents, mentors, courses,
}
const writable = new Set(['hostels', 'tiffins'])

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true, collections: Object.keys(db) }))

// List with simple equality filters, e.g. /api/hostels?city=bhopal&type=pg
app.get('/api/:collection', (req, res) => {
  const rows = db[req.params.collection]
  if (!rows) return res.status(404).json({ error: 'Unknown collection' })
  const filters = Object.entries(req.query)
  res.json(rows.filter((r) => filters.every(([k, v]) => String(r[k]) === String(v))))
})

app.get('/api/:collection/:id', (req, res) => {
  const row = db[req.params.collection]?.find((r) => r.id === req.params.id)
  return row ? res.json(row) : res.status(404).json({ error: 'Not found' })
})

// New listings start as "pending" until an admin approves them.
app.post('/api/:collection', (req, res) => {
  const { collection } = req.params
  if (!writable.has(collection)) return res.status(405).json({ error: 'Read-only collection' })
  if (!req.body?.name) return res.status(400).json({ error: 'name is required' })
  const row = { ...req.body, id: `${collection[0]}${Date.now()}`, status: 'pending', verified: false, rating: 0, reviewsCount: 0, reviews: [] }
  db[collection].unshift(row)
  res.status(201).json(row)
})

app.patch('/api/:collection/:id', (req, res) => {
  const { collection, id } = req.params
  if (!writable.has(collection)) return res.status(405).json({ error: 'Read-only collection' })
  const i = db[collection].findIndex((r) => r.id === id)
  if (i === -1) return res.status(404).json({ error: 'Not found' })
  db[collection][i] = { ...db[collection][i], ...req.body, id }
  res.json(db[collection][i])
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Student Setu API running on http://localhost:${PORT}/api`))
