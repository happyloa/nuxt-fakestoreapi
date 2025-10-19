<script setup lang="ts">
import type { Product } from '~/types/fakestore'

const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{ (e: 'add-to-cart'): void }>()

const { t } = useI18n()
</script>

<template>
  <div class="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
    <div class="card">
      <div class="relative flex h-80 items-center justify-center overflow-hidden rounded-3xl bg-slate-100">
        <img :src="props.product.image" :alt="props.product.title" class="h-full w-full object-contain object-center" />
        <span class="absolute left-6 top-6 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold uppercase text-primary-700">
          {{ props.product.category }}
        </span>
      </div>
    </div>
    <div class="card space-y-6">
      <div class="space-y-2">
        <h1 class="text-3xl font-bold text-slate-900">{{ props.product.title }}</h1>
        <p class="text-sm font-semibold uppercase tracking-wide text-primary-600">{{ props.product.category }}</p>
      </div>
      <p class="text-base leading-relaxed text-slate-600">{{ props.product.description }}</p>
      <div class="flex flex-wrap items-center gap-4">
        <span class="text-3xl font-bold text-primary-700">${{ props.product.price.toFixed(2) }}</span>
        <span class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
          ⭐ {{ props.product.rating?.rate?.toFixed(1) ?? 'N/A' }}
          <span class="text-xs font-normal text-slate-400">({{ props.product.rating?.count ?? 0 }} {{ t('products.reviews') }})</span>
        </span>
      </div>
      <div class="flex flex-wrap gap-3">
        <button type="button" class="link-button text-base" @click="emit('add-to-cart')">
          {{ t('actions.addToCart') }}
        </button>
        <NuxtLink to="/cart" class="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
          {{ t('products.actions.viewCart') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
