import { useEffect, useState } from 'react'

const EVT = 'ss-storage'
const readKey = (key) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

/** useState that is saved to localStorage (safe if storage is blocked).
 *  Other components using the same key (or useStoredValue) update right away. */
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
      const raw = JSON.stringify(value)
      if (localStorage.getItem(key) !== raw) {
        localStorage.setItem(key, raw)
        window.dispatchEvent(new CustomEvent(EVT, { detail: key }))
      }
    } catch {
      /* ignore quota / private mode */
    }
  }, [key, value])

  useEffect(() => {
    const sync = (e) => {
      if ((e.detail ?? e.key) !== key) return
      const raw = readKey(key)
      if (raw === null) return
      setValue((v) => (JSON.stringify(v) === raw ? v : JSON.parse(raw)))
    }
    window.addEventListener(EVT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [key])

  return [value, setValue]
}

/** Read-only view of a stored value that stays in sync (never writes a default). */
export function useStoredValue(key, fallback) {
  const parse = () => {
    try {
      const raw = readKey(key)
      return raw === null ? fallback : JSON.parse(raw)
    } catch {
      return fallback
    }
  }
  const [value, setValue] = useState(parse)
  useEffect(() => {
    const sync = (e) => {
      if ((e.detail ?? e.key) === key) setValue(parse())
    }
    window.addEventListener(EVT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps
  return value
}
