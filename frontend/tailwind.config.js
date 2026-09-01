/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f6efff',
        ink: '#f6efff',
        mute: '#d7cbe8',
        line: 'rgba(255, 142, 200, 0.16)',
        good: '#7dffe0',
        warn: '#f5c26b',
        bad: '#ff7b8a',
        brand: '#ff8ec8',
        void: '#07030f',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        serif: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
