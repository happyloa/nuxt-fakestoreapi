<script setup lang="ts">
import type { Product } from '~/types/fakestore'
import { useFakeStoreClient } from '~/composables/useFakeStoreClient'
import { useCartStore } from '~/stores/cart'

const client = useFakeStoreClient()
const cart = useCartStore()
const { t } = useI18n()
const route = useRoute()

const productId = computed(() => Number(route.params.id))

const { data: product, pending, error } = await useAsyncData<Product>(
  `product-${productId.value}`,
  () => client.getProduct(productId.value),
  { watch: [productId] },
)

const { data: relatedProducts } = await useAsyncData<Product[]>(
  `related-${productId.value}`,
  async () => {
    if (!product.value) return []
    const results = await client.listProducts({ category: product.value.category })
    return results.filter((item) => item.id !== product.value?.id).slice(0, 4)
  },
  { watch: [product] },
)

const addToCart = () => {
  if (!product.value) return
  cart.addItem(product.value)
}
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
    <div v-if="pending" class="card flex min-h-[240px] items-center justify-center text-slate-500">
      {{ t('common.loading') }}
    </div>
    <div v-else-if="error || !product" class="card min-h-[240px] text-sm text-red-600">
      {{ t('common.error') }}
    </div>

    <div v-else class="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div class="card">
        <div class="relative flex h-80 items-center justify-center overflow-hidden rounded-3xl bg-slate-100">
          <img :src="product.image" :alt="product.title" class="h-full w-full object-contain object-center" />
          <span class="absolute left-6 top-6 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold uppercase text-primary-700">
            {{ product.category }}
          </span>
        </div>
      </div>
      <div class="card space-y-6">
        <div class="space-y-2">
          <h1 class="text-3xl font-bold text-slate-900">{{ product.title }}</h1>
          <p class="text-sm font-semibold uppercase tracking-wide text-primary-600">{{ product.category }}</p>
        </div>
        <p class="text-base leading-relaxed text-slate-600">{{ product.description }}</p>
        <div class="flex flex-wrap items-center gap-4">
          <span class="text-3xl font-bold text-primary-700">${{ product.price.toFixed(2) }}</span>
          <span class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
            ⭐ {{ product.rating?.rate?.toFixed(1) ?? 'N/A' }}
            <span class="text-xs font-normal text-slate-400">({{ product.rating?.count ?? 0 }} {{ t('products.reviews') }})</span>
          </span>
        </div>
        <div class="flex flex-wrap gap-3">
          <button type="button" class="link-button text-base" @click="addToCart">
            {{ t('actions.addToCart') }}
          </button>
          <NuxtLink to="/cart" class="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
            {{ t('products.actions.viewCart') }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <section v-if="relatedProducts?.length" class="mt-16 space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-slate-900">{{ t('products.related') }}</h2>
        <NuxtLink to="/products" class="text-sm font-semibold text-primary-600 hover:text-primary-700">
          {{ t('products.actions.viewAll') }}
        </NuxtLink>
      </div>
      <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ProductCard
          v-for="item in relatedProducts"
          :key="item.id"
          :product="item"
          show-actions
          @add="cart.addItem"
        />
      </div>
    </section>
  </section>
</template>
