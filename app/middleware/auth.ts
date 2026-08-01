export default defineNuxtRouteMiddleware(async (to) => {
  const { isSignedIn, refresh } = useSession()

  if (!isSignedIn.value) {
    await refresh()
  }

  if (isSignedIn.value) return

  const localePath = useLocalePath()
  return navigateTo({
    path: localePath("/login"),
    query: { redirect: to.fullPath },
  })
})
