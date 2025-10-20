import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'

export default <Partial<Config>>{
  content: [
    './app.vue',
    './components/**/*.{js,ts,vue}',
    './layouts/**/*.{js,ts,vue}',
    './pages/**/*.{js,ts,vue}',
    './composables/**/*.{js,ts}',
    './stores/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#38bdf8',
          light: '#7dd3fc',
          dark: '#0ea5e9',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'Noto Sans TC',
          ...defaultTheme.fontFamily.sans,
        ],
      },
      boxShadow: {
        glow: '0 0 30px rgba(56, 189, 248, 0.35)',
      },
    },
  },
  plugins: [forms, typography],
}
