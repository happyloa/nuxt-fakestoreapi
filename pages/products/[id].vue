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

    <div v-else>
      <ProductDetailView :product="product" @add-to-cart="addToCart" />
      <RelatedProductsSection
        :products="relatedProducts || []"
        @add-to-cart="cart.addItem"
      />
    </div>
  </section>
</template>
