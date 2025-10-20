<script setup lang="ts">
import { useFakeStoreApi } from "~/composables/useFakeStoreApi";

useSeoMeta({
  title: "Create Product | Nuxt Fake Store",
  ogTitle: "Create Product | Nuxt Fake Store",
  description: "Create new items and send them to the Fake Store API.",
  ogDescription: "Create new items and send them to the Fake Store API.",
});

const api = useFakeStoreApi();
const { data: categories, pending } = await useAsyncData<string[]>(
  "products:create:categories",
  () => api.listCategories(),
);

const router = useRouter();

const handleCreated = (productId: number) => {
  setTimeout(() => {
    router.push(`/products/${productId}`);
  }, 600);
};
</script>

<template>
  <div class="space-y-6">
    <NuxtLink to="/products" class="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
      ← {{ $t("products.details.back") }}
    </NuxtLink>

    <div v-if="pending" class="card-surface h-80 animate-pulse bg-slate-900/40"></div>
    <ProductForm v-else :categories="categories ?? []" @created="handleCreated" />
  </div>
</template>
