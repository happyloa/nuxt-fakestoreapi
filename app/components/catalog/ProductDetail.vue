<script setup lang="ts">
import type { Product } from "~/types/storefront"

const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ add: [product: Product] }>()
const { t } = useI18n()

const categoryLabel = computed(() => {
  const key = `catalog.categories.${props.product.category}`
  const translated = t(key)
  return translated === key ? props.product.category : translated
})
</script>

<template>
  <article class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.85fr)] lg:gap-14">
    <figure class="product-detail__media">
      <NuxtImg
        :src="product.image"
        :alt="product.title"
        width="680"
        height="680"
        sizes="(max-width: 1023px) 92vw, 52vw"
        format="webp"
        class="product-detail__image" />
    </figure>
    <div class="lg:py-8">
      <p class="eyebrow">{{ categoryLabel }}</p>
      <h1 class="mt-4 text-balance text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
        {{ product.title }}
      </h1>
      <p class="mt-5 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <span aria-hidden="true" class="text-amber-500">★</span>
        <span>{{ $t("product.rating", { rate: product.rating.rate.toFixed(1), count: product.rating.count }) }}</span>
      </p>
      <p class="mt-6 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
        {{ $n(product.price, "currency") }}
      </p>
      <p class="mt-7 text-base leading-8 text-slate-600 dark:text-slate-300">
        {{ product.description }}
      </p>
      <button class="btn-primary mt-8 w-full sm:w-auto" type="button" @click="emit('add', product)">
        {{ $t("product.addToCart") }}
      </button>
      <p class="notice mt-6" role="status">
        {{ $t("product.demoNotice") }}
      </p>
    </div>
  </article>
</template>
