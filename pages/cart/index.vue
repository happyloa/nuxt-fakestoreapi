<script setup lang="ts">
import { useCartStore } from "~/stores/cart";
import { useAuthStore } from "~/stores/auth";

useSeoMeta({
  title: "Cart | Nuxt Fake Store",
  ogTitle: "Cart | Nuxt Fake Store",
  description: "Review the products stored in your cart.",
  ogDescription: "Review the products stored in your cart.",
});

const cart = useCartStore();
const auth = useAuthStore();

onMounted(() => {
  if (auth.user) {
    cart.fetchCart(auth.user.id);
  }
});
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-[2fr_1fr]">
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h1 class="section-title">
          {{ $t("cart.title") }}
        </h1>
        <button
          v-if="cart.items.length"
          type="button"
          class="text-sm font-semibold text-rose-400 hover:text-rose-300"
          @click="cart.clear()"
        >
          {{ $t("cart.clear") }}
        </button>
      </div>

      <p v-if="!auth.user" class="text-sm text-slate-400">
        {{ $t("cart.requiresLogin") }}
      </p>

      <ul v-if="cart.items.length" class="space-y-4">
        <CartItemRow
          v-for="item in cart.items"
          :key="item.id"
          :item="item"
          @remove="cart.removeItem(item.id)"
          @update:quantity="cart.updateQuantity(item.id, $event)"
        />
      </ul>

      <p v-else-if="!cart.loading" class="text-sm text-slate-400">
        {{ $t("cart.empty") }}
      </p>
      <div v-else class="space-y-3">
        <div v-for="skeleton in 3" :key="skeleton" class="card-surface h-24 animate-pulse bg-slate-900/40"></div>
      </div>
    </section>

    <CartSummary :count="cart.count" :total="cart.total" />
  </div>
</template>
