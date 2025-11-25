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
      <div class="flex items-center gap-3 text-slate-500 dark:text-slate-300">
        <BaseBadge variant="brand">{{ product.category }}</BaseBadge>
        <BaseBadge variant="accent">{{ $t('products.details.rating', { rate: product.rating.rate }) }}</BaseBadge>
        <span class="text-xs">
          {{ $t('products.details.reviews', { count: product.rating.count }) }}
        </span>
      </div>
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">{{ product.title }}</h1>
      <p class="text-lg text-slate-600 dark:text-slate-300">{{ product.description }}</p>
      <div class="flex items-center gap-6">
        <span class="text-3xl font-semibold text-brand dark:text-brand-light">${{ product.price.toFixed(2) }}</span>
        <BaseButton @click="$emit('add-to-cart', product)">
          {{ $t('products.actions.addToCart') }}
        </BaseButton>
      </div>
    </div>
    <div class="flex flex-col items-center justify-center">
      <!-- 以漸層包裹商品圖片，讓新版品牌色有更明顯的層次與對比 -->
      <div class="overflow-hidden rounded-3xl bg-gradient-to-br from-brand/10 via-white to-accent/15 p-6 transition-colors duration-200 dark:from-slate-900 dark:via-brand/20 dark:to-accent/25">
        <img :src="product.image" :alt="product.title" class="mx-auto h-72 w-auto object-contain" />
      </div>
    </div>
  </BaseCard>
  <BaseAlert v-else variant="warning">
    {{ $t('products.details.missing') }}
  </BaseAlert>
</template>
