<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useProductFilters } from '~/composables/useProductFilters'
import { useCartStore } from '~/stores/cart'
import { useProductsStore } from '~/stores/products'
import { useNotificationsStore } from '~/stores/notifications'
import type { Product } from '~/types/fakestore'

const productsStore = useProductsStore()
const cartStore = useCartStore()
const { t } = useI18n()
const notifications = useNotificationsStore()

await Promise.all([productsStore.fetchProducts(), productsStore.fetchCategories()])

const {
  selectedCategory,
  sortOrder,
  searchQuery,
  filteredProducts,
  resetFilters,
} = useProductFilters(() => productsStore.products)

/**
 * 將商品加入購物車並顯示提示訊息。
 */
const handleAddToCart = (product: Product) => {
  cartStore.addItem({
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image,
  })
  notifications.success(
    t('notifications.cartAdded', { title: product.title }),
  )
}

useSeoMeta({
  title: 'Fake Store Dashboard',
  description: 'Explore and manage Fake Store API products with filters, analytics and quick actions.',
  ogTitle: 'Fake Store Dashboard',
  ogDescription: 'Explore and manage Fake Store API products with filters, analytics and quick actions.',
})
</script>

<template>
  <section class="space-y-12" aria-labelledby="dashboard-hero">
    <ProductHero />

    <ProductStats
      :total-products="productsStore.total"
      :average-price="productsStore.averagePrice"
      :categories-count="productsStore.categories.length"
    />

    <div class="grid gap-8 lg:items-start lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,2.25fr)_minmax(0,1fr)]">
      <ProductGrid
        :products="filteredProducts"
        :loading="productsStore.loading"
        :error="productsStore.error"
        @add-to-cart="handleAddToCart"
      />
      <ProductFilterPanel
        :categories="productsStore.categories"
        :selected-category="selectedCategory"
        :sort-order="sortOrder"
        :search-query="searchQuery"
        @update:category="selectedCategory = $event"
        @update:sort="sortOrder = $event"
        @update:search="searchQuery = $event"
        @refresh="resetFilters"
      />
    </div>
  </section>
</template>
