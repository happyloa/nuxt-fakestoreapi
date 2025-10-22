<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter, useRoute } from '#imports'
import { useCartStore } from '~/stores/cart'
import { useProductsStore } from '~/stores/products'

const productsStore = useProductsStore()
const cartStore = useCartStore()
const route = useRoute()
const router = useRouter()

await Promise.all([productsStore.fetchProducts(), productsStore.fetchCategories()])

const selectedCategory = ref((route.query.category as string) ?? 'all')
const sortOrder = ref(((route.query.sort as string) ?? 'asc') === 'desc' ? 'desc' : 'asc')
const searchQuery = ref((route.query.q as string) ?? '')

const filteredProducts = computed(() => {
  let items = [...productsStore.products]
  if (selectedCategory.value !== 'all') {
    items = items.filter((product) => product.category === selectedCategory.value)
  }
  if (searchQuery.value) {
    const keyword = searchQuery.value.toLowerCase()
    items = items.filter((product) =>
      product.title.toLowerCase().includes(keyword) ||
      product.description.toLowerCase().includes(keyword),
    )
  }
  return items.sort((a, b) =>
    sortOrder.value === 'asc' ? a.id - b.id : b.id - a.id,
  )
})

const updateQuery = () => {
  router.replace({
    query: {
      category: selectedCategory.value !== 'all' ? selectedCategory.value : undefined,
      sort: sortOrder.value === 'desc' ? 'desc' : undefined,
      q: searchQuery.value ? searchQuery.value : undefined,
    },
  })
}

watch([selectedCategory, sortOrder, searchQuery], updateQuery)

const handleAddToCart = (product: (typeof productsStore.products)[number]) => {
  cartStore.addItem({
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image,
  })
}

const resetFilters = () => {
  selectedCategory.value = 'all'
  sortOrder.value = 'asc'
  searchQuery.value = ''
}

useSeoMeta({
  title: 'Fake Store Dashboard',
  description: 'Explore and manage Fake Store API products with filters, analytics and quick actions.',
  ogTitle: 'Fake Store Dashboard',
  ogDescription: 'Explore and manage Fake Store API products with filters, analytics and quick actions.',
})
</script>

<template>
  <div class="space-y-12">
    <ProductHero />

    <ProductStats
      :total-products="productsStore.total"
      :average-price="productsStore.averagePrice"
      :categories-count="productsStore.categories.length"
    />

    <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
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
  </div>
</template>
