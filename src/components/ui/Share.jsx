import { Pause, Volume2 } from 'lucide-react'
import useSpeech from '../../hooks/useSpeech'

export const whatsappUrl = (text) => `https://wa.me/?text=${encodeURIComponent(text)}`

const WaIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M17.5 14.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.4ZM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z" />
  </svg>
)

/** "Share on WhatsApp" — opens WhatsApp (app or web) with the text pre-filled. */
export function WhatsAppButton({ text, label = 'Share on WhatsApp', className = '' }) {
  return (
    <a href={whatsappUrl(text)} target="_blank" rel="noreferrer" className={`btn bg-emerald-500 py-2 text-white hover:bg-emerald-600 ${className}`}>
      <WaIcon className="h-4 w-4" /> {label}
    </a>
  )
}

/** Listen button using the device's text-to-speech (works offline). */
export function ListenButton({ text, lang = 'en', className = '' }) {
  const { supported, speaking, speak, stop } = useSpeech()
  if (!supported) return null
  return (
    <button type="button" onClick={() => (speaking ? stop() : speak(text, lang))} className={`btn-ghost py-2 ${className}`} aria-pressed={speaking}>
      {speaking ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />} {speaking ? 'Stop' : lang === 'hi' ? 'सुनें' : 'Listen'}
    </button>
  )
}
