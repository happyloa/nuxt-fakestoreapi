<script setup lang="ts">
import type { Product } from '~/types/fakestore'

const props = defineProps<{
  products: Product[]
}>()

const emit = defineEmits<{ (e: 'add-to-cart', product: Product): void }>()

const { t } = useI18n()
</script>

<template>
  <section v-if="props.products.length" class="mt-16 space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-slate-900">{{ t('products.related') }}</h2>
      <NuxtLink to="/products" class="text-sm font-semibold text-primary-600 hover:text-primary-700">
        {{ t('products.actions.viewAll') }}
      </NuxtLink>
    </div>
    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <ProductCard
        v-for="item in props.products"
        :key="item.id"
        :product="item"
        show-actions
        @add="emit('add-to-cart', item)"
      />
    </div>
  </section>
</template>
