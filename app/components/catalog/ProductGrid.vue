<script setup lang="ts">
import type { Product } from "~/types/storefront"

defineProps<{
  products: Product[]
  pending?: boolean
}>()

defineEmits<{ add: [product: Product] }>()
</script>

<template>
  <div v-if="pending" class="product-grid" aria-busy="true">
    <div v-for="index in 8" :key="index" class="product-skeleton" />
  </div>
  <div v-else class="product-grid">
    <CatalogProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
      @add="$emit('add', $event)" />
  </div>
</template>
