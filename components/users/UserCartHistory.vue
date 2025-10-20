<script setup lang="ts">
import type { CartSnapshot } from "~/types/fakestore";

const props = defineProps<{
  carts: CartSnapshot[];
}>();
</script>

<template>
  <section class="card-surface space-y-4 p-6">
    <h2 class="text-xl font-semibold text-white">
      {{ $t("users.detail.cartHistory") }}
    </h2>
    <ul class="space-y-4">
      <li v-for="cart in props.carts" :key="cart.id" class="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div class="flex flex-wrap items-center justify-between text-sm text-slate-300">
          <span>{{ new Date(cart.date).toLocaleDateString() }}</span>
          <span>{{ $t("users.detail.itemsCount", { count: cart.products.length }) }}</span>
        </div>
        <div class="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
          <span v-for="line in cart.products" :key="line.productId" class="rounded-full border border-slate-800 px-3 py-1">
            ID {{ line.productId }} · {{ $t("users.detail.quantity", { quantity: line.quantity }) }}
          </span>
        </div>
      </li>
    </ul>
    <p v-if="!props.carts.length" class="text-sm text-slate-400">
      {{ $t("users.detail.noCarts") }}
    </p>
  </section>
</template>
