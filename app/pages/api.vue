<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useProductsStore } from "~/stores/products";
import ProductsSection from "~/components/api/ProductsSection.vue";
import CartsSection from "~/components/api/CartsSection.vue";
import UsersSection from "~/components/api/UsersSection.vue";

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
useHead(() => ({
  title: t("seo.api.title"),
  meta: [
    { name: "description", content: t("seo.api.description") },
    { property: "og:title", content: t("seo.api.title") },
    { property: "og:description", content: t("seo.api.description") },
  ],
}));
</script>

<template>
  <div class="space-y-12">
    <BaseSectionHeading
      :title="$t('api.title')"
      :description="$t('api.subtitle')"
      data-aos="fade-up" />

    <ProductsSection data-aos="fade-up" data-aos-delay="100" />
    <CartsSection data-aos="fade-up" data-aos-delay="200" />
    <UsersSection data-aos="fade-up" data-aos-delay="300" />
  </div>
</template>
