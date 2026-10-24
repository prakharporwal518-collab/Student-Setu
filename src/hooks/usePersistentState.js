import { useEffect, useState } from 'react'

/** useState that is saved to localStorage (safe if storage is blocked). */
export default function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw !== null) return JSON.parse(raw)
    } catch {
      /* storage unavailable */
    }
    return typeof initial === 'function' ? initial() : initial
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* ignore quota / private mode */
    }
  }, [key, value])

  return [value, setValue]
}
