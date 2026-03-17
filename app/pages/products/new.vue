<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { CreateProductPayload } from "~/types/fakestore";
import { useProductsStore } from "~/stores/products";
import { useNotificationsStore } from "~/stores/notifications";

const productsStore = useProductsStore();
const { t } = useI18n();
const notifications = useNotificationsStore();
const formKey = ref(0);

/**
 * 建立商品頁面，將表單流程包裝成可重複利用的組件。
 */

await productsStore.fetchCategories();

const handleSubmit = async (payload: CreateProductPayload) => {
  try {
    const created = await productsStore.createProduct(payload);
    formKey.value += 1;
    notifications.success(
      t("notifications.productCreated", { title: created.title }),
    );
  } catch (error) {
    // error handled by store
  }
};

useHead(() => ({
  title: t("seo.newProduct.title"),
  meta: [
    { name: "description", content: t("seo.newProduct.description") },
    { property: "og:title", content: t("seo.newProduct.title") },
    { property: "og:description", content: t("seo.newProduct.description") },
  ],
}));
</script>

<template>
  <div class="space-y-8" data-aos="fade-up">
    <NuxtLink
      to="/"
      class="inline-flex items-center gap-2 text-sm font-medium text-brand">
      <svg
        class="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M15 19l-7-7 7-7" />
      </svg>
      {{ $t("products.form.back") }}
    </NuxtLink>

    <BaseSectionHeading
      :title="$t('products.form.heading')"
      :description="$t('products.form.subheading')" />

    <ProductForm
      :key="formKey"
      :categories="productsStore.categories"
      :loading="productsStore.loading"
      @submit="handleSubmit" />

    <BaseAlert v-if="productsStore.error" variant="error">
      {{ productsStore.error }}
    </BaseAlert>
  </div>
</template>
