<script setup lang="ts">
import type { Product } from '~/types/fakestore'
import { useFakeStoreClient } from '~/composables/useFakeStoreClient'
import { useCartStore } from '~/stores/cart'

const client = useFakeStoreClient()
const cart = useCartStore()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const search = ref((route.query.q as string) || '')
const category = ref((route.query.category as string) || 'all')
const sort = ref(((route.query.sort as string) || 'asc') as 'asc' | 'desc')

const { data: categories } = await useAsyncData('categories', () => client.getCategories())

const categoryOptions = computed(() => ['all', ...(categories.value ?? [])])

const { data: products, pending, error } = await useAsyncData<Product[]>(
  'products',
  () =>
    client.listProducts({
      category: category.value === 'all' ? undefined : category.value,
      sort: sort.value,
    }),
  { watch: [category, sort] },
)

const filteredProducts = computed(() => {
  if (!products.value) return []
  const query = search.value.trim().toLowerCase()
  if (!query) return products.value
  return products.value.filter((product) => product.title.toLowerCase().includes(query))
})

watch([search, category, sort], () => {
  router.replace({
    query: {
      ...(search.value ? { q: search.value } : {}),
      ...(category.value !== 'all' ? { category: category.value } : {}),
      ...(sort.value !== 'asc' ? { sort: sort.value } : {}),
    },
  })
})

const resetFilters = () => {
  search.value = ''
  category.value = 'all'
  sort.value = 'asc'
}

const feedbackMessage = ref('')
const feedbackVisible = ref(false)
const recentlyAddedId = ref<number | null>(null)
const cartItemIds = computed(() => new Set(cart.items.map((item) => item.id)))

const onAddToCart = (product: Product) => {
  cart.addItem(product)
  feedbackMessage.value = t('products.toast.added', { title: product.title })
  feedbackVisible.value = true
  recentlyAddedId.value = product.id
  setTimeout(() => {
    feedbackVisible.value = false
    if (recentlyAddedId.value === product.id) {
      recentlyAddedId.value = null
    }
  }, 2400)
}
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
    <ProductsHeader @reset="resetFilters" />

    <ProductsFeedback :visible="feedbackVisible" :message="feedbackMessage" />

    <div class="mt-8 grid gap-4 md:grid-cols-[280px_minmax(0,1fr)]">
      <ProductsFilters
        :search="search"
        :category="category"
        :sort="sort"
        :categories="categoryOptions"
        @update:search="search = $event"
        @update:category="category = $event"
        @update:sort="sort = $event"
      />

      <div class="space-y-6">
        <ProductsResultsHeader :count="filteredProducts.length" />
        <ProductsGrid
          :products="filteredProducts"
          :pending="pending"
          :error="!!error"
          :empty="!pending && !filteredProducts.length"
          :cart-item-ids="cartItemIds"
          :recently-added-id="recentlyAddedId"
          @add="onAddToCart"
        />
      </div>
    </div>
  </section>
</template>
