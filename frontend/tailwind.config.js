/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          navy: '#1B0B47',
          deep: '#0d061f',
          violet: '#5222A5',
          lavender: '#7B61FF',
          lavenderLight: '#9D8AFF',
          lavenderGlow: '#B8A9FF',
          pink: '#FF85C1', // Lighter pink
          pinkLight: '#FF9ECA',
          pinkGlow: '#FFB6E0',
          cyan: '#3B82F6',
          cyanLight: '#60A5FA',
          green: '#10B981',
          greenGlow: '#34D399',
          gray: '#6B7280',
          debris: '#4B5563',
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        heading: ['Bebas Neue', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'orbit': 'orbit 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 60s linear infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'bounce-gentle': 'bounce 2s ease-in-out infinite',
      },
      keyframes: {
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255, 133, 193, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(255, 133, 193, 0.8), 0 0 60px rgba(123, 97, 255, 0.4)' },
        },
        twinkle: {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 1 },
        },
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(to bottom, #1B0B47, #0d061f, #1B0B47)',
      }
    },
  },
  plugins: [],
}
