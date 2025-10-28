import { useHead } from '#imports'
import { useThemeStore } from '~/stores/theme'

type Theme = 'light' | 'dark'

const applyTheme = (theme: Theme) => {
  if (!process.client) return
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.setAttribute('data-theme', theme)
}

export default defineNuxtPlugin(() => {
  const themeStore = useThemeStore()
  const initial = themeStore.loadFromStorage()
  applyTheme(initial)

  useHead({
    htmlAttrs: {
      class: initial === 'dark' ? 'dark' : undefined,
      'data-theme': initial,
    },
  })

  themeStore.$subscribe((_mutation, state) => {
    applyTheme(state.preference)
    themeStore.persist(state.preference)
  })

  return {
    provide: {
      toggleTheme: () => themeStore.toggle(),
    },
  }
})
