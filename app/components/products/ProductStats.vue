<script setup lang="ts">
interface Props {
  totalProducts?: number;
  averagePrice?: number;
  categoriesCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  totalProducts: 0,
  averagePrice: 0,
  categoriesCount: 0,
});
</script>

<template>
  <section
    class="grid gap-4 sm:grid-cols-3"
    aria-labelledby="product-statistics-heading">
    <h2 id="product-statistics-heading" class="sr-only">
      {{ $t("products.stats.sectionTitle") }}
    </h2>
    <BaseStatCard
      :label="$t('products.stats.totalProducts')"
      :value="totalProducts" />
    <BaseStatCard
      :label="$t('products.stats.averagePrice')"
      :value="`$${averagePrice.toFixed(2)}`" />
    <BaseStatCard
      :label="$t('products.stats.categories')"
      :value="categoriesCount" />
  </section>
</template>
