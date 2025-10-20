<script setup lang="ts">
import type { Product } from "~/types/fakestore";
import { useCartStore } from "~/stores/cart";

const props = defineProps<{
  product: Product;
}>();

const cart = useCartStore();

const rating = computed(() => props.product.rating ?? { rate: 0, count: 0 });

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
  <section class="card-surface grid gap-10 p-8 lg:grid-cols-[1.1fr_1fr]">
    <div class="space-y-6">
      <span class="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-light">
        {{ product.category }}
      </span>
      <h1 class="text-3xl font-bold tracking-tight text-white">
        {{ product.title }}
      </h1>
      <p class="text-base leading-relaxed text-slate-300">
        {{ product.description }}
      </p>
      <div class="flex flex-wrap items-center gap-6">
        <p class="text-4xl font-semibold text-brand-light">
          ${{ product.price.toFixed(2) }}
        </p>
        <div class="flex items-center gap-2 text-sm text-amber-300">
          <span>
            {{ rating.rate.toFixed(1) }}
          </span>
          <span aria-hidden="true" class="text-lg">★</span>
          <span class="text-slate-400">{{ $t("products.details.reviews", { count: rating.count }) }}</span>
        </div>
      </div>
      <button
        type="button"
        class="inline-flex items-center rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-light"
        @click="addToCart"
      >
        {{ $t("products.actions.addToCart") }}
      </button>
    </div>
    <div class="flex items-center justify-center">
      <img :src="product.image" :alt="product.title" class="max-h-96 w-full rounded-2xl border border-slate-800 bg-slate-900/80 object-contain p-6" />
    </div>
  </section>
</template>
