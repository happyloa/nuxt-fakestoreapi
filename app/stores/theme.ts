import { defineStore } from 'pinia'

export type ThemePreference = 'light' | 'dark'

const STORAGE_KEY = 'fakestore-theme'

const getStorage = () => {
  if (!process.client) return null
  try {
    return window.localStorage
  } catch (error) {
    console.warn('Local storage is unavailable', error)
    return null
  }
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    preference: 'dark' as ThemePreference,
    hydrated: false,
  }),
  actions: {
    setTheme(theme: ThemePreference) {
      this.preference = theme
    },
    toggle() {
      this.setTheme(this.preference === 'dark' ? 'light' : 'dark')
    },
    hydrate() {
      if (this.hydrated) {
        return this.preference
      }

      if (!process.client) {
        this.hydrated = true
        return this.preference
      }

      const storage = getStorage()
      const stored = storage?.getItem(STORAGE_KEY) as ThemePreference | null
      const resolved = stored === 'light' || stored === 'dark' ? stored : 'dark'

      this.preference = resolved
      this.hydrated = true
      return this.preference
    },
    persist(theme: ThemePreference) {
      const storage = getStorage()
      storage?.setItem(STORAGE_KEY, theme)
    },
  },
})
