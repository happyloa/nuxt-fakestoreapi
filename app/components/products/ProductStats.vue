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
    class="flex flex-wrap justify-between gap-x-8 gap-y-5 border-y border-slate-200 py-6 dark:border-slate-800"
    :aria-label="$t('products.stats.sectionTitle')"
  >
    <div class="flex items-baseline gap-3">
      <span class="text-2xl font-extrabold">{{ totalProducts }}</span
      ><span class="text-sm text-slate-500 dark:text-slate-400">{{
        $t("products.stats.totalProducts")
      }}</span>
    </div>
    <div class="flex items-baseline gap-3">
      <span class="text-2xl font-extrabold">{{ categoriesCount }}</span
      ><span class="text-sm text-slate-500 dark:text-slate-400">{{
        $t("products.stats.categories")
      }}</span>
    </div>
    <div class="flex items-baseline gap-3">
      <span class="text-2xl font-extrabold">{{
        $n(averagePrice, "currency")
      }}</span
      ><span class="text-sm text-slate-500 dark:text-slate-400">{{
        $t("products.stats.averagePrice")
      }}</span>
    </div>
  </section>
</template>
