<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { Product } from "~/types/fakestore";
import { useCartStore } from "~/stores/cart";
import { useProductsStore } from "~/stores/products";
import { useNotificationsStore } from "~/stores/notifications";

const route = useRoute();
const localePath = useLocalePath();
const productsStore = useProductsStore();
const cartStore = useCartStore();
const notifications = useNotificationsStore();
const { t } = useI18n();

const product = ref<Product | null>(null);
const pending = ref(true);
const errorMessage = ref("");

/**
 * 動態載入商品細節並更新 SEO 資訊，保持作品的完整度。
 */
const loadProduct = async () => {
  const id = Number(route.params.id);
  pending.value = true;
  errorMessage.value = "";
  try {
    product.value = await productsStore.fetchProductById(id);
  } catch (error) {
    errorMessage.value = toErrorMessage(
      error,
      t("products.details.loadError"),
    );
  } finally {
    pending.value = false;
  }
};

await loadProduct();

usePageSeo(() => ({
  title: t("seo.productDetail.title", {
    name: product.value?.title ?? "Product",
  }),
  description:
    product.value?.description ?? t("seo.productDetail.description"),
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
        }),
      },
    ],
  };
});

const addToCart = () => {
  if (!product.value) {
    return;
  }
  cartStore.addItem({
    id: product.value.id,
    title: product.value.title,
    price: product.value.price,
    image: product.value.image,
  });
  notifications.success(
    t("notifications.cartAdded", { title: product.value.title }),
  );
};
</script>

<template>
  <div class="space-y-6" data-aos="fade-up">
    <NuxtLink
      :to="localePath('/')"
      class="inline-flex items-center gap-2 text-sm font-medium text-brand">
      <svg
        class="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M15 19l-7-7 7-7" />
      </svg>
      {{ $t("products.details.back") }}
    </NuxtLink>

    <div v-if="pending" class="grid gap-8 md:grid-cols-[1.2fr_1fr]">
      <BaseCard class="h-64 animate-pulse bg-slate-100 dark:bg-slate-800" />
      <BaseCard class="h-64 animate-pulse bg-slate-100 dark:bg-slate-800" />
    </div>

    <BaseAlert v-else-if="errorMessage" variant="error">
      {{ errorMessage }}
    </BaseAlert>

    <ProductDetail
      v-else-if="product"
      :product="product"
      @add-to-cart="addToCart" />
  </div>
</template>
