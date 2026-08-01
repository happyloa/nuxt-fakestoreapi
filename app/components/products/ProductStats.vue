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
      :value="totalProducts"
      accent-color="from-brand to-blue-500"
      data-aos="fade-up"
      data-aos-delay="0" />
    <BaseStatCard
      :label="$t('products.stats.averagePrice')"
      :value="`$${averagePrice.toFixed(2)}`"
      accent-color="from-emerald-500 to-teal-500"
      data-aos="fade-up"
      data-aos-delay="100" />
    <BaseStatCard
      :label="$t('products.stats.categories')"
      :value="categoriesCount"
      accent-color="from-accent to-pink-500"
      data-aos="fade-up"
      data-aos-delay="200" />
  </section>
</template>
