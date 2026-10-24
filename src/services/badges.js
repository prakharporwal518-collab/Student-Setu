// Setu Skill Badges — tests are graded and signed on the server (/.netlify/functions/badge).
import { getFn, postFn, failReason } from './functions'

const LS = 'ss-badges'

export function myBadges() {
  try {
    return JSON.parse(localStorage.getItem(LS)) ?? []
  } catch {
    return []
  }
}
function save(list) {
  try {
    localStorage.setItem(LS, JSON.stringify(list))
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event('ss:badges'))
}
export const badgeSkills = () => myBadges().map((b) => b.payload.skill)
export const verifyUrl = (token) => `${location.origin}/verify/${token}`

export async function loadTest(skill) {
  const r = await getFn('badge', { skill })
  if (!r.ok) throw new Error(r.status === 0 ? 'Skill tests are graded on our server, which is not reachable from here. Open the live site (or run `netlify dev`) to earn verified badges.' : failReason(r))
  return r.data
}

export async function gradeTest(skill, name, answers) {
  const r = await postFn('badge', { action: 'grade', skill, name, answers })
  if (!r.ok) throw new Error(failReason(r))
  if (r.data.passed) save([{ token: r.data.token, payload: r.data.payload }, ...myBadges().filter((b) => b.payload.skill !== skill)])
  return r.data
}

export async function verifyToken(token) {
  const r = await postFn('badge', { action: 'verify', token })
  if (!r.ok) throw new Error(failReason(r))
  return r.data
}
