<script setup lang="ts">
import type { Product } from '~/types/fakestore'

defineEmits<{
  (e: 'add-to-cart', product: Product): void
}>()

defineProps({
  products: {
    type: Array as () => Product[],
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="space-y-6">
    <div
      v-if="loading"
      class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <BaseCard v-for="index in 6" :key="index" class="animate-pulse space-y-4">
        <div class="h-48 rounded-xl bg-slate-200"></div>
        <div class="h-4 w-3/4 rounded bg-slate-200"></div>
        <div class="h-3 w-1/2 rounded bg-slate-100"></div>
        <div class="flex gap-2">
          <div class="h-6 w-16 rounded-full bg-slate-200"></div>
          <div class="h-6 w-20 rounded-full bg-slate-200"></div>
        </div>
      </BaseCard>
    </div>
    <BaseAlert v-else-if="error" variant="error">
      {{ error }}
    </BaseAlert>
    <div v-else-if="!products.length" class="rounded-2xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center">
      <h3 class="text-lg font-semibold text-slate-800">
        {{ $t('products.empty.title') }}
      </h3>
      <p class="mt-2 text-sm text-slate-600">
        {{ $t('products.empty.description') }}
      </p>
      <BaseButton as="NuxtLink" to="/products/new" class="mt-6">
        {{ $t('products.empty.cta') }}
      </BaseButton>
    </div>
    <div
      v-else
      class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <BaseCard
        v-for="product in products"
        :key="product.id"
        class="flex h-full flex-col space-y-4"
      >
        <NuxtLink :to="`/product/${product.id}`" class="flex flex-col space-y-3">
          <div class="relative overflow-hidden rounded-2xl bg-slate-100">
            <img :src="product.image" :alt="product.title" class="mx-auto h-48 w-auto object-contain" />
          </div>
          <div>
            <p class="text-xs uppercase tracking-wider text-slate-500">
              {{ product.category }}
            </p>
            <h3 class="mt-2 line-clamp-2 text-lg font-semibold text-slate-900">
              {{ product.title }}
            </h3>
          </div>
        </NuxtLink>
        <div class="flex items-center justify-between text-sm text-slate-600">
          <BaseBadge variant="brand">${{ product.price.toFixed(2) }}</BaseBadge>
          <div class="flex items-center gap-1 text-xs font-medium">
            <svg
              class="h-4 w-4 text-amber-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
            <span>{{ product.rating.rate }} ({{ product.rating.count }})</span>
          </div>
        </div>
        <BaseButton
          class="mt-auto"
          block
          @click="$emit('add-to-cart', product)"
        >
          {{ $t('products.actions.addToCart') }}
        </BaseButton>
      </BaseCard>
    </div>
  </div>
</template>
