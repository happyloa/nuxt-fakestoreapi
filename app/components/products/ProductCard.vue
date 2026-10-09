<script setup lang="ts">
import type { Product } from "#shared/types/fakestore";
defineProps<{ product: Product }>();
defineEmits<{ (e: "add-to-cart", product: Product): void }>();
const localePath = useLocalePath();
const categoryLabel = useCategoryLabel();
</script>
<template>
  <article class="group flex h-full flex-col">
    <NuxtLink
      :to="localePath('/product/' + product.id)"
      class="block rounded-xl"
    >
      <figure
        class="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-slate-200/70 bg-white p-6 sm:p-8 dark:border-slate-700"
      >
        <NuxtImg
          :src="product.image"
          :alt="product.title"
          width="360"
          height="360"
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 280px"
          format="webp"
          loading="lazy"
          class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </figure>
      <p class="mt-4 text-xs text-slate-500 dark:text-slate-400">
        {{ categoryLabel(product.category) }}
      </p>
      <h3
        class="mt-1.5 line-clamp-2 min-h-10 text-sm font-semibold leading-5 transition-colors group-hover:text-brand sm:text-base sm:leading-6 dark:group-hover:text-brand-light"
      >
        {{ product.title }}
      </h3>
    </NuxtLink>
    <div
      class="mt-2 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"
    >
      <SiteIcon
        name="star"
        class="h-3.5 w-3.5 fill-accent text-accent dark:fill-accent-light dark:text-accent-light"
      /><span>{{ product.rating?.rate ?? 0 }}</span
      ><span class="ml-1">({{ product.rating?.count ?? 0 }})</span>
    </div>
    <div
      class="mt-auto flex flex-wrap items-center justify-between gap-1 pt-4 sm:gap-2"
    >
      <span class="text-base font-extrabold tracking-tight sm:text-lg">{{
        $n(product.price, "currency")
      }}</span
      ><button
        type="button"
        :aria-label="
          $t('products.actions.addNamedToCart', { title: product.title })
        "
        :title="$t('products.actions.addToCart')"
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-transparent transition-colors hover:border-brand hover:bg-brand hover:text-white dark:border-slate-700 dark:hover:border-brand"
        @click="$emit('add-to-cart', product)"
      >
        <SiteIcon name="plus" class="h-5 w-5" />
      </button>
    </div>
  </article>
</template>
