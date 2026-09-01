/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f4f1ea',
        ink: '#16181d',
        mute: '#5d635c',
        line: '#d7ddd2',
        card: '#fffcf6',
        good: '#176b45',
        warn: '#b45309',
        bad: '#b42318',
        brand: '#5b3cc4',
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
