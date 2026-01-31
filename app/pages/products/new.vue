<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { CreateProductPayload } from "~/types/fakestore";
import { useProductsStore } from "~/stores/products";
import { useNotificationsStore } from "~/stores/notifications";

const productsStore = useProductsStore();
const { t } = useI18n();
const notifications = useNotificationsStore();
const successMessage = ref("");
const formKey = ref(0);

/**
 * 建立商品頁面，將表單流程包裝成可重複利用的組件。
 */

await productsStore.fetchCategories();

const handleSubmit = async (payload: CreateProductPayload) => {
  successMessage.value = "";
  try {
    const created = await productsStore.createProduct(payload);
    successMessage.value = `${created.title} ${t("products.form.successSuffix")}`;
    formKey.value += 1;
    notifications.success(
      t("notifications.productCreated", { title: created.title }),
    );
  } catch (error) {
    // error handled by store
  }
};

useSeoMeta({
  title: "Create Product | Fake Store Dashboard",
  description: "Create a new Fake Store API product with full metadata.",
  ogTitle: "Create Product | Fake Store Dashboard",
  ogDescription: "Create a new Fake Store API product with full metadata.",
});
</script>

<template>
  <div class="space-y-8">
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

    <BaseAlert v-else-if="successMessage" variant="success">
      {{ successMessage }}
    </BaseAlert>
  </div>
</template>
