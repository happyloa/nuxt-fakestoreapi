<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="text-center">
    <p class="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1 text-sm font-semibold text-primary-700">
      {{ t('auth.badge') }}
    </p>
    <h1 class="mt-4 text-3xl font-bold text-slate-900">{{ t('auth.title') }}</h1>
    <p class="mt-2 text-slate-600">{{ t('auth.subtitle') }}</p>
  </div>
</template>
