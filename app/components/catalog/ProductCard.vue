<script setup lang="ts">
import type { Product } from "~/types/storefront"

const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ add: [product: Product] }>()
const localePath = useLocalePath()
const { t } = useI18n()

const categoryLabel = computed(() => {
  const key = `catalog.categories.${props.product.category}`
  const translated = t(key)
  return translated === key ? props.product.category : translated
})
</script>

<template>
  <article class="product-card">
    <NuxtLink
      class="product-card__image-link"
      :to="localePath(`/products/${product.id}`)"
      :aria-label="`${$t('catalog.viewProduct')}: ${product.title}`">
      <NuxtImg
        :src="product.image"
        :alt="product.title"
        width="400"
        height="400"
        sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, (max-width: 1279px) 31vw, 350px"
        format="webp"
        loading="lazy"
        class="product-card__image" />
    </NuxtLink>
    <div class="product-card__body">
      <div class="flex items-start justify-between gap-3">
        <p class="product-card__category">{{ categoryLabel }}</p>
        <p class="shrink-0 text-sm font-medium text-slate-600 dark:text-slate-300">
          {{ $n(product.price, "currency") }}
        </p>
      </div>
      <h3 class="mt-2 text-base font-semibold leading-6 text-slate-950 dark:text-white">
        <NuxtLink :to="localePath(`/products/${product.id}`)" class="link-cover">
          {{ product.title }}
        </NuxtLink>
      </h3>
      <p class="mt-2 flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
        <span aria-hidden="true" class="text-amber-500">★</span>
        <span>{{ product.rating.rate.toFixed(1) }}</span>
        <span class="text-slate-400">·</span>
        <span>{{ product.rating.count }}</span>
        <span class="sr-only">{{ $t("catalog.rating", { rate: product.rating.rate, count: product.rating.count }) }}</span>
      </p>
      <button class="btn-secondary mt-5 w-full" type="button" @click="emit('add', product)">
        {{ $t("catalog.addToCart") }}
      </button>
    </div>
  </article>
</template>
