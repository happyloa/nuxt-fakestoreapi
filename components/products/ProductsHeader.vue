<script setup lang="ts">
const emit = defineEmits<{ (e: 'reset'): void }>()
const { t } = useI18n()
</script>

<template>
  <header class="flex flex-col gap-6 border-b border-slate-200 pb-8 md:flex-row md:items-center md:justify-between">
    <div class="space-y-2">
      <p class="text-sm font-semibold uppercase tracking-wide text-primary-600">{{ t('products.badge') }}</p>
      <h1 class="text-3xl font-bold text-slate-900">{{ t('products.title') }}</h1>
      <p class="text-slate-600">{{ t('products.subtitle') }}</p>
    </div>
    <div class="flex items-center gap-3">
      <NuxtLink to="/products/new" class="link-button">
        {{ t('home.actions.createProduct') }}
      </NuxtLink>
      <button
        type="button"
        class="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50"
        @click="emit('reset')"
      >
        {{ t('actions.reset') }}
      </button>
    </div>
  </header>
</template>
