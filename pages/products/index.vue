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

const isInCart = (productId: number) => cart.items.some((item) => item.id === productId)

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
    <header class="flex flex-col gap-6 border-b border-slate-200 pb-8 md:flex-row md:items-center md:justify-between">
      <div class="space-y-2">
        <p class="text-sm font-semibold uppercase tracking-wide text-primary-600">{{ t('products.badge') }}</p>
        <h1 class="text-3xl font-bold text-slate-900">{{ t('products.title') }}</h1>
        <p class="text-slate-600">{{ t('products.subtitle') }}</p>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink to="/products/new" class="link-button">
          {{ t('home.actions.createProduct') }}
        </NuxtLink>
        <button
          type="button"
          class="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          @click="resetFilters"
        >
          {{ t('actions.reset') }}
        </button>
      </div>
    </header>

    <Transition name="fade">
      <div
        v-if="feedbackVisible"
        class="mt-6 rounded-3xl border border-primary-200 bg-primary-50 px-6 py-4 text-sm font-semibold text-primary-700 shadow-sm"
        role="status"
        aria-live="assertive"
      >
        {{ feedbackMessage }}
      </div>
    </Transition>

    <div class="mt-8 grid gap-4 md:grid-cols-[280px_minmax(0,1fr)]">
      <aside class="space-y-6 rounded-3xl border border-slate-200 bg-white p-6">
        <div class="space-y-3">
          <label for="search" class="block text-sm font-semibold text-slate-700">{{ t('products.filters.search') }}</label>
          <input
            id="search"
            v-model="search"
            type="search"
            class="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
            :placeholder="t('products.filters.searchPlaceholder')"
          />
        </div>

        <div class="space-y-3">
          <p class="text-sm font-semibold text-slate-700">{{ t('products.filters.category') }}</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="option in categoryOptions"
              :key="option"
              type="button"
              class="rounded-full px-4 py-2 text-sm font-semibold capitalize transition"
              :class="[
                category === option
                  ? 'bg-primary-600 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
              ]"
              @click="category = option"
            >
              {{ option === 'all' ? t('products.filters.all') : option }}
            </button>
          </div>
        </div>

        <div class="space-y-3">
          <label class="block text-sm font-semibold text-slate-700">{{ t('products.filters.sort') }}</label>
          <select
            v-model="sort"
            class="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            <option value="asc">{{ t('products.filters.sortAsc') }}</option>
            <option value="desc">{{ t('products.filters.sortDesc') }}</option>
          </select>
        </div>
      </aside>

      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <p class="text-sm text-slate-500">
            {{ t('products.resultCount', { count: filteredProducts.length }) }}
          </p>
          <NuxtLink to="/cart" class="text-sm font-semibold text-primary-600 hover:text-primary-700">
            {{ t('products.actions.viewCart') }} →
          </NuxtLink>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            :in-cart="isInCart(product.id)"
            :recently-added="recentlyAddedId === product.id"
            show-description
            show-actions
            @add="onAddToCart"
          />
        </div>

        <div v-if="pending" class="card flex items-center justify-center text-slate-500">
          {{ t('common.loading') }}
        </div>
        <div v-if="error" class="card bg-red-50 text-sm text-red-600">
          {{ t('common.error') }}
        </div>
        <div v-if="!pending && !filteredProducts.length" class="card text-sm text-slate-500">
          {{ t('products.empty') }}
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
