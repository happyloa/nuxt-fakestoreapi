<script setup lang="ts">
const props = defineProps<{ id: number }>()
const { t } = useI18n()
</script>

<template>
  <div class="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 px-6 py-5 text-sm text-emerald-700">
    {{ t('createProduct.success', { id: props.id }) }}
  </div>
</template>
