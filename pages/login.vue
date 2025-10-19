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
    <div class="text-center">
      <p class="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1 text-sm font-semibold text-primary-700">
        {{ t('auth.badge') }}
      </p>
      <h1 class="mt-4 text-3xl font-bold text-slate-900">{{ t('auth.title') }}</h1>
      <p class="mt-2 text-slate-600">{{ t('auth.subtitle') }}</p>
    </div>

    <form class="card w-full max-w-xl space-y-6" @submit.prevent="submit">
      <label class="block space-y-2">
        <span class="text-sm font-semibold text-slate-700">{{ t('auth.fields.username') }}</span>
        <input
          v-model="credentials.username"
          type="text"
          class="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          :placeholder="t('auth.placeholders.username')"
        />
      </label>
      <label class="block space-y-2">
        <span class="text-sm font-semibold text-slate-700">{{ t('auth.fields.password') }}</span>
        <input
          v-model="credentials.password"
          type="password"
          class="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          :placeholder="t('auth.placeholders.password')"
        />
      </label>
      <button
        type="submit"
        class="link-button w-full justify-center text-base"
        :disabled="auth.loading"
      >
        <span v-if="auth.loading" class="flex items-center justify-center gap-2">
          <span class="h-4 w-4 animate-spin rounded-full border-2 border-primary-200 border-t-white" />
          {{ t('auth.actions.signingIn') }}
        </span>
        <span v-else>{{ t('auth.actions.signIn') }}</span>
      </button>
      <p v-if="auth.error" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
        {{ auth.error }}
      </p>
      <p class="text-xs text-slate-400">
        {{ t('auth.helper') }}
      </p>
    </form>
  </section>
</template>
