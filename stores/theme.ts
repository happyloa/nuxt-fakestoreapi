import { defineStore } from 'pinia'

export type ThemePreference = 'light' | 'dark'

const STORAGE_KEY = 'fakestore-theme'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    preference: 'dark' as ThemePreference,
  }),
  actions: {
    setTheme(theme: ThemePreference) {
      this.preference = theme
    },
    toggle() {
      this.setTheme(this.preference === 'dark' ? 'light' : 'dark')
    },
    loadFromStorage() {
      if (!process.client) return this.preference
      const stored = window.localStorage.getItem(STORAGE_KEY) as ThemePreference | null
      if (stored === 'light' || stored === 'dark') {
        this.preference = stored
      }
      return this.preference
    },
    persist(theme: ThemePreference) {
      if (!process.client) return
      window.localStorage.setItem(STORAGE_KEY, theme)
    },
  },
})
