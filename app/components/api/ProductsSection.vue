<script setup lang="ts">
/**
 * 產品管理區塊元件
 * 提供產品的查詢、單一取得、更新與刪除功能
 */

import { useI18n } from "vue-i18n";
import { useProductsStore } from "~/stores/products";
import { useNotificationsStore } from "~/stores/notifications";
import type { Product, UpdateProductPayload } from "~/types/fakestore";

const { t } = useI18n();
const productsStore = useProductsStore();
const notifications = useNotificationsStore();

// 查詢產品列表 (Query Products)
const productQueryForm = reactive({
  category: "all",
  limit: 6,
  sort: "asc" as "asc" | "desc",
});
const productQuery = useApiOperation<Product[]>([]);
const productQueryState = productQuery.state;
const handleProductQuery = () =>
  productQuery.run(
    () =>
      productsStore.queryProducts({
        category: productQueryForm.category,
        limit: productQueryForm.limit,
        sort: productQueryForm.sort,
      }),
    {
      success: (products) =>
        t("api.products.querySuccess", { count: products.length }),
    },
  );

// 取得單一產品 (Get Product By ID)
const productByIdForm = reactive({ id: "" as string | number });
const productById = useApiOperation<Product | null>(null);
const productByIdState = productById.state;
const handleProductById = () => {
  if (!productByIdForm.id) return productById.fail(t("api.errors.idRequired"));
  return productById.run(() =>
    productsStore.fetchProductById(Number(productByIdForm.id)),
  );
};

// 取得全部分類 (Fetch All Categories)
const productCategories = useApiOperation<string[]>([]);
const productCategoriesState = productCategories.state;
const handleFetchCategories = () =>
  productCategories.run(async () => {
    await productsStore.fetchCategories(true);
    return productsStore.categories;
  });

// 更新產品 (Update Product)
const productUpdateForm = reactive({
  id: "" as string | number,
  method: "PUT" as "PUT" | "PATCH",
  payload: '{\n  "title": "Updated title"\n}',
});
const productUpdate = useApiOperation<Product | null>(null);
const productUpdateState = productUpdate.state;
const handleProductUpdate = () => {
  if (!productUpdateForm.id)
    return productUpdate.fail(t("api.errors.idRequired"));
  let parsed: UpdateProductPayload;
  try {
    parsed = JSON.parse(productUpdateForm.payload);
  } catch {
    return productUpdate.fail(t("api.errors.invalidJson"));
  }
  return productUpdate.run(
    () =>
      productUpdateForm.method === "PATCH"
        ? productsStore.patchProduct(Number(productUpdateForm.id), parsed)
        : productsStore.updateProduct(Number(productUpdateForm.id), parsed),
    {
      success: (product) =>
        t("api.products.updateSuccess", { id: product!.id }),
      onSuccess: (product) =>
        notifications.success(
          t("notifications.productUpdated", { title: product!.title }),
        ),
    },
  );
};

// 刪除產品 (Delete Product)
const productDeleteForm = reactive({ id: "" as string | number });
const productDelete = useApiOperation<null>(null);
const productDeleteState = productDelete.state;
const handleProductDelete = () => {
  if (!productDeleteForm.id)
    return productDelete.fail(t("api.errors.idRequired"));
  return productDelete.run(
    async () => {
      await productsStore.deleteProduct(Number(productDeleteForm.id));
      return null;
    },
    {
      success: () =>
        t("api.products.deleteSuccess", { id: productDeleteForm.id }),
      onSuccess: () =>
        notifications.info(
          t("notifications.productDeleted", { id: productDeleteForm.id }),
        ),
    },
  );
};
</script>

<template>
  <section class="space-y-6">
    <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
      {{ $t("api.products.title") }}
    </h2>
    <div class="grid gap-6 lg:grid-cols-2">
      <ApiOperationCard
        :title="$t('api.products.queryTitle')"
        :description="$t('api.products.queryDescription')"
        :loading="productQueryState.loading"
        :error="productQueryState.error"
        :success-message="productQueryState.success">
        <form class="space-y-4" @submit.prevent="handleProductQuery">
          <div class="grid gap-4 sm:grid-cols-2">
            <BaseSelect
              v-model="productQueryForm.category"
              :label="$t('api.products.fields.category')"
              :options="[
                { label: $t('products.filters.allCategories'), value: 'all' },
                ...productsStore.categories.map((category) => ({
                  label: category,
                  value: category,
                })),
              ]" />
            <BaseInput
              v-model.number="productQueryForm.limit"
              type="number"
              min="1"
              max="20"
              :label="$t('api.products.fields.limit')"
              required />
          </div>
          <BaseSelect
            v-model="productQueryForm.sort"
            :label="$t('api.products.fields.sort')"
            :options="[
              { label: $t('products.filters.sortAsc'), value: 'asc' },
              { label: $t('products.filters.sortDesc'), value: 'desc' },
            ]" />
          <BaseButton type="submit" :loading="productQueryState.loading">
            {{ $t("api.actions.runQuery") }}
          </BaseButton>
        </form>
        <template #footer>
          <ApiResultViewer
            v-if="productQueryState.result.length"
            :label="$t('api.results.preview')"
            :value="productQueryState.result" />
        </template>
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.products.singleTitle')"
        :description="$t('api.products.singleDescription')"
        :loading="productByIdState.loading"
        :error="productByIdState.error">
        <form class="space-y-4" @submit.prevent="handleProductById">
          <BaseInput
            v-model="productByIdForm.id"
            type="number"
            min="1"
            :label="$t('api.fields.productId')"
            required />
          <BaseButton type="submit" :loading="productByIdState.loading">
            {{ $t("api.actions.fetch") }}
          </BaseButton>
        </form>
        <template #footer>
          <ApiResultViewer
            v-if="productByIdState.result"
            :label="$t('api.results.response')"
            :value="productByIdState.result" />
        </template>
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.products.categoriesTitle')"
        :description="$t('api.products.categoriesDescription')"
        :loading="productCategoriesState.loading"
        :error="productCategoriesState.error">
        <BaseButton
          type="button"
          :loading="productCategoriesState.loading"
          @click="handleFetchCategories">
          {{ $t("api.actions.fetch") }}
        </BaseButton>
        <template #footer>
          <ApiResultViewer
            v-if="productCategoriesState.result.length"
            :label="$t('api.results.response')"
            :value="productCategoriesState.result" />
        </template>
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.products.updateTitle')"
        :description="$t('api.products.updateDescription')"
        :loading="productUpdateState.loading"
        :error="productUpdateState.error"
        :success-message="productUpdateState.success">
        <form class="space-y-4" @submit.prevent="handleProductUpdate">
          <div class="grid gap-4 sm:grid-cols-2">
            <BaseInput
              v-model="productUpdateForm.id"
              type="number"
              min="1"
              :label="$t('api.fields.productId')"
              required />
            <BaseSelect
              v-model="productUpdateForm.method"
              :label="$t('api.products.fields.method')"
              :options="[
                { label: 'PUT', value: 'PUT' },
                { label: 'PATCH', value: 'PATCH' },
              ]" />
          </div>
          <BaseTextarea
            v-model="productUpdateForm.payload"
            :label="$t('api.fields.payload')"
            :rows="6" />
          <BaseButton type="submit" :loading="productUpdateState.loading">
            {{ $t("api.actions.update") }}
          </BaseButton>
        </form>
        <template #footer>
          <ApiResultViewer
            v-if="productUpdateState.result"
            :label="$t('api.results.response')"
            :value="productUpdateState.result" />
        </template>
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.products.deleteTitle')"
        :description="$t('api.products.deleteDescription')"
        :loading="productDeleteState.loading"
        :error="productDeleteState.error"
        :success-message="productDeleteState.success">
        <form class="space-y-4" @submit.prevent="handleProductDelete">
          <BaseInput
            v-model="productDeleteForm.id"
            type="number"
            min="1"
            :label="$t('api.fields.productId')"
            required />
          <BaseButton
            type="submit"
            :loading="productDeleteState.loading"
            variant="outline">
            {{ $t("api.actions.delete") }}
          </BaseButton>
        </form>
      </ApiOperationCard>
    </div>
  </section>
</template>
