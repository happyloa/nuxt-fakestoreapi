<script setup lang="ts">
import { ref } from 'vue'
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

const isPageLoading = ref(true)
const pageError = ref('')

/**
 * 初始載入首頁所需的商品與分類資料，確保狀態提示正確。
 */
const loadHomepageData = async () => {
  isPageLoading.value = true
  pageError.value = ''
  productsStore.error = ''
  try {
    // 以 allSettled 確認兩個請求都完成後再決定是否顯示錯誤，避免載入過程就提前跳出錯誤訊息
    const results = await Promise.allSettled([
      productsStore.fetchProducts(),
      productsStore.fetchCategories(),
    ])

    const rejected = results.find(
      (result) => result.status === 'rejected',
    ) as PromiseRejectedResult | undefined

    if (rejected) {
      pageError.value = rejected.reason?.message ?? t('api.errors.generic')
    } else if (productsStore.error) {
      pageError.value = productsStore.error
    }
  } catch (error: any) {
    pageError.value =
      error?.message ?? t('api.errors.generic')
  } finally {
    isPageLoading.value = false
  }
}

await loadHomepageData()

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
        :loading="isPageLoading"
        :error="pageError"
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
