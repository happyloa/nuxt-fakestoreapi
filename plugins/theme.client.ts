import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useHead } from '#imports'
import { useThemeStore, type ThemePreference } from '~/stores/theme'

const applyTheme = (theme: ThemePreference) => {
  if (!process.client) return
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.setAttribute('data-theme', theme)
}

export default defineNuxtPlugin(() => {
  const themeStore = useThemeStore()
  themeStore.hydrate()

  const { preference } = storeToRefs(themeStore)

  const syncTheme = (theme: ThemePreference) => {
    applyTheme(theme)
    themeStore.persist(theme)
  }

  syncTheme(preference.value)

  watch(preference, (next) => {
    syncTheme(next)
  })

  useHead(() => ({
    htmlAttrs: {
      class: preference.value === 'dark' ? 'dark' : undefined,
      'data-theme': preference.value,
    },
  }))
})
