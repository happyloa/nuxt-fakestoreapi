import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

export default {
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans TC"', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        brand: {
          DEFAULT: '#2563eb',
          foreground: '#ffffff',
          dark: '#1d4ed8',
          light: '#dbeafe',
        },
        accent: {
          DEFAULT: '#f97316',
          foreground: '#ffffff',
          dark: '#ea580c',
          light: '#ffedd5',
        },
      },
      boxShadow: {
        card: '0 10px 25px -10px rgba(30, 64, 175, 0.35)',
      },
    },
  },
  plugins: [forms],
} satisfies Config
