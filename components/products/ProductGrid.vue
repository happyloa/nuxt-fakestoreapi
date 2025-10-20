<script setup lang="ts">
import type { Product } from "~/types/fakestore";

const props = defineProps<{
  products: Product[] | null | undefined;
  loading?: boolean;
}>();
</script>

<template>
  <div>
    <div v-if="props.loading" class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="index in 6"
        :key="index"
        class="card-surface h-64 animate-pulse bg-slate-900/40"
      ></div>
    </div>
    <div v-else-if="props.products?.length" class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      <ProductCard v-for="product in props.products" :key="product.id" :product="product" />
    </div>
    <slot v-else name="empty">
      <p class="text-center text-slate-400">
        {{ $t("products.empty") }}
      </p>
    </slot>
  </div>
</template>
