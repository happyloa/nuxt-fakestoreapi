<script setup lang="ts">
import type { CatalogPayload, Product } from "~/types/storefront"

const { t } = useI18n()
const localePath = useLocalePath()
const { data, pending, error, refresh } = await useFetch<CatalogPayload>(
  "/api/catalog",
  { key: "storefront-catalog" },
)
const products = computed(() => data.value?.products ?? [])
const categories = computed(() => data.value?.categories ?? [])
const { search, category, sort, results, hasActiveFilters, clearFilters } =
  useCatalogQuery(products)
const { add } = useCart()
const addedProduct = ref<string | null>(null)
let noticeTimer: ReturnType<typeof setTimeout> | undefined

const addToCart = (product: Product) => {
  add(product)
  addedProduct.value = product.title
  if (noticeTimer) clearTimeout(noticeTimer)
  noticeTimer = setTimeout(() => {
    addedProduct.value = null
  }, 2800)
}

onScopeDispose(() => {
  if (noticeTimer) clearTimeout(noticeTimer)
})

useSeoMeta({
  title: () => t("catalog.title"),
  description: () => t("site.description"),
})
</script>

<template>
  <div class="space-y-12 lg:space-y-16">
    <CatalogHero />

    <CatalogFilters
      v-model:search="search"
      v-model:category="category"
      v-model:sort="sort"
      :categories="categories"
      :result-count="results.length"
      @clear="clearFilters" />

    <p v-if="addedProduct" class="success-notice" role="status">
      {{ $t("common.added") }} · {{ addedProduct }}
    </p>

    <section aria-live="polite">
      <div v-if="error" class="empty-state">
        <div class="empty-state__icon" aria-hidden="true">!</div>
        <h2>{{ $t("catalog.loadError") }}</h2>
        <button class="btn-primary mt-5" type="button" @click="() => refresh()">
          {{ $t("common.retry") }}
        </button>
      </div>
      <CatalogProductGrid
        v-else-if="pending || results.length"
        :products="results"
        :pending="pending"
        @add="addToCart" />
      <CatalogEmptyState v-else-if="hasActiveFilters" />
      <div v-else class="empty-state">
        <h2>{{ $t("catalog.loadError") }}</h2>
        <button class="btn-primary mt-5" type="button" @click="() => refresh()">
          {{ $t("common.retry") }}
        </button>
      </div>
    </section>

    <NuxtLink class="sr-only" :to="localePath('/cart')">
      {{ $t("navigation.cart") }}
    </NuxtLink>
  </div>
</template>
