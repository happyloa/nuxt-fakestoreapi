<script setup lang="ts">
import type { Product } from "~/types/fakestore";
import { useCartStore } from "~/stores/cart";

const props = defineProps<{
  product: Product;
}>();

const cart = useCartStore();

const ratingStars = computed(() => {
  const rounded = Math.round(props.product.rating?.rate ?? 0);
  return Array.from({ length: 5 }, (_, index) => index < rounded);
});

const addToCart = () => {
  cart.addItem({
    id: props.product.id,
    title: props.product.title,
    price: props.product.price,
    image: props.product.image,
  });
};
</script>

<template>
  <article class="card-surface flex h-full flex-col overflow-hidden">
    <NuxtLink :to="`/products/${product.id}`" class="relative block">
      <img
        :src="product.image"
        :alt="product.title"
        class="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
      />
      <span class="absolute left-4 top-4 rounded-full bg-brand/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-light">
        {{ product.category }}
      </span>
    </NuxtLink>

    <div class="flex flex-1 flex-col gap-3 p-5">
      <div>
        <NuxtLink :to="`/products/${product.id}`" class="text-lg font-semibold text-white">
          {{ product.title }}
        </NuxtLink>
        <p class="mt-2 text-sm text-slate-400">
          {{ product.description }}
        </p>
      </div>

      <div class="mt-auto flex items-center justify-between">
        <p class="text-xl font-semibold text-brand-light">
          ${{ product.price.toFixed(2) }}
        </p>
        <div class="flex items-center gap-1 text-xs text-amber-300">
          <span v-for="(filled, index) in ratingStars" :key="index">
            {{ filled ? "★" : "☆" }}
          </span>
          <span class="ml-1 text-slate-400">({{ product.rating?.count ?? 0 }})</span>
        </div>
      </div>

      <button
        type="button"
        class="inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-light"
        @click="addToCart"
      >
        {{ $t("products.actions.addToCart") }}
      </button>
    </div>
  </article>
</template>
