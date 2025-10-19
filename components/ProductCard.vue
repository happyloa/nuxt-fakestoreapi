<script setup lang="ts">
import { toRefs } from 'vue'
import type { Product } from '~/types/fakestore'

const props = defineProps<{
  product: Product
  showDescription?: boolean
  showActions?: boolean
}>()

const { product, showDescription, showActions } = toRefs(props)

const emit = defineEmits<{
  add: [product: Product]
}>()

const onAdd = () => {
  emit('add', product.value)
}

const truncate = (text: string, length = 80) => {
  if (text.length <= length) return text
  return `${text.slice(0, length)}…`
}
</script>

<template>
  <article class="card flex h-full flex-col gap-4">
    <div class="relative flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
      <img :src="product.image" :alt="product.title" class="h-full w-full object-contain object-center transition duration-300 hover:scale-105" loading="lazy" />
      <span class="absolute left-4 top-4 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
        {{ product.category }}
      </span>
    </div>

    <div class="flex flex-1 flex-col gap-3">
      <h3 class="text-lg font-semibold text-slate-900">{{ product.title }}</h3>
      <p v-if="showDescription" class="line-clamp-3 text-sm text-slate-600">{{ truncate(product.description, 140) }}</p>
      <div class="flex items-center justify-between text-sm text-slate-500">
        <span class="text-lg font-bold text-primary-700">${{ product.price.toFixed(2) }}</span>
        <span class="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          ⭐ {{ product.rating?.rate?.toFixed(1) ?? 'N/A' }}
          <span class="font-normal text-slate-400">({{ product.rating?.count ?? 0 }})</span>
        </span>
      </div>
    </div>

    <div v-if="showActions" class="flex flex-wrap gap-2">
      <NuxtLink :to="`/products/${product.id}`" class="link-button flex-1 justify-center">
        {{ $t('actions.viewDetail') }}
      </NuxtLink>
      <button
        type="button"
        class="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
        @click="onAdd"
      >
        {{ $t('actions.addToCart') }}
      </button>
    </div>
  </article>
</template>
