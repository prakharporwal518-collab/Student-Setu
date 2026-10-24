import { createContext, useCallback, useContext, useEffect } from 'react'
import usePersistentState from '../hooks/usePersistentState'
import { hostels as seedHostels } from '../data/hostels'
import { tiffins as seedTiffins } from '../data/tiffins'
import { teamPosts as seedPosts } from '../data/sidf'
import { api } from '../services/api'

/*
 * Single client-side store for everything users can change.
 * Saved in localStorage so the demo survives refreshes.
 * When VITE_API_URL is set, listings are loaded from the Express API instead.
 */
const DataCtx = createContext(null)
export const useData = () => useContext(DataCtx)

const OWNED_HOSTELS = { h2: 'u-owner', h6: 'u-owner' }
const OWNED_TIFFINS = { t1: 'u-provider', t2: 'u-provider' }

const seedH = () => seedHostels.map((h) => ({ ...h, status: 'approved', ownerId: OWNED_HOSTELS[h.id] ?? null }))
const seedT = () => seedTiffins.map((t) => ({ ...t, status: 'approved', ownerId: OWNED_TIFFINS[t.id] ?? null }))

const uid = (p) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`

export function DataProvider({ children }) {
  const [hostels, setHostels] = usePersistentState('ss-hostels-v1', seedH)
  const [tiffins, setTiffins] = usePersistentState('ss-tiffins-v1', seedT)
  const [saved, setSaved] = usePersistentState('ss-saved', { hostels: [], tiffins: [], resources: [], books: [], scholarships: [] })
  const [applied, setApplied] = usePersistentState('ss-applied', [])
  const [quizHistory, setQuizHistory] = usePersistentState('ss-quiz-history', [])
  const [connections, setConnections] = usePersistentState('ss-connections', [])
  const [mentorRequests, setMentorRequests] = usePersistentState('ss-mentor-requests', [])
  const [teamPosts, setTeamPosts] = usePersistentState('ss-team-posts', seedPosts)
  const [ideas, setIdeas] = usePersistentState('ss-ideas', [])
  const [reports, setReports] = usePersistentState('ss-reports', [])
  const [eventRegs, setEventRegs] = usePersistentState('ss-event-regs', [])

  // Optional: hydrate listings from a real backend.
  useEffect(() => {
    if (!api.enabled) return
    api.list('hostels').then((rows) => rows && setHostels(rows)).catch(() => {})
    api.list('tiffins').then((rows) => rows && setTiffins(rows)).catch(() => {})
  }, [setHostels, setTiffins])

  /* ---- saved / bookmarks ---- */
  const toggleSaved = useCallback(
    (kind, id) => {
      setSaved((s) => {
        const list = s[kind] ?? []
        return { ...s, [kind]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] }
      })
    },
    [setSaved],
  )
  const isSaved = useCallback((kind, id) => (saved[kind] ?? []).includes(id), [saved])

  /* ---- listings (hostels / tiffins share the same shape of actions) ---- */
  const makeCrud = (setter, prefix) => ({
    add: (data, ownerId) => {
      const row = { ...data, id: uid(prefix), ownerId, status: 'pending', verified: false, rating: 0, reviewsCount: 0, reviews: [], createdAt: new Date().toISOString() }
      setter((rows) => [row, ...rows])
      return row
    },
    update: (id, patch) => setter((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r))),
    remove: (id) => setter((rows) => rows.filter((r) => r.id !== id)),
    review: (id, review) =>
      setter((rows) =>
        rows.map((r) => {
          if (r.id !== id) return r
          const count = (r.reviewsCount ?? 0) + 1
          const rating = Math.round((((r.rating ?? 0) * (count - 1) + review.rating) / count) * 10) / 10
          return { ...r, reviews: [{ ...review, id: uid('rv'), date: new Date().toISOString().slice(0, 10) }, ...(r.reviews ?? [])], reviewsCount: count, rating }
        }),
      ),
    removeReview: (id, reviewId) =>
      setter((rows) => rows.map((r) => (r.id === id ? { ...r, reviews: r.reviews.filter((rv) => rv.id !== reviewId) } : r))),
  })
  const hostelActions = makeCrud(setHostels, 'h')
  const tiffinActions = makeCrud(setTiffins, 't')

  /* ---- activity ---- */
  const addQuizResult = (res) => setQuizHistory((h) => [{ ...res, id: uid('q'), at: new Date().toISOString() }, ...h].slice(0, 50))
  const toggleApplied = (id) => setApplied((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]))
  const connect = (studentId) => setConnections((c) => (c.includes(studentId) ? c : [...c, studentId]))
  const requestMentor = (req) => setMentorRequests((r) => [{ ...req, id: uid('mr'), status: 'pending', at: new Date().toISOString() }, ...r])
  const updateMentorRequest = (id, status) => setMentorRequests((r) => r.map((x) => (x.id === id ? { ...x, status } : x)))
  const addTeamPost = (post) => setTeamPosts((p) => [{ ...post, id: uid('tp'), createdAt: new Date().toISOString() }, ...p])
  const addIdea = (idea) => setIdeas((i) => [{ ...idea, id: uid('idea'), status: 'Under review', at: new Date().toISOString() }, ...i])
  const addReport = (rep) => setReports((r) => [{ ...rep, id: uid('rep'), status: 'open', at: new Date().toISOString() }, ...r])
  const resolveReport = (id) => setReports((r) => r.map((x) => (x.id === id ? { ...x, status: 'resolved' } : x)))
  const toggleEvent = (id) => setEventRegs((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]))

  const resetDemo = () => {
    setHostels(seedH())
    setTiffins(seedT())
    setTeamPosts(seedPosts)
    setIdeas([])
    setReports([])
    setMentorRequests([])
  }

  return (
    <DataCtx.Provider
      value={{
        hostels, tiffins, saved, applied, quizHistory, connections, mentorRequests, teamPosts, ideas, reports, eventRegs,
        hostelActions, tiffinActions, toggleSaved, isSaved, addQuizResult, toggleApplied, connect, requestMentor,
        updateMentorRequest, addTeamPost, addIdea, addReport, resolveReport, toggleEvent, resetDemo,
      }}
    >
      {children}
    </DataCtx.Provider>
  )
}
