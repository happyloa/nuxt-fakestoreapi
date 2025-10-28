import { defineStore } from 'pinia'

export type ThemePreference = 'light' | 'dark'

const STORAGE_KEY = 'fakestore-theme'

const getStorage = () => {
  if (!process.client) return null
  try {
    return window.sessionStorage
  } catch (error) {
    console.warn('Session storage is unavailable', error)
    return null
  }
}

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
      const storage = getStorage()
      const stored = storage?.getItem(STORAGE_KEY) as ThemePreference | null
      if (stored === 'light' || stored === 'dark') {
        this.preference = stored
      }
      return this.preference
    },
    persist(theme: ThemePreference) {
      const storage = getStorage()
      storage?.setItem(STORAGE_KEY, theme)
    },
  },
})
