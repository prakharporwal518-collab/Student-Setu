// Small Gemini helper shared by Netlify Functions. The key is read on the server only.

export class GeminiError extends Error {
  constructor(code, status, message) {
    super(message || code)
    this.code = code
    this.status = status
  }
}

/**
 * Calls Gemini generateContent.
 * @returns {Promise<string>} the model's text (JSON text when json = true)
 */
export async function callGemini({ system, prompt, json = false, maxOutputTokens = 2048, temperature = 0.5 }) {
  const apiKey = Netlify.env.get('GEMINI_API_KEY')
  if (!apiKey) throw new GeminiError('not_configured', 503)
  const model = Netlify.env.get('GEMINI_MODEL') || 'gemini-2.5-flash'
  let res
  try {
    res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature, maxOutputTokens, ...(json ? { responseMimeType: 'application/json' } : {}) },
      }),
    })
  } catch (err) {
    console.error('Gemini request failed:', err)
    throw new GeminiError('upstream_unreachable', 502)
  }
  if (!res.ok) {
    console.error(`Gemini error ${res.status}:`, (await res.text()).slice(0, 500))
    throw new GeminiError(res.status === 429 ? 'rate_limited' : 'upstream_error', res.status === 429 ? 429 : 502)
  }
  const data = await res.json()
  const text = (data?.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? '').join('').trim()
  if (!text) throw new GeminiError('empty_reply', 502)
  return text
}

/** Parses JSON from a model reply, tolerating ```json fences. */
export function parseJSON(text) {
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim()
  return JSON.parse(cleaned)
}
