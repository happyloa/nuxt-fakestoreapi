<script setup lang="ts">
import type { Product } from "~/types/storefront"

const route = useRoute()
const localePath = useLocalePath()
const { t } = useI18n()
const id = Number(route.params.id)

if (!Number.isSafeInteger(id) || id < 1) {
  throw createError({ statusCode: 404, statusMessage: "Product not found" })
}

const { data: product, pending, error, refresh } = await useFetch<Product>(
  `/api/products/${id}`,
  { key: `storefront-product-${id}` },
)
const { add } = useCart()
const hasAdded = ref(false)

const addToCart = (item: Product) => {
  add(item)
  hasAdded.value = true
}

useSeoMeta({
  title: () => product.value?.title ?? t("catalog.viewProduct"),
  description: () => product.value?.description ?? t("product.loadError"),
  ogImage: () => product.value?.image,
  ogType: "website",
})

useHead(() => {
  if (!product.value) return {}

  return {
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.value.title,
          image: product.value.image,
          description: product.value.description,
          offers: {
            "@type": "Offer",
            price: product.value.price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.value.rating.rate,
            reviewCount: product.value.rating.count,
          },
        }),
      },
    ],
  }
})
</script>

<template>
  <div class="space-y-8">
    <NuxtLink :to="localePath('/')" class="back-link">
      <span aria-hidden="true">←</span>
      {{ $t("product.back") }}
    </NuxtLink>

    <div v-if="pending" class="grid gap-8 lg:grid-cols-2">
      <div class="product-skeleton min-h-[28rem]" />
      <div class="product-skeleton min-h-[28rem]" />
    </div>
    <div v-else-if="error || !product" class="empty-state">
      <h1>{{ $t("product.loadError") }}</h1>
      <button class="btn-primary mt-5" type="button" @click="() => refresh()">
        {{ $t("common.retry") }}
      </button>
    </div>
    <template v-else>
      <CatalogProductDetail :product="product" @add="addToCart" />
      <p v-if="hasAdded" class="success-notice" role="status">
        {{ $t("common.added") }} · {{ product.title }}
      </p>
    </template>
  </div>
</template>
