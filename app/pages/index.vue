<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useProductFilters } from "~/composables/useProductFilters";
import { useCartStore } from "~/stores/cart";
import { useProductsStore } from "~/stores/products";
import { useNotificationsStore } from "~/stores/notifications";
import type { Product } from "#shared/types/fakestore";

const productsStore = useProductsStore();
const cartStore = useCartStore();
const { t } = useI18n();
const notifications = useNotificationsStore();

/**
 * 初始載入首頁所需的商品與分類資料，並透過 useAsyncData 綁定 SSR 快取，避免重複請求 (Double Fetching)
 */
const {
  pending: isPageLoading,
  error: asyncError,
  refresh,
} = await useAsyncData("homepageData", async () => {
  productsStore.error = "";
  const catalog =
    await $fetch<import("#shared/types/storefront").CatalogPayload>(
      "/api/catalog",
    );
  productsStore.products = catalog.products;
  productsStore.categories = catalog.categories;
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

/**
 * 將商品加入購物車並顯示提示訊息。
 */
const handleAddToCart = (product: Product) => {
  cartStore.addItem({
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image,
  });
  notifications.success(t("notifications.cartAdded", { title: product.title }));
};

usePageSeo(() => ({
  title: t("seo.home.title"),
  description: t("seo.home.description"),
}));
</script>

<template>
  <div class="space-y-12 sm:space-y-16">
    <ProductHero />
    <section
      id="catalog"
      class="scroll-mt-28 space-y-6"
      aria-labelledby="catalog-heading"
    >
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="catalog-heading"
            class="text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            {{ $t("products.listingTitle") }}
          </h2>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {{ $t("products.listingDescription") }}
          </p>
        </div>
        <p
          v-if="!isPageLoading && !pageError"
          aria-live="polite"
          class="text-sm text-slate-500 dark:text-slate-400"
        >
          {{ $t("products.resultsCount", { count: filteredProducts.length }) }}
        </p>
      </div>
      <ProductFilterPanel
        :categories="productsStore.categories"
        :selected-category="selectedCategory"
        :sort-order="sortOrder"
        :search-query="searchQuery"
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
    <ProductStats
      :total-products="productsStore.total"
      :average-price="productsStore.averagePrice"
      :categories-count="productsStore.categories.length"
    />
  </div>
</template>
