/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f6efff',
        ink: '#f6efff',
        mute: '#b7a8c9',
        line: 'rgba(255, 142, 200, 0.16)',
        good: '#7dffe0',
        warn: '#f5c26b',
        bad: '#ff7b8a',
        brand: '#ff8ec8',
        void: '#07030f',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
