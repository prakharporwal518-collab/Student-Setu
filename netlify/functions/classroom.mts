import type { Context } from '@netlify/functions'
import { getStore } from '@netlify/blobs'
import { handle } from '../lib/classroomHandler.mjs'

/*
 * Teacher Copilot classrooms, stored in Netlify Blobs (no database setup needed).
 * Serves at /.netlify/functions/classroom
 *
 *   GET  ?ping=1                 → { ok: true }
 *   GET  ?code=ABC123            → public class (notes + quizzes without answers)
 *   POST { action: 'create', teacherName, subject, course, semester } → { code, teacherKey }
 *   POST { action: 'createDemo', teacherName }                     → seeded demo class
 *   POST { action: 'addQuiz' | 'addNote', code, teacherKey, quiz | note }
 *   POST { action: 'submit', code, quizId, studentName, answers }   → graded result
 *   POST { action: 'results', code, teacherKey }                    → insights for the heatmap
 */

export default async (req: Request, _context: Context) => handle(req, getStore({ name: 'classroom', consistency: 'strong' }))
