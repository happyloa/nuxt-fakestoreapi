<script setup lang="ts">
import type { Product } from "#shared/types/fakestore";

defineEmits<{
  (e: "add-to-cart", product: Product): void;
}>();

interface Props {
  product?: Product | null;
}

const categoryLabel = useCategoryLabel();
const props = withDefaults(defineProps<Props>(), {
  product: null,
});
</script>

<template>
  <article
    v-if="product"
    class="grid items-start gap-8 lg:grid-cols-2 lg:gap-16"
  >
    <figure
      class="flex aspect-square items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 dark:border-slate-800"
    >
      <NuxtImg
        :src="product.image"
        :alt="product.title"
        width="600"
        height="600"
        sizes="(max-width: 1024px) 90vw, 550px"
        format="webp"
        fetchpriority="high"
        class="h-full w-full object-contain"
      />
    </figure>
    <div class="space-y-6 lg:py-8">
      <p class="text-sm text-slate-500 dark:text-slate-400">
        {{ categoryLabel(product.category) }}
      </p>
      <h1
        class="wrap-anywhere text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl"
      >
        {{ product.title }}
      </h1>
      <div v-if="product.rating" class="flex items-center gap-2 text-sm">
        <SiteIcon
          name="star"
          class="h-4 w-4 fill-accent text-accent dark:fill-accent-light dark:text-accent-light"
        /><span>{{
          $t("products.details.rating", { rate: product.rating.rate })
        }}</span
        ><span class="text-slate-500 dark:text-slate-400">{{
          $t(
            "products.details.reviews",
            { count: product.rating.count },
            product.rating.count,
          )
        }}</span>
      </div>
      <p class="text-3xl font-extrabold">{{ $n(product.price, "currency") }}</p>
      <p
        class="border-t border-slate-200 pt-6 text-sm leading-7 text-slate-600 dark:border-slate-800 dark:text-slate-300"
      >
        {{ product.description }}
      </p>
      <BaseButton block size="lg" @click="$emit('add-to-cart', product)"
        ><SiteIcon name="bag" class="h-5 w-5" />{{
          $t("products.actions.addToCart")
        }}</BaseButton
      >
      <p class="text-xs leading-5 text-slate-500 dark:text-slate-400">
        {{ $t("cart.demoNotice") }}
      </p>
    </div>
  </article>
  <BaseAlert v-else variant="warning">{{
    $t("products.details.missing")
  }}</BaseAlert>
</template>
