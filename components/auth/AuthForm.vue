<script setup lang="ts">
const props = defineProps<{
  credentials: { username: string; password: string }
  loading: boolean
  error: string
}>()

const emit = defineEmits<{
  (e: 'update:username', value: string): void
  (e: 'update:password', value: string): void
  (e: 'submit'): void
}>()

const { t } = useI18n()

const submit = () => emit('submit')
</script>

<template>
  <form class="card w-full max-w-xl space-y-6" @submit.prevent="submit">
    <label class="block space-y-2">
      <span class="text-sm font-semibold text-slate-700">{{ t('auth.fields.username') }}</span>
      <input
        :value="props.credentials.username"
        type="text"
        class="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
        :placeholder="t('auth.placeholders.username')"
        @input="emit('update:username', ($event.target as HTMLInputElement).value)"
      />
    </label>
    <label class="block space-y-2">
      <span class="text-sm font-semibold text-slate-700">{{ t('auth.fields.password') }}</span>
      <input
        :value="props.credentials.password"
        type="password"
        class="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
        :placeholder="t('auth.placeholders.password')"
        @input="emit('update:password', ($event.target as HTMLInputElement).value)"
      />
    </label>
    <button
      type="submit"
      class="link-button w-full justify-center text-base"
      :disabled="props.loading"
    >
      <span v-if="props.loading" class="flex items-center justify-center gap-2">
        <span class="h-4 w-4 animate-spin rounded-full border-2 border-primary-200 border-t-white" />
        {{ t('auth.actions.signingIn') }}
      </span>
      <span v-else>{{ t('auth.actions.signIn') }}</span>
    </button>
    <p v-if="props.error" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
      {{ props.error }}
    </p>
    <p class="text-xs text-slate-400">
      {{ t('auth.helper') }}
    </p>
  </form>
</template>
