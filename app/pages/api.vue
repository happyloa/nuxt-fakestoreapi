<script setup lang="ts">
import { useProductsStore } from '~/stores/products'
import ProductsSection from '~/components/api/ProductsSection.vue'
import CartsSection from '~/components/api/CartsSection.vue'
import UsersSection from '~/components/api/UsersSection.vue'

/**
 * API Playground 頁面
 * 集中展示 Fake Store API 的全部操作 (CRUD)
 * 讓訪客可以實際操作並觀察 API 回應，作為作品集的互動展示亮點。
 */
const productsStore = useProductsStore()

// 預先抓取商品分類，供 ProductsSection 的下拉選單使用
await productsStore.fetchCategories()

// 設定 SEO Meta 標籤
useSeoMeta({
  title: 'API Playground | Fake Store Dashboard',
  description:
    'Experiment with every Fake Store API endpoint directly from the dashboard.',
  ogTitle: 'API Playground | Fake Store Dashboard',
  ogDescription:
    'Experiment with every Fake Store API endpoint directly from the dashboard.',
})
</script>

<template>
  <div class="space-y-12">
    <BaseSectionHeading
      :title="$t('api.title')"
      :description="$t('api.subtitle')"
    />

    <ProductsSection />
    <CartsSection />
    <UsersSection />
  </div>
</template>
