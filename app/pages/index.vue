<script setup lang="ts">
import { useProductFilters } from "~/composables/useProductFilters";
import { useProductsStore } from "~/stores/products";

const productsStore = useProductsStore();
const { t } = useI18n();

// SSR 載入的目錄透過 Pinia payload 帶到用戶端；之後切回首頁時 store 已有資料，不會重新下載。
const {
  pending: isPageLoading,
  error: asyncError,
  refresh,
} = await useAsyncData("catalog", async () => {
  await productsStore.loadCatalog();
  return true;
});

const pageError = computed(() => {
  if (asyncError.value) {
    return asyncError.value.statusCode === 502
      ? t("errors.catalogUnavailable")
      : t("errors.load");
  }
  return "";
});

const {
  selectedCategory,
  sortOrder,
  searchQuery,
  filteredProducts,
  hasActiveFilters,
  resetFilters,
} = useProductFilters(() => productsStore.products);

const handleAddToCart = useAddToCart();

usePageSeo(() => ({
  title: t("seo.home.title"),
  description: t("seo.home.description"),
}));
</script>

<template>
  <div class="space-y-20 sm:space-y-28">
    <ProductHero />
    <section
      id="catalog"
      class="scroll-mt-20"
      aria-labelledby="catalog-heading"
    >
      <div class="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <h2
            id="catalog-heading"
            class="text-[clamp(2.25rem,5vw,3.75rem)] font-extrabold leading-none tracking-heading"
          >
            {{ $t("products.listingTitle") }}
          </h2>
          <p class="mt-3 text-sm text-slate-600 dark:text-slate-400">
            {{ $t("products.listingDescription") }}
          </p>
        </div>
        <p
          v-if="!isPageLoading && !pageError"
          aria-live="polite"
          class="meta tabular-nums text-slate-500 dark:text-slate-400"
        >
          {{ $t("products.resultsCount", { count: filteredProducts.length }) }}
        </p>
      </div>
      <ProductFilterPanel
        :categories="productsStore.categories"
        :counts="productsStore.categoryCounts"
        :total="productsStore.total"
        :selected-category="selectedCategory"
        :sort-order="sortOrder"
        :search-query="searchQuery"
        :has-active-filters="hasActiveFilters"
        @update:category="selectedCategory = $event"
        @update:sort="sortOrder = $event"
        @update:search="searchQuery = $event"
        @refresh="resetFilters"
      />
      <ProductGrid
        :products="filteredProducts"
        :loading="isPageLoading"
        :error="pageError"
        :has-active-filters="hasActiveFilters"
        @add-to-cart="handleAddToCart"
        @reset="resetFilters"
        @retry="refresh()"
      />
    </section>
  </div>
</template>
