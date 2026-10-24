import { useEffect, useState } from 'react'
import { myBadges } from '../services/badges'

/** Badges earned on this device, kept in sync when a new one is issued. */
export default function useMyBadges() {
  const [list, setList] = useState(myBadges)
  useEffect(() => {
    const on = () => setList(myBadges())
    window.addEventListener('ss:badges', on)
    window.addEventListener('storage', on)
    return () => {
      window.removeEventListener('ss:badges', on)
      window.removeEventListener('storage', on)
    }
  }, [])
  return list
}
