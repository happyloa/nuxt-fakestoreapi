<script setup lang="ts">
const props = defineProps<{
  pending?: boolean
  error?: string
}>()

const emit = defineEmits<{ submit: [input: { username: string; password: string }] }>()
const username = ref("")
const password = ref("")

const fillDemoCredentials = () => {
  username.value = "mor_2314"
  password.value = "83r5^_"
}

const submit = () => {
  if (!username.value.trim() || !password.value || props.pending) return
  emit("submit", { username: username.value.trim(), password: password.value })
}
</script>

<template>
  <form class="auth-form" @submit.prevent="submit">
    <p class="eyebrow">{{ $t("auth.eyebrow") }}</p>
    <h1 class="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
      {{ $t("auth.title") }}
    </h1>
    <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
      {{ $t("auth.description") }}
    </p>

    <div class="mt-7 grid gap-4">
      <label class="field-label">
        <span>{{ $t("auth.username") }}</span>
        <input v-model="username" class="field-control" autocomplete="username" required />
      </label>
      <label class="field-label">
        <span>{{ $t("auth.password") }}</span>
        <input v-model="password" class="field-control" type="password" autocomplete="current-password" required />
      </label>
    </div>

    <p v-if="error" class="form-error mt-4" role="alert">{{ error }}</p>

    <button class="btn-primary mt-6 w-full" type="submit" :disabled="pending">
      {{ pending ? $t("auth.submitting") : $t("auth.submit") }}
    </button>
    <button class="btn-quiet mt-3 w-full" type="button" :disabled="pending" @click="fillDemoCredentials">
      {{ $t("auth.fillDemo") }}
    </button>
    <p class="mt-4 text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
      {{ $t("auth.demoHint") }}
    </p>
  </form>
</template>
