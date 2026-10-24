import { useId, useMemo } from 'react'

// Tiny seeded random so skylines are stable between renders.
const seeded = (seed) => {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

/** Random rectangular skyline as an SVG path, plus window light positions. */
function skyline({ width, base, minH, maxH, seed, step = [14, 30] }) {
  const rnd = seeded(seed)
  let x = 0
  let d = `M0 ${base}`
  const windows = []
  while (x < width) {
    const w = step[0] + rnd() * (step[1] - step[0])
    const h = minH + rnd() * (maxH - minH)
    const top = base - h
    d += ` V${top.toFixed(1)} H${(x + w).toFixed(1)}`
    if (rnd() > 0.35) {
      for (let wy = top + 6; wy < base - 8; wy += 9) {
        for (let wx = x + 4; wx < x + w - 4; wx += 7) if (rnd() > 0.72) windows.push([wx, wy])
      }
    }
    x += w
  }
  d += ` V${base} Z`
  return { d, windows }
}

// Landmark silhouettes, drawn around x=0 with ground at y=0 (translate to place).
const landmarks = {
  mosque: (
    <>
      <rect x="-62" y="-100" width="8" height="100" />
      <path d="M-64 -100 L-58 -124 L-52 -100 Z" />
      <rect x="54" y="-100" width="8" height="100" />
      <path d="M52 -100 L58 -124 L64 -100 Z" />
      <rect x="-42" y="-48" width="84" height="48" />
      <path d="M-32 -48 Q-32 -92 0 -96 Q32 -92 32 -48 Z" />
      <rect x="-1" y="-112" width="2" height="18" />
    </>
  ),
  gate: (
    <>
      <rect x="-42" y="-92" width="84" height="12" />
      <rect x="-22" y="-104" width="44" height="12" />
      <path d="M-36 0 V-80 H36 V0 H18 V-44 Q0 -66 -18 -44 V0 Z" />
    </>
  ),
  mahal: (
    <>
      <path d="M-52 0 V-40 H-42 V-56 H-30 V-72 H-18 V-84 H18 V-72 H30 V-56 H42 V-40 H52 V0 Z" />
      {[-46, -36, -24, -12, 0, 12, 24, 36, 46].map((x, i) => (
        <circle key={i} cx={x} cy={[-40, -56, -72, -84, -88, -84, -72, -56, -40][i]} r="4" />
      ))}
    </>
  ),
  palace: (
    <>
      <rect x="-50" y="-70" width="100" height="70" />
      <rect x="-40" y="-84" width="80" height="14" />
      <rect x="-28" y="-96" width="56" height="12" />
      <path d="M-50 -70 Q-50 -82 -42 -84 Q-34 -82 -34 -70 Z M34 -70 Q34 -82 42 -84 Q50 -82 50 -70 Z" />
      <path d="M-10 -96 Q-10 -110 0 -112 Q10 -110 10 -96 Z" />
    </>
  ),
  imambara: (
    <>
      <rect x="-70" y="-48" width="140" height="48" />
      <path d="M-60 -48 Q-60 -70 -45 -72 Q-30 -70 -30 -48 Z M30 -48 Q30 -70 45 -72 Q60 -70 60 -48 Z" />
      <path d="M-22 -48 Q-22 -86 0 -88 Q22 -86 22 -48 Z" />
      <rect x="-1" y="-100" width="2" height="14" />
    </>
  ),
  temple: (
    <>
      <path d="M-30 0 V-46 Q-26 -80 0 -116 Q26 -80 30 -46 V0 Z" />
      <rect x="-48" y="-40" width="96" height="40" />
      <path d="M0 -116 V-134 L14 -128 L0 -122" />
    </>
  ),
}

/** Illustrated city card art: sunset sky + skyline + landmark. */
export function CityArt({ palette = ['#fb923c', '#f43f5e', '#312e81'], landmark = 'mosque', seed = 7, className = '' }) {
  const id = useId().replace(/:/g, '')
  const far = useMemo(() => skyline({ width: 400, base: 170, minH: 20, maxH: 55, seed: seed * 3 }), [seed])
  const near = useMemo(() => skyline({ width: 400, base: 200, minH: 25, maxH: 70, seed: seed * 5 + 1, step: [18, 36] }), [seed])
  return (
    <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={palette[2]} />
          <stop offset="0.55" stopColor={palette[1]} />
          <stop offset="1" stopColor={palette[0]} />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill={`url(#sky-${id})`} />
      <circle cx="300" cy="120" r="34" fill="#fff7d6" opacity="0.85" />
      <circle cx="300" cy="120" r="54" fill="#fff7d6" opacity="0.18" />
      <path d={far.d} fill={palette[2]} opacity="0.45" />
      <g fill="#0b1230" opacity="0.9" transform="translate(150 200)">
        {landmarks[landmark]}
      </g>
      <path d={near.d} fill="#0b1230" opacity="0.92" />
      {near.windows.slice(0, 60).map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="2.5" height="3" fill="#fde68a" opacity="0.8" />
      ))}
    </svg>
  )
}

/** Hero artwork: student with a backpack looking at an Indian city at sunset. */
export function HeroArt({ className = '' }) {
  const far = useMemo(() => skyline({ width: 900, base: 380, minH: 40, maxH: 120, seed: 11, step: [20, 46] }), [])
  const mid = useMemo(() => skyline({ width: 900, base: 420, minH: 30, maxH: 150, seed: 23, step: [24, 54] }), [])
  return (
    <svg viewBox="0 0 900 500" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#121a4a" />
          <stop offset="0.35" stopColor="#3b3a8f" />
          <stop offset="0.62" stopColor="#e86a5a" />
          <stop offset="0.82" stopColor="#fbae5c" />
          <stop offset="1" stopColor="#ffd59a" />
        </linearGradient>
        <radialGradient id="hero-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff6d5" />
          <stop offset="0.4" stopColor="#ffe2a0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffb86b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hero-person" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b2350" />
          <stop offset="1" stopColor="#070b1f" />
        </linearGradient>
      </defs>
      <rect width="900" height="500" fill="url(#hero-sky)" />
      {/* clouds */}
      <g fill="#ffd9b0" opacity="0.35">
        <ellipse cx="200" cy="170" rx="120" ry="10" />
        <ellipse cx="640" cy="130" rx="150" ry="9" />
        <ellipse cx="420" cy="215" rx="90" ry="6" />
      </g>
      <circle cx="470" cy="330" r="150" fill="url(#hero-sun)" />
      <circle cx="470" cy="330" r="46" fill="#fff4cf" />
      {/* birds */}
      <g fill="none" stroke="#1b2350" strokeWidth="2.2" strokeLinecap="round" opacity="0.7">
        <path d="M300 150 q8 -8 16 0 q8 -8 16 0" />
        <path d="M345 128 q6 -6 12 0 q6 -6 12 0" />
        <path d="M262 182 q5 -5 10 0 q5 -5 10 0" />
      </g>
      <path d={far.d} fill="#5a3f86" opacity="0.55" />
      {/* landmarks on the mid layer */}
      <g fill="#241f55" opacity="0.9">
        <g transform="translate(330 420) scale(1.3)">{landmarks.mosque}</g>
        <g transform="translate(150 420) scale(1.1)">{landmarks.gate}</g>
        <g transform="translate(560 420) scale(1.2)">{landmarks.temple}</g>
      </g>
      <path d={mid.d} fill="#1b1b4a" opacity="0.92" />
      {mid.windows.slice(0, 160).map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="3" height="4" fill="#ffd27a" opacity="0.75" />
      ))}
      {/* terrace / foreground */}
      <path d="M0 455 Q450 430 900 450 V500 H0 Z" fill="#0b1230" />
      {/* student from behind */}
      <g transform="translate(700 0)">
        <path d="M-78 500 L-70 360 Q-66 318 -30 308 L30 308 Q66 318 70 360 L78 500 Z" fill="url(#hero-person)" />
        <rect x="-12" y="276" width="24" height="36" rx="8" fill="#141a3f" />
        <circle cx="0" cy="250" r="38" fill="#141a3f" />
        <path d="M-38 246 Q-36 206 0 204 Q38 206 38 246 Q30 226 0 224 Q-30 226 -38 246 Z" fill="#0a0f2b" />
        {/* backpack */}
        <rect x="-50" y="330" width="100" height="135" rx="26" fill="#2b3a7a" />
        <rect x="-34" y="392" width="68" height="44" rx="12" fill="#22306a" />
        <rect x="-12" y="320" width="24" height="12" rx="5" fill="#22306a" />
        <path d="M-40 335 L-58 320 M40 335 L58 320" stroke="#141a3f" strokeWidth="10" strokeLinecap="round" />
        <rect x="-4" y="402" width="8" height="18" rx="3" fill="#f97316" />
      </g>
    </svg>
  )
}
