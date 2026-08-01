type Theme = "light" | "dark"

const themeStorageKey = "storefront-lab:theme"

export const useTheme = () => {
  const theme = useState<Theme>("storefront-theme", () => "light")
  const hasLoaded = useState("storefront-theme-loaded", () => false)

  const apply = () => {
    document.documentElement.classList.toggle("dark", theme.value === "dark")
    document.documentElement.style.colorScheme = theme.value
  }

  const toggleTheme = () => {
    theme.value = theme.value === "dark" ? "light" : "dark"
  }

  if (import.meta.client) {
    onMounted(() => {
      if (!hasLoaded.value) {
        const stored = window.localStorage.getItem(themeStorageKey)
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        theme.value = stored === "dark" || (!stored && systemPrefersDark) ? "dark" : "light"
        hasLoaded.value = true
      }

      apply()
      watch(theme, () => {
        window.localStorage.setItem(themeStorageKey, theme.value)
        apply()
      })
    })
  }

  return { theme, toggleTheme }
}
