// Tiny client for our Netlify Functions. Returns { ok, status, data } and never throws.
// status 0 = the function could not be reached (e.g. plain `npm run dev`, or offline).

async function call(path, init) {
  try {
    const res = await fetch(`/.netlify/functions/${path}`, init)
    const type = res.headers.get('content-type') ?? ''
    if (!type.includes('application/json')) return { ok: false, status: res.status === 200 ? 0 : res.status, data: null }
    const data = await res.json()
    return { ok: res.ok, status: res.status, data }
  } catch {
    return { ok: false, status: 0, data: null }
  }
}

export const getFn = (name, params = {}) => call(`${name}?${new URLSearchParams(params)}`)
export const postFn = (name, body) => call(name, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

/** Human-readable reason for a failed call. */
export function failReason(r) {
  if (r.status === 0) return 'The online service is not reachable from here (offline, or running locally without Netlify).'
  if (r.status === 503) return 'AI is not configured yet — add GEMINI_API_KEY in Netlify and redeploy.'
  if (r.status === 429) return 'AI usage limit reached for now — please try again in a minute.'
  return r.data?.error ? String(r.data.error) : `Something went wrong (error ${r.status}).`
}
