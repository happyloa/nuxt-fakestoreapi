<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useProductFilters } from "~/composables/useProductFilters";
import { useCartStore } from "~/stores/cart";
import { useProductsStore } from "~/stores/products";
import { useNotificationsStore } from "~/stores/notifications";
import type { Product } from "~/types/fakestore";

const productsStore = useProductsStore();
const cartStore = useCartStore();
const { t } = useI18n();
const notifications = useNotificationsStore();

/**
 * 初始載入首頁所需的商品與分類資料，並透過 useAsyncData 綁定 SSR 快取，避免重複請求 (Double Fetching)
 */
const { pending: isPageLoading, error: asyncError } = await useAsyncData(
  "homepageData",
  async () => {
    productsStore.error = "";
    // 以 allSettled 確認兩個請求都完成後再決定是否拋出錯誤
    const results = await Promise.allSettled([
      productsStore.fetchProducts(),
      productsStore.fetchCategories(),
    ]);

    const rejected = results.find((result) => result.status === "rejected") as
      | PromiseRejectedResult
      | undefined;

    if (rejected) {
      throw new Error(rejected.reason?.message || "Failed to load data");
    } else if (productsStore.error) {
      throw new Error(productsStore.error);
    }
    return true;
  },
);

const pageError = computed(() => {
  if (asyncError.value)
    return asyncError.value.message || t("api.errors.generic");
  return "";
});

const {
  selectedCategory,
  sortOrder,
  searchQuery,
  filteredProducts,
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

useHead(() => ({
  title: t("seo.home.title"),
  meta: [
    { name: "description", content: t("seo.home.description") },
    { property: "og:title", content: t("seo.home.title") },
    { property: "og:description", content: t("seo.home.description") },
  ],
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
      class="grid gap-8 lg:items-start lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,2.25fr)_minmax(0,1fr)]">
      <ProductGrid
        :products="filteredProducts"
        :loading="isPageLoading"
        :error="pageError"
        @add-to-cart="handleAddToCart" />
      <ProductFilterPanel
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
