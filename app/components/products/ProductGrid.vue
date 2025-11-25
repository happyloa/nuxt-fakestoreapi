<script setup lang="ts">
import type { Product } from '~/types/fakestore'

const emit = defineEmits<{
  (e: 'add-to-cart', product: Product): void
}>()

const props = defineProps({
  products: {
    type: Array as () => Product[],
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
})

/**
 * 負責統整商品列表的不同顯示狀態：載入中、空狀態與實際資料。
 */
const handleAddToCart = (product: Product) => emit('add-to-cart', product)
</script>

<template>
  <section class="space-y-6" aria-labelledby="product-results-heading">
    <h2 id="product-results-heading" class="sr-only">{{ $t('products.listingTitle') }}</h2>
    <div
      v-if="loading"
      class="rounded-lg border border-dashed border-slate-200 p-4 dark:border-slate-700"
    >
      <!-- 載入中改用骨架畫面，避免使用者誤以為發生錯誤 -->
      <ProductGridSkeleton :count="6" />
    </div>
    <BaseAlert v-else-if="error" variant="error">
      {{ error }}
    </BaseAlert>
    <ProductEmptyState v-else-if="!products.length" />
    <ul
      v-else
      class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <li v-for="product in products" :key="product.id" class="h-full">
        <ProductCard :product="product" @add-to-cart="handleAddToCart" />
      </li>
    </ul>
  </section>
</template>
