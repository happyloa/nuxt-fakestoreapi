<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import type { Product } from '~/types/fakestore'
import { useFakeStoreClient } from '~/composables/useFakeStoreClient'
import { useCartStore } from '~/stores/cart'

const client = useFakeStoreClient()
const cart = useCartStore()

const { data: featuredProducts, pending, error } = await useAsyncData<Product[]>(
  'featured-products',
  () => client.listProducts({ limit: 4 }),
)

const cartItemIds = computed(() => new Set(cart.items.map((item) => item.id)))
const recentlyAddedId = ref<number | null>(null)

let resetTimer: ReturnType<typeof setTimeout> | null = null

const clearTimer = () => {
  if (resetTimer) {
    clearTimeout(resetTimer)
    resetTimer = null
  }
}

const onAddToCart = (product: Product) => {
  cart.addItem(product)
  recentlyAddedId.value = product.id
  clearTimer()
  resetTimer = setTimeout(() => {
    if (recentlyAddedId.value === product.id) {
      recentlyAddedId.value = null
    }
    resetTimer = null
  }, 2400)
}

onBeforeUnmount(() => {
  clearTimer()
})
</script>

<template>
  <HomeHero />
  <HomeFeaturedProducts
    :products="featuredProducts || []"
    :pending="pending"
    :error="!!error"
    :cart-item-ids="cartItemIds"
    :recently-added-id="recentlyAddedId"
    @add="onAddToCart"
  />
  <HomeHighlights />
</template>
