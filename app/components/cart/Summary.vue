<script setup lang="ts">
// Checkout remains an explicit page-level action.
defineProps<{
  itemCount: number
  subtotal: number
  pending?: boolean
}>()

defineEmits<{ checkout: []; clear: [] }>()
</script>

<template>
  <aside class="order-summary" aria-labelledby="order-summary-title">
    <h2 id="order-summary-title">{{ $t("cart.summary") }}</h2>
    <dl class="mt-6 space-y-4 text-sm">
      <div class="flex justify-between gap-6 text-slate-600 dark:text-slate-300">
        <dt>{{ $t("cart.items", { count: itemCount }) }}</dt>
        <dd>{{ $n(subtotal, "currency") }}</dd>
      </div>
      <div class="flex justify-between gap-6 text-slate-600 dark:text-slate-300">
        <dt>{{ $t("cart.shipping") }}</dt>
        <dd>{{ $t("cart.shippingValue") }}</dd>
      </div>
      <div class="flex justify-between gap-6 border-t border-slate-200 pt-4 text-base font-semibold text-slate-950 dark:border-slate-700 dark:text-white">
        <dt>{{ $t("cart.total") }}</dt>
        <dd>{{ $n(subtotal, "currency") }}</dd>
      </div>
    </dl>
    <button
      class="btn-primary mt-7 w-full"
      type="button"
      :disabled="!itemCount || pending"
      @click="$emit('checkout')">
      {{ pending ? $t("cart.checkingOut") : $t("cart.checkout") }}
    </button>
    <button
      class="btn-quiet mt-3 w-full"
      type="button"
      :disabled="!itemCount || pending"
      @click="$emit('clear')">
      {{ $t("cart.clearCart") }}
    </button>
    <p class="notice mt-6" role="status">{{ $t("cart.demoNotice") }}</p>
  </aside>
</template>
