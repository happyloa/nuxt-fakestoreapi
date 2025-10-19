import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './plugins/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#dceefb',
          200: '#b6e0fe',
          300: '#84c5f4',
          400: '#62b0e8',
          500: '#4098d7',
          600: '#2680c2',
          700: '#186faf',
          800: '#0f609b',
          900: '#0a558c',
        },
        accent: '#ff8c42',
      },
      fontFamily: {
        sans: ['Noto Sans TC', 'Inter', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        focus: '0 0 0 4px rgba(64, 152, 215, 0.35)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
