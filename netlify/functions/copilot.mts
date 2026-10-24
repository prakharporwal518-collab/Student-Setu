import type { Context } from '@netlify/functions'
import { callGemini, GeminiError, parseJSON } from '../lib/gemini.mjs'

/*
 * Teacher Copilot + Skill Bridge coach — structured JSON from Gemini.
 * Serves at /.netlify/functions/copilot (POST { task, ...fields }).
 *   task 'lesson' → lesson plan · 'paper' → question paper · 'quiz' → MCQs · 'coach' → study-plan tips
 * Needs GEMINI_API_KEY. The browser falls back to built-in templates when this returns 503.
 */

const json = (body: unknown, status = 200) => Response.json(body, { status })
const clip = (v: unknown, n = 120) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, n)
const langName = (l: unknown) => (l === 'hi' ? 'Hindi (Devanagari script, simple words; keep technical terms in English)' : 'simple Indian English')

const SYSTEM = `You are "Setu Copilot", an assistant for teachers and students in Indian colleges, especially government and local colleges with limited resources.
Be accurate, practical and syllabus-aligned. Use examples from everyday Indian life. Never invent statistics.
Always reply with ONLY valid JSON matching the requested shape — no markdown, no commentary.`

function buildPrompt(b: any): { prompt: string; validate: (o: any) => boolean } | null {
  const ctx = `Course: ${clip(b.course, 40)} · University: ${clip(b.university, 60)} · Semester: ${clip(b.semester, 4)} · Subject: ${clip(b.subject, 80)}`
  const lang = langName(b.language)
  switch (b.task) {
    case 'lesson':
      return {
        prompt: `${ctx}\nTopic: ${clip(b.topic)}\nClass length: ${Math.min(Math.max(+b.minutes || 45, 20), 120)} minutes. Language: ${lang}.
Create a lesson plan as JSON:
{"title": string, "objectives": string[3-4], "prerequisites": string[1-3], "timeline": [{"minutes": number, "activity": string, "details": string}] (minutes must add up to the class length), "examples": string[2-3] (Indian real-life examples), "activity": string (one student activity that works without a projector or internet), "homework": string[1-2], "checkQuestions": string[3] (quick questions to check understanding)}`,
        validate: (o) => o && typeof o.title === 'string' && Array.isArray(o.timeline) && Array.isArray(o.objectives),
      }
    case 'paper': {
      const marks = [20, 40, 50, 60, 70, 100].includes(+b.marks) ? +b.marks : 70
      return {
        prompt: `${ctx}\nUnits / topics to cover: ${clip(b.topic, 300)}\nTotal marks: ${marks}. Language: ${lang}.
Create a university-style question paper as JSON:
{"title": string, "duration": string, "instructions": string[2-4], "sections": [{"name": string, "note": string, "questions": [{"q": string, "marks": number, "level": "Remember"|"Understand"|"Apply"|"Analyse"}]}], "totalMarks": number}
Use Section A (short answers), Section B (medium) and Section C (long/analytical). Marks of all questions must add up to totalMarks (${marks}), unless a section note says "attempt any N", in which case count only the attempted ones.`,
        validate: (o) => o && Array.isArray(o.sections) && o.sections.length > 0,
      }
    }
    case 'quiz': {
      const count = Math.min(Math.max(+b.count || 5, 3), 10)
      return {
        prompt: `${ctx}\nTopic(s): ${clip(b.topic, 200)}\nLanguage: ${lang}.
Create ${count} multiple-choice questions as JSON:
{"questions": [{"q": string, "options": string[4], "answer": number (0-3, index of the single correct option), "explanation": string (1 sentence), "topic": string (short sub-topic name, used for a class weak-topic heatmap)}]}
Every question must have exactly one correct option. Vary difficulty.`,
        validate: (o) => o && Array.isArray(o.questions) && o.questions.every((x: any) => Array.isArray(x.options) && x.options.length === 4 && Number.isInteger(x.answer) && x.answer >= 0 && x.answer < 4),
      }
    }
    case 'coach':
      return {
        prompt: `A ${clip(b.course, 40)} student in semester ${clip(b.semester, 4)} at ${clip(b.university, 60)} wants to become a ${clip(b.role, 60)}.
Current job-readiness: ${Math.min(Math.max(+b.readiness || 0, 0), 100)}%. Biggest skill gaps: ${clip(b.gaps, 300)}. Study time: ${clip(b.minutes, 4)} minutes per day. Language: ${lang}.
Reply as JSON: {"summary": string (2 encouraging, honest sentences), "focus": string[3] (what to do in the next 3 weeks, concrete), "tips": string[3] (study habits / free Indian resources such as NPTEL or SWAYAM), "project": string (one portfolio project idea that combines the gap skills and solves a local Indian problem)}`,
        validate: (o) => o && typeof o.summary === 'string' && Array.isArray(o.focus),
      }
    default:
      return null
  }
}

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)
  let body: any
  try {
    body = await req.json()
  } catch {
    return json({ error: 'invalid_json' }, 400)
  }
  const spec = buildPrompt(body)
  if (!spec) return json({ error: 'unknown_task' }, 400)
  if (body.task !== 'coach' && !clip(body.topic)) return json({ error: 'topic_required' }, 400)

  try {
    const text = await callGemini({ system: SYSTEM, prompt: spec.prompt, json: true, maxOutputTokens: 4096, temperature: 0.4 })
    let result
    try {
      result = parseJSON(text)
    } catch {
      console.error('Copilot: model returned invalid JSON', text.slice(0, 300))
      return json({ error: 'bad_model_output' }, 502)
    }
    if (!spec.validate(result)) return json({ error: 'bad_model_output' }, 502)
    return json({ task: body.task, result, ai: true })
  } catch (err) {
    if (err instanceof GeminiError) return json({ error: err.code }, err.status)
    console.error('Copilot failed:', err)
    return json({ error: 'server_error' }, 500)
  }
}
