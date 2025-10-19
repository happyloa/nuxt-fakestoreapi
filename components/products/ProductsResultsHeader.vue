<script setup lang="ts">
const props = defineProps<{ count: number }>()
const { t } = useI18n()
</script>

<template>
  <div class="flex items-center justify-between">
    <p class="text-sm text-slate-500">
      {{ t('products.resultCount', { count: props.count }) }}
    </p>
    <NuxtLink to="/cart" class="text-sm font-semibold text-primary-600 hover:text-primary-700">
      {{ t('products.actions.viewCart') }} →
    </NuxtLink>
  </div>
</template>
