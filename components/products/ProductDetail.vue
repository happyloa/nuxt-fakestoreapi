<script setup lang="ts">
import type { Product } from '~/types/fakestore'

defineEmits<{
  (e: 'add-to-cart', product: Product): void
}>()

defineProps({
  product: {
    type: Object as () => Product | null,
    default: null,
  },
})
</script>

<template>
  <BaseCard v-if="product" class="grid gap-8 md:grid-cols-[1.2fr_1fr]">
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <BaseBadge variant="brand">{{ product.category }}</BaseBadge>
        <BaseBadge variant="accent">{{ $t('products.details.rating', { rate: product.rating.rate }) }}</BaseBadge>
        <span class="text-xs text-slate-500">
          {{ $t('products.details.reviews', { count: product.rating.count }) }}
        </span>
      </div>
      <h1 class="text-3xl font-bold text-slate-900 sm:text-4xl">{{ product.title }}</h1>
      <p class="text-lg text-slate-600">{{ product.description }}</p>
      <div class="flex items-center gap-6">
        <span class="text-3xl font-semibold text-brand">${{ product.price.toFixed(2) }}</span>
        <BaseButton @click="$emit('add-to-cart', product)">
          {{ $t('products.actions.addToCart') }}
        </BaseButton>
      </div>
    </div>
    <div class="flex flex-col items-center justify-center">
      <div class="overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-100 to-brand/20 p-6">
        <img :src="product.image" :alt="product.title" class="mx-auto h-72 w-auto object-contain" />
      </div>
    </div>
  </BaseCard>
  <BaseAlert v-else variant="warning">
    {{ $t('products.details.missing') }}
  </BaseAlert>
</template>
