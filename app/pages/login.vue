<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const { t } = useI18n()
const { isSignedIn, isLoading, refresh, signIn } = useSession()
const errorMessage = ref("")

const resolveRedirect = () => {
  const redirect = route.query.redirect
  return typeof redirect === "string" && redirect.startsWith("/") && !redirect.startsWith("//")
    ? redirect
    : localePath("/account")
}

if (await refresh()) {
  await navigateTo(resolveRedirect())
}

const submit = async (input: { username: string; password: string }) => {
  errorMessage.value = ""
  try {
    await signIn(input)
    await navigateTo(resolveRedirect())
  } catch {
    errorMessage.value = t("auth.failure")
  }
}

watch(isSignedIn, (signedIn) => {
  if (signedIn) void navigateTo(resolveRedirect())
})

useSeoMeta({
  title: () => t("auth.title"),
  description: () => t("auth.description"),
})
</script>

<template>
  <div class="mx-auto max-w-md py-4 sm:py-10">
    <AuthSignInForm :pending="isLoading" :error="errorMessage" @submit="submit" />
  </div>
</template>
