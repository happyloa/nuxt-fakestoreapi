<script setup lang="ts">
import type { Product } from '~/types/fakestore'

const props = defineProps<{
  products: Product[]
  pending: boolean
  error: boolean
  empty: boolean
  cartItemIds: Set<number>
  recentlyAddedId: number | null
}>()

const emit = defineEmits<{ (e: 'add', product: Product): void }>()

const { t } = useI18n()

const isInCart = (productId: number) => props.cartItemIds.has(productId)
</script>

<template>
  <div class="space-y-6">
    <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      <ProductCard
        v-for="product in props.products"
        :key="product.id"
        :product="product"
        :in-cart="isInCart(product.id)"
        :recently-added="props.recentlyAddedId === product.id"
        show-description
        show-actions
        @add="emit('add', product)"
      />
    </div>

    <div v-if="props.pending" class="card flex items-center justify-center text-slate-500">
      {{ t('common.loading') }}
    </div>
    <div v-else-if="props.error" class="card bg-red-50 text-sm text-red-600">
      {{ t('common.error') }}
    </div>
    <div v-else-if="props.empty" class="card text-sm text-slate-500">
      {{ t('products.empty') }}
    </div>
  </div>
</template>
