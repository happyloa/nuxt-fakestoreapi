<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const { t } = useI18n()

const credentials = reactive({
  username: '',
  password: '',
})

useSeoMeta({
  title: t('auth.title'),
  description: t('auth.subtitle'),
})

const submit = async () => {
  if (!credentials.username || !credentials.password) {
    auth.error = t('auth.validation.required')
    return
  }
  await auth.login(credentials.username, credentials.password)
}
</script>

<template>
  <section class="mx-auto flex max-w-4xl flex-col items-center gap-10 px-4 py-16 sm:px-6 lg:px-8">
    <AuthHero />
    <AuthForm
      :credentials="credentials"
      :loading="auth.loading"
      :error="auth.error"
      @update:username="credentials.username = $event"
      @update:password="credentials.password = $event"
      @submit="submit"
    />
  </section>
</template>
