<script setup lang="ts">
import type { Product } from '~/types/fakestore'
import { useFakeStoreClient } from '~/composables/useFakeStoreClient'

const client = useFakeStoreClient()

const { data: featuredProducts, pending, error } = await useAsyncData<Product[]>(
  'featured-products',
  () => client.listProducts({ limit: 4 }),
)
</script>

<template>
  <HomeHero />
  <HomeFeaturedProducts :products="featuredProducts || []" :pending="pending" :error="!!error" />
  <HomeHighlights />
</template>
