import { watch } from 'vue'
import { useI18n } from 'vue-i18n'

const STORAGE_KEY = 'fakestore-locale'

export default defineNuxtPlugin(async () => {
  if (!process.client) return

  const { locale, setLocale } = useI18n()
  const readLocale = () => {
    try {
      return window.sessionStorage.getItem(STORAGE_KEY)
    } catch (error) {
      console.warn('Session storage is unavailable', error)
      return null
    }
  }

  const writeLocale = (value: string) => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, value)
    } catch (error) {
      console.warn('Session storage is unavailable', error)
    }
  }

  const storedLocale = readLocale()

  if (storedLocale && storedLocale !== locale.value) {
    await setLocale(storedLocale)
  }

  watch(
    locale,
    (next) => {
      writeLocale(next)
    },
    { immediate: true },
  )
})
