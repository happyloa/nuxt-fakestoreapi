<script setup lang="ts">
const props = defineProps({
  totalProducts: {
    type: Number,
    default: 0,
  },
  averagePrice: {
    type: Number,
    default: 0,
  },
  categoriesCount: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-3">
    <BaseStatCard :label="$t('products.stats.totalProducts')" :value="totalProducts" />
    <BaseStatCard :label="$t('products.stats.averagePrice')" :value="`$${averagePrice.toFixed(2)}`" />
    <BaseStatCard :label="$t('products.stats.categories')" :value="categoriesCount" />
  </div>
</template>
