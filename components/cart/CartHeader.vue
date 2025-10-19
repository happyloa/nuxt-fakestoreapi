<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <header class="flex flex-col gap-4 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
    <div class="space-y-2">
      <p class="text-sm font-semibold uppercase tracking-wide text-primary-600">{{ t('cart.badge') }}</p>
      <h1 class="text-3xl font-bold text-slate-900">{{ t('cart.title') }}</h1>
      <p class="text-slate-600">{{ t('cart.subtitle') }}</p>
    </div>
    <NuxtLink to="/products" class="link-button">
      {{ t('cart.actions.continueShopping') }}
    </NuxtLink>
  </header>
</template>
