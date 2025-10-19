<script setup lang="ts">
import type { Cart } from '~/types/fakestore'

const props = defineProps<{
  carts: Cart[]
}>()

const { t } = useI18n()
</script>

<template>
  <section>
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-slate-900">{{ t('userDetail.orders') }}</h2>
      <NuxtLink to="/cart" class="text-sm font-semibold text-primary-600 hover:text-primary-700">
        {{ t('userDetail.viewCart') }} →
      </NuxtLink>
    </div>
    <div v-if="!props.carts.length" class="card mt-4 text-sm text-slate-500">
      {{ t('userDetail.noOrders') }}
    </div>
    <div v-else class="mt-4 space-y-4">
      <article
        v-for="cart in props.carts"
        :key="cart.id"
        class="card space-y-3 text-sm text-slate-600"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="font-semibold text-slate-900">{{ t('userDetail.orderId', { id: cart.id }) }}</p>
          <p class="text-xs uppercase tracking-wide text-slate-400">{{ new Date(cart.date).toLocaleDateString() }}</p>
        </div>
        <ul class="space-y-2">
          <li
            v-for="product in cart.products"
            :key="product.productId"
            class="flex items-center justify-between"
          >
            <span>{{ t('userDetail.productLine', product) }}</span>
            <span class="font-semibold">× {{ product.quantity }}</span>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>
