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
        // 提升深淺對比的品牌色與強調色，搭配暗色模式也能保持辨識度
        brand: {
          DEFAULT: '#1e3a8a',
          foreground: '#ffffff',
          dark: '#162f6a',
          light: '#e2e8ff',
        },
        accent: {
          DEFAULT: '#f43f5e',
          foreground: '#ffffff',
          dark: '#be123c',
          light: '#ffe4e6',
        },
      },
      boxShadow: {
        card: '0 12px 32px -14px rgba(30, 58, 138, 0.45)',
      },
    },
  },
  plugins: [forms],
} satisfies Config
