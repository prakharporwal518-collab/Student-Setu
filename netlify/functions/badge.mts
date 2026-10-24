import type { Context } from '@netlify/functions'
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { badgeBank, PASS_MARK } from '../lib/badgeBank.mjs'

/*
 * Setu Skill Badges — graded and signed on the server.
 * Serves at /.netlify/functions/badge
 *
 *   GET  ?skill=sql            → questions + options (no answers)
 *   POST { action: 'grade', skill, name, answers: number[] } → score (+ signed token if passed)
 *   POST { action: 'verify', token }                        → { valid, payload }
 *
 * Env: BADGE_SECRET (recommended). Without it badges are signed with a public demo
 * secret and marked `demo: true`, so they still work but are not tamper-proof.
 */

const DEMO_SECRET = 'student-setu-demo-secret'
const json = (body: unknown, status = 200) => Response.json(body, { status })
const b64url = (buf: Buffer | string) => Buffer.from(buf).toString('base64url')

function secret() {
  const s = Netlify.env.get('BADGE_SECRET')
  return { key: s || DEMO_SECRET, demo: !s }
}
const sign = (body: string, key: string) => createHmac('sha256', key).update(body).digest()

export default async (req: Request, _context: Context) => {
  if (req.method === 'GET') {
    const url = new URL(req.url)
    if (url.searchParams.has('list')) return json(Object.entries(badgeBank).map(([id, b]) => ({ id, title: b.title })))
    const skill = url.searchParams.get('skill') ?? ''
    const bank = badgeBank[skill as keyof typeof badgeBank]
    if (!bank) return json({ error: 'unknown_skill' }, 404)
    return json({ skill, title: bank.title, passMark: PASS_MARK, questions: bank.questions.map(({ question, options }) => ({ question, options })) })
  }
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  let body: any
  try {
    body = await req.json()
  } catch {
    return json({ error: 'invalid_json' }, 400)
  }

  if (body?.action === 'grade') {
    const bank = badgeBank[body.skill as keyof typeof badgeBank]
    if (!bank) return json({ error: 'unknown_skill' }, 404)
    const name = String(body.name ?? '').trim().replace(/\s+/g, ' ')
    if (name.length < 2 || name.length > 60) return json({ error: 'invalid_name' }, 400)
    const answers: unknown[] = Array.isArray(body.answers) ? body.answers : []
    const results = bank.questions.map((qq, i) => answers[i] === qq.answer)
    const score = results.filter(Boolean).length
    const total = bank.questions.length
    const passed = score >= PASS_MARK
    if (!passed) return json({ passed, score, total, passMark: PASS_MARK, results })

    const { key, demo } = secret()
    const payload = { v: 1, id: randomBytes(4).toString('hex').toUpperCase(), skill: body.skill, title: bank.title, name, score, total, issuedAt: new Date().toISOString(), ...(demo ? { demo: true } : {}) }
    const encoded = b64url(JSON.stringify(payload))
    const token = `${encoded}.${b64url(sign(encoded, key))}`
    return json({ passed, score, total, passMark: PASS_MARK, results, token, payload })
  }

  if (body?.action === 'verify') {
    const [encoded, sig] = String(body.token ?? '').split('.')
    if (!encoded || !sig) return json({ valid: false, error: 'malformed' })
    const expected = sign(encoded, secret().key)
    const given = Buffer.from(sig, 'base64url')
    const valid = given.length === expected.length && timingSafeEqual(given, expected)
    if (!valid) return json({ valid: false })
    try {
      return json({ valid: true, payload: JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) })
    } catch {
      return json({ valid: false, error: 'malformed' })
    }
  }

  return json({ error: 'unknown_action' }, 400)
}
