<script setup lang="ts">
// A line item owns only its quantity and removal actions.
import type { CartItem } from "~/types/storefront"

defineProps<{ line: CartItem }>()
const emit = defineEmits<{
  decrease: [productId: number]
  increase: [productId: number]
  remove: [productId: number]
}>()
</script>

<template>
  <li class="cart-line">
    <NuxtImg
      :src="line.product.image"
      :alt="line.product.title"
      width="112"
      height="112"
      sizes="112px"
      format="webp"
      class="cart-line__image" />
    <div class="min-w-0 flex-1">
      <h2 class="text-base font-semibold leading-6 text-slate-950 dark:text-white">
        {{ line.product.title }}
      </h2>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
        {{ $n(line.product.price, "currency") }}
      </p>
      <button
        class="btn-quiet mt-3 -ml-2"
        type="button"
        :aria-label="$t('cart.remove', { title: line.product.title })"
        @click="emit('remove', line.product.id)">
        {{ $t("common.remove") }}
      </button>
    </div>
    <div class="flex flex-col items-end gap-4">
      <div class="quantity-control" :aria-label="$t('common.quantity')">
        <button
          type="button"
          :aria-label="$t('cart.decrease', { title: line.product.title })"
          @click="emit('decrease', line.product.id)">
          −
        </button>
        <output>{{ line.quantity }}</output>
        <button
          type="button"
          :aria-label="$t('cart.increase', { title: line.product.title })"
          @click="emit('increase', line.product.id)">
          +
        </button>
      </div>
      <p class="text-sm font-semibold text-slate-950 dark:text-white">
        {{ $n(line.product.price * line.quantity, "currency") }}
      </p>
    </div>
  </li>
</template>
