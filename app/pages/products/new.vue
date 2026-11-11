<script setup lang="ts">
import type { CreateProductPayload } from "#shared/types/fakestore";
import { createProduct } from "~/services/fakestore/products";
import { useProductsStore } from "~/stores/products";
import { useNotificationsStore } from "~/stores/notifications";

const productsStore = useProductsStore();
const { t } = useI18n();
const notifications = useNotificationsStore();
const localePath = useLocalePath();
const formKey = ref(0);
const submitting = ref(false);
const submitFailed = ref(false);

definePageMeta({ middleware: "auth" });

const { error: categoriesError } = await useAsyncData("product-form-categories", async () => {
  await productsStore.loadCategories();
  return true;
});

// Fake Store 只回傳示範結果、不會真正新增商品，因此不寫入商品目錄。
const handleSubmit = async (payload: CreateProductPayload) => {
  submitting.value = true;
  submitFailed.value = false;
  try {
    const created = await createProduct(payload);
    formKey.value += 1;
    notifications.success(
      t("notifications.productCreated", { title: created.title }),
    );
  } catch {
    submitFailed.value = true;
  } finally {
    submitting.value = false;
  }
};

usePageSeo(() => ({
  title: t("seo.newProduct.title"),
  description: t("seo.newProduct.description"),
}));
</script>

<template>
  <div class="space-y-8">
    <NuxtLink
      :to="localePath('/')"
      class="meta inline-flex min-h-11 items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-paper"
    >
      <SiteIcon name="back" class="h-3.5 w-3.5" />
      {{ $t("products.form.back") }}
    </NuxtLink>

    <BaseSectionHeading
      :level="1"
      :title="$t('products.form.heading')"
      :description="$t('products.form.subheading')"
    />

    <BaseAlert v-if="categoriesError" variant="error">
      {{ $t("errors.load") }}
    </BaseAlert>

    <ProductForm
      :key="formKey"
      :categories="productsStore.categories"
      :loading="submitting"
      @submit="handleSubmit"
    />

    <BaseAlert v-if="submitFailed" variant="error">
      {{ $t("errors.save") }}
    </BaseAlert>
  </div>
</template>
