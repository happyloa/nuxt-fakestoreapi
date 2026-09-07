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
const { pending: isPageLoading, error: asyncError, refresh } = await useAsyncData(
  "homepageData",
  async () => {
    productsStore.error = "";
    const catalog = await $fetch<import("#shared/types/storefront").CatalogPayload>("/api/catalog");
    productsStore.products = catalog.products;
    productsStore.categories = catalog.categories;
    return true;
  },
);

const pageError = computed(() => {
  if (asyncError.value)
    return t("errors.load");
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
  <section class="space-y-12" aria-labelledby="dashboard-hero">
    <ProductHero />

    <ProductStats
      :total-products="productsStore.total"
      :average-price="productsStore.averagePrice"
      :categories-count="productsStore.categories.length" />

    <div
      class="grid gap-8 lg:items-start lg:grid-cols-[minmax(0,1fr)_18rem]">
      <ProductGrid
        class="order-2 lg:order-1"
        :products="filteredProducts"
        :loading="isPageLoading"
        :error="pageError"
        :has-active-filters="hasActiveFilters"
        @add-to-cart="handleAddToCart"
        @reset="resetFilters"
        @retry="refresh()" />
      <ProductFilterPanel
        class="order-1 lg:order-2"
        :categories="productsStore.categories"
        :selected-category="selectedCategory"
        :sort-order="sortOrder"
        :search-query="searchQuery"
        @update:category="selectedCategory = $event"
        @update:sort="sortOrder = $event"
        @update:search="searchQuery = $event"
        @refresh="resetFilters" />
    </div>
  </section>
</template>
