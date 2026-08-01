import type { LoginInput, PublicUser, SessionResponse } from "~/types/storefront"

export const useSession = () => {
  const user = useState<PublicUser | null>("storefront-session-user", () => null)
  const isReady = useState("storefront-session-ready", () => false)
  const isLoading = useState("storefront-session-loading", () => false)

  const isSignedIn = computed(() => Boolean(user.value))

  const refresh = async () => {
    if (isLoading.value) return user.value

    isLoading.value = true
    try {
      const request = import.meta.server ? useRequestFetch() : $fetch
      user.value = await request<PublicUser>("/api/auth/me")
      return user.value
    } catch {
      user.value = null
      return null
    } finally {
      isLoading.value = false
      isReady.value = true
    }
  }

  const signIn = async (input: LoginInput) => {
    isLoading.value = true
    try {
      const response = await $fetch<SessionResponse>("/api/auth/session", {
        method: "POST",
        body: input,
      })
      if (!response.authenticated || !response.user) {
        throw new Error("Unable to establish a demo session")
      }
      user.value = response.user
      isReady.value = true
      return response.user
    } finally {
      isLoading.value = false
    }
  }

  const signOut = async () => {
    await $fetch("/api/auth/session", { method: "DELETE" })
    user.value = null
    isReady.value = true
  }

  if (import.meta.client) {
    onMounted(() => {
      if (!isReady.value) void refresh()
    })
  }

  return {
    user,
    isReady,
    isLoading,
    isSignedIn,
    refresh,
    signIn,
    signOut,
  }
}
