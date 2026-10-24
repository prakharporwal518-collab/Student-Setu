/*
 * API layer — the single place to plug in a real backend.
 *
 * By default the app runs fully on dummy data (src/data) stored in the browser.
 * Start the bundled Express server (`npm run server`) and set
 *   VITE_API_URL=http://localhost:4000/api
 * in a `.env` file to load listings from the API instead.
 * Firebase / Supabase can be swapped in by re-implementing these functions.
 */
const BASE = import.meta.env.VITE_API_URL

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options })
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json()
}

export const api = {
  enabled: Boolean(BASE),
  list: (collection, params = {}) => request(`/${collection}?${new URLSearchParams(params)}`),
  get: (collection, id) => request(`/${collection}/${id}`),
  create: (collection, body) => request(`/${collection}`, { method: 'POST', body: JSON.stringify(body) }),
  update: (collection, id, body) => request(`/${collection}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
}
