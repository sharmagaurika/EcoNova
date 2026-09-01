/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#05070c',
        ink: '#0b1220',
        panel: '#10182a',
        line: 'rgba(232, 238, 247, 0.12)',
        paper: '#e8eef7',
        mute: '#8b97a8',
        signal: '#3dffc8',
        gold: '#f5c542',
        ion: '#82a7ff',
        flare: '#ff6b6b',
        nebula: '#6d4aff',
      },
      fontFamily: {
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
        sans: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'DM Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(61, 255, 200, 0.18)',
        gold: '0 0 28px rgba(245, 197, 66, 0.22)',
      },
    },
  },
  plugins: [],
}
