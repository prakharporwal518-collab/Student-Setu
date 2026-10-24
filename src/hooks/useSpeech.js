import { useCallback, useEffect, useState } from 'react'

/**
 * Read text aloud with the browser's built-in voices (works offline, no data needed).
 * lang: 'hi' → Hindi voice if the device has one, otherwise English (India).
 */
export default function useSpeech() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => () => supported && window.speechSynthesis.cancel(), [supported])

  const stop = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [supported])

  const speak = useCallback(
    (text, lang = 'en') => {
      if (!supported || !text) return
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      const want = lang === 'hi' ? 'hi' : 'en-IN'
      const voices = window.speechSynthesis.getVoices()
      u.voice = voices.find((v) => v.lang.startsWith(want)) ?? voices.find((v) => v.lang.startsWith(lang === 'hi' ? 'hi' : 'en')) ?? null
      u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
      u.rate = 0.95
      u.onend = () => setSpeaking(false)
      u.onerror = () => setSpeaking(false)
      setSpeaking(true)
      window.speechSynthesis.speak(u)
    },
    [supported],
  )

  return { supported, speaking, speak, stop }
}
