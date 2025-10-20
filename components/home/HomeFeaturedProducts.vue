<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '~/types/fakestore'

const props = defineProps<{
  products: Product[]
  pending: boolean
  error: boolean
  cartItemIds?: Set<number>
  recentlyAddedId?: number | null
}>()

const emit = defineEmits<{ (e: 'add', product: Product): void }>()

const { t } = useI18n()

const cartIds = computed(() => props.cartItemIds ?? new Set<number>())
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
      <div class="max-w-xl space-y-4">
        <h2 class="text-3xl font-bold text-slate-900">{{ t('home.featuredTitle') }}</h2>
        <p class="text-slate-600">{{ t('home.featuredSubtitle') }}</p>
      </div>
      <NuxtLink to="/products" class="link-button">
        {{ t('home.actions.browseProducts') }}
      </NuxtLink>
    </div>

    <div class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <ProductCard
        v-for="product in props.products"
        :key="product.id"
        :product="product"
        :in-cart="cartIds.has(product.id)"
        :recently-added="props.recentlyAddedId === product.id"
        show-description
        show-actions
        @add="emit('add', product)"
      />
      <div v-if="props.pending" class="card col-span-full flex items-center justify-center text-slate-500">
        {{ t('common.loading') }}
      </div>
      <div v-else-if="props.error" class="card col-span-full bg-red-50 text-sm text-red-600">
        {{ t('common.error') }}
      </div>
      <div v-else-if="!props.products.length && !props.pending" class="card col-span-full text-sm text-slate-500">
        {{ t('home.featuredEmpty') }}
      </div>
    </div>
  </section>
</template>
