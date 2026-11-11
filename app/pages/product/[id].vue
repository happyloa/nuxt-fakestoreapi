<script setup lang="ts">
import type { Product } from "#shared/types/fakestore";
import { useProductsStore } from "~/stores/products";

const route = useRoute();
const localePath = useLocalePath();
const productsStore = useProductsStore();
const { t } = useI18n();

definePageMeta({
  validate: (route) => /^[1-9]\d{0,5}$/.test(String(route.params.id)),
});
const {
  data: product,
  pending,
  error,
  refresh,
} = await useAsyncData(
  () => `product-${route.params.id}`,
  () => $fetch<Product>(`/api/products/${route.params.id}`),
  {
    // 從首頁點進來時沿用目錄裡已有的完整商品資料，不必再等一次 API；
    // 手動重試（refresh）仍會重新請求。
    getCachedData: (key, nuxtApp, ctx) =>
      nuxtApp.isHydrating
        ? nuxtApp.payload.data[key]
        : ctx.cause === "initial"
          ? productsStore.products.find(
              (item) => item.id === Number(route.params.id),
            )
          : undefined,
  },
);
// SSR 一律渲染錯誤頁；用戶端導覽需 fatal 才會切到 error.vue。
// 伺服器端不標 fatal，避免 Nitro 為每個不存在的商品記錄錯誤堆疊。
if (error.value?.statusCode === 404)
  throw createError({
    statusCode: 404,
    statusMessage: "Product not found",
    fatal: import.meta.client,
  });
const errorMessage = computed(() => {
  if (!error.value) return "";
  return error.value.statusCode === 502
    ? t("products.details.upstreamUnavailable")
    : t("products.details.loadError");
});

usePageSeo(() => ({
  title: t("seo.productDetail.title", {
    name: product.value?.title ?? t("products.details.fallbackName"),
  }),
  description: product.value?.description ?? t("seo.productDetail.description"),
  image: product.value?.image,
  type: "product",
}));

// 商品結構化資料 (JSON-LD)，提升搜尋結果的 Rich Snippet（價格、評分星等）
useHead(() => {
  const p = product.value;
  if (!p) return {};
  return {
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.title,
          image: p.image,
          description: p.description,
          category: p.category,
          offers: {
            "@type": "Offer",
            price: p.price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
          ...(p.rating
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: p.rating.rate,
                  reviewCount: p.rating.count,
                },
              }
            : {}),
        }).replace(/</g, "\\u003c"),
      },
    ],
  };
});

const addToCart = useAddToCart();
</script>

<template>
  <div class="space-y-6">
    <NuxtLink
      :to="localePath('/')"
      class="inline-flex items-center gap-2 text-sm font-medium text-brand"
    >
      <SiteIcon name="back" class="h-4 w-4" />
      {{ $t("products.details.back") }}
    </NuxtLink>

    <div v-if="pending" class="grid gap-8 md:grid-cols-[1.2fr_1fr]">
      <BaseCard class="h-64 animate-pulse bg-slate-100 dark:bg-slate-800" />
      <BaseCard class="h-64 animate-pulse bg-slate-100 dark:bg-slate-800" />
    </div>

    <BaseAlert v-else-if="errorMessage" variant="error">
      {{ errorMessage }}
      <BaseButton variant="outline" @click="refresh()">{{
        $t("ui.retry")
      }}</BaseButton>
    </BaseAlert>

    <ProductDetail
      v-else-if="product"
      :product="product"
      @add-to-cart="addToCart"
    />
  </div>
</template>
