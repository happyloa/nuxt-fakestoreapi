<script setup lang="ts">
import { useRoute } from "#imports";
import { useI18n } from "vue-i18n";
import type { Product } from "~/types/fakestore";
import { useCartStore } from "~/stores/cart";
import { useProductsStore } from "~/stores/products";
import { useNotificationsStore } from "~/stores/notifications";

const route = useRoute();
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
    useSeoMeta({
      title: `${product.value?.title ?? "Product"} | Fake Store Dashboard`,
      description: product.value?.description ?? "Fake Store product details",
      ogTitle: `${product.value?.title ?? "Product"} | Fake Store Dashboard`,
      ogDescription: product.value?.description ?? "Fake Store product details",
    });
  } catch (error: any) {
    errorMessage.value = error?.message ?? "Unable to load product details.";
  } finally {
    pending.value = false;
  }
};

await loadProduct();

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
  <div class="space-y-6">
    <NuxtLink
      to="/"
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
      <BaseCard class="h-64 animate-pulse bg-slate-100" />
      <BaseCard class="h-64 animate-pulse bg-slate-100" />
    </div>

    <BaseAlert v-else-if="errorMessage" variant="error">
      {{ errorMessage }}
    </BaseAlert>

    <ProductDetail v-else :product="product" @add-to-cart="addToCart" />
  </div>
</template>
