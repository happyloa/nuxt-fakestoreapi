<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="card bg-slate-900 text-white">
    <h3 class="text-lg font-semibold">{{ t('cart.help.title') }}</h3>
    <p class="mt-2 text-sm text-slate-200">{{ t('cart.help.description') }}</p>
    <NuxtLink to="/users" class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
      {{ t('cart.help.action') }}
    </NuxtLink>
  </div>
</template>
