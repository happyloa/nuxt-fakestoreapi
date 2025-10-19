<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <header class="flex flex-col gap-6 border-b border-slate-200 pb-8 md:flex-row md:items-center md:justify-between">
    <div class="space-y-2">
      <p class="text-sm font-semibold uppercase tracking-wide text-primary-600">{{ t('users.badge') }}</p>
      <h1 class="text-3xl font-bold text-slate-900">{{ t('users.title') }}</h1>
      <p class="text-slate-600">{{ t('users.subtitle') }}</p>
    </div>
    <NuxtLink to="/products" class="text-sm font-semibold text-primary-600 hover:text-primary-700">
      {{ t('users.actions.exploreProducts') }} →
    </NuxtLink>
  </header>
</template>
