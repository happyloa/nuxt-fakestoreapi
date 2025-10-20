<script setup lang="ts">
import { useFakeStoreApi } from "~/composables/useFakeStoreApi";
import type { Product } from "~/types/fakestore";

const route = useRoute();
const api = useFakeStoreApi();

const { data: product, pending, error } = await useAsyncData<Product>(
  `product:${route.params.id}`,
  () => api.getProduct(route.params.id as string),
);

watchEffect(() => {
  if (product.value) {
    useSeoMeta({
      title: `${product.value.title} | Nuxt Fake Store`,
      ogTitle: `${product.value.title} | Nuxt Fake Store`,
      description: product.value.description,
      ogDescription: product.value.description,
    });
  }
});
</script>

<template>
  <div class="space-y-10">
    <NuxtLink to="/products" class="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
      ← {{ $t("products.details.back") }}
    </NuxtLink>

    <div v-if="pending" class="card-surface h-96 animate-pulse bg-slate-900/40"></div>
    <ProductSummary v-else-if="product" :product="product" />
    <p v-else class="text-slate-400">
      {{ error?.message || $t("products.details.notFound") }}
    </p>
  </div>
</template>
