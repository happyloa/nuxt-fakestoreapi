<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm font-semibold uppercase tracking-wide text-primary-600">{{ t('createProduct.badge') }}</p>
    <h1 class="text-3xl font-bold text-slate-900">{{ t('createProduct.title') }}</h1>
    <p class="text-slate-600">{{ t('createProduct.subtitle') }}</p>
  </div>
</template>
