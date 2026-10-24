/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep indigo / blue – trust
        brand: {
          50: '#eef3ff',
          100: '#dbe5ff',
          200: '#bfd0ff',
          300: '#93b0fd',
          400: '#6186f9',
          500: '#3d60f2',
          600: '#2743e0',
          700: '#1f34c4',
          800: '#1e2f9c',
          900: '#1c2c7a',
          950: '#121a4a',
        },
        // Warm saffron – Indian touch
        saffron: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        ink: {
          900: '#0b1230',
          950: '#070b1f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        hand: ['Caveat', 'cursive'],
        hindi: ['"Noto Sans Devanagari"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(16,24,64,.08), 0 8px 24px -8px rgba(16,24,64,.10)',
        lift: '0 10px 30px -10px rgba(16,24,64,.25)',
        glow: '0 0 0 4px rgba(249,115,22,.18)',
      },
      borderRadius: { '4xl': '2rem' },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      animation: { float: 'float 6s ease-in-out infinite' },
    },
  },
  plugins: [],
}
