<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useProductsStore } from "~/stores/products";
// ProductsSection / CartsSection / UsersSection 由 Nuxt 自動匯入，無需顯式 import

/**
 * API Playground 頁面
 * 集中展示 Fake Store API 的全部操作 (CRUD)
 * 讓訪客可以實際操作並觀察 API 回應，作為作品集的互動展示亮點。
 */
const productsStore = useProductsStore();

const { t } = useI18n();

// 預先抓取商品分類，供 ProductsSection 的下拉選單使用
await productsStore.fetchCategories();

// 設定 SEO Meta 標籤
usePageSeo(() => ({
  title: t("seo.api.title"),
  description: t("seo.api.description"),
}));
</script>

<template>
  <div class="space-y-12">
    <BaseSectionHeading
      :title="$t('api.title')"
      :description="$t('api.subtitle')"
      data-aos="fade-up" />

    <LazyProductsSection data-aos="fade-up" data-aos-delay="100" />
    <LazyCartsSection data-aos="fade-up" data-aos-delay="200" />
    <LazyUsersSection data-aos="fade-up" data-aos-delay="300" />
  </div>
</template>
