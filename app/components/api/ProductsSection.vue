<script setup lang="ts">
/** 商品端點：查詢、單筆、分類、更新與刪除。 */
import {
  deleteProduct,
  getProductById,
  getProductCategories,
  queryProducts,
  updateProduct,
} from "~/services/fakestore/products";
import type { UpdateMethod } from "~/services/fakestore/client";
import type { Product, UpdateProductPayload } from "#shared/types/fakestore";

const { t } = useI18n();
const productsStore = useProductsStore();
const notifications = useNotificationsStore();
const categoryLabel = useCategoryLabel();

const queryForm = reactive({ category: "all", limit: 6, sort: "asc" as "asc" | "desc" });
const query = useApiOperation<Product[]>([]);
const runQuery = () =>
  query.run(() => queryProducts(queryForm), {
    success: (products) => t("api.products.querySuccess", { count: products.length }),
  });

const byIdForm = reactive({ id: "" });
const byId = useApiOperation<Product | null>(null);
const runById = () => byId.run(() => getProductById(Number(byIdForm.id)));

const categories = useApiOperation<string[]>([]);
const runCategories = () => categories.run(getProductCategories);

const updateForm = reactive({
  id: "",
  method: "PUT" as UpdateMethod,
  payload: '{\n  "title": "Updated title"\n}',
});
const update = useApiOperation<Product | null>(null);
const runUpdate = () =>
  update.runWithJson<UpdateProductPayload>(
    updateForm.payload,
    (payload) => updateProduct(Number(updateForm.id), payload, updateForm.method),
    {
      success: (product) => t("api.products.updateSuccess", { id: product!.id }),
      onSuccess: (product) =>
        notifications.success(t("notifications.productUpdated", { title: product!.title })),
    },
  );

const deleteForm = reactive({ id: "" });
const remove = useApiOperation<Product | null>(null);
const runDelete = () => {
  const id = deleteForm.id;
  return remove.run(() => deleteProduct(Number(id)), {
    success: () => t("api.products.deleteSuccess", { id }),
    onSuccess: () => notifications.info(t("notifications.productDeleted", { id })),
  });
};
</script>

<template>
  <section class="space-y-6">
    <h2 class="meta text-slate-500 dark:text-slate-400">
      {{ $t("api.products.title") }}
    </h2>
    <div class="grid gap-6 lg:grid-cols-2">
      <ApiOperationCard
        :title="$t('api.products.queryTitle')"
        :description="$t('api.products.queryDescription')"
        :state="query.state"
        :action="$t('api.actions.runQuery')"
        :result-label="$t('api.results.preview')"
        @submit="runQuery">
        <div class="grid gap-4 sm:grid-cols-2">
          <BaseSelect
            v-model="queryForm.category"
            :label="$t('api.products.fields.category')"
            :options="[
              { label: $t('products.filters.allCategories'), value: 'all' },
              ...productsStore.categories.map((category) => ({
                label: categoryLabel(category),
                value: category,
              })),
            ]" />
          <BaseInput
            v-model.number="queryForm.limit"
            type="number"
            min="1"
            max="20"
            :label="$t('api.fields.limit')"
            required />
        </div>
        <BaseSelect
          v-model="queryForm.sort"
          :label="$t('api.fields.sort')"
          :options="[
            { label: $t('api.fields.sortAsc'), value: 'asc' },
            { label: $t('api.fields.sortDesc'), value: 'desc' },
          ]" />
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.products.singleTitle')"
        :description="$t('api.products.singleDescription')"
        :state="byId.state"
        :action="$t('api.actions.fetch')"
        @submit="runById">
        <BaseInput
          v-model="byIdForm.id"
          type="number"
          min="1"
          :label="$t('api.fields.productId')"
          required />
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.products.categoriesTitle')"
        :description="$t('api.products.categoriesDescription')"
        :state="categories.state"
        :action="$t('api.actions.fetch')"
        @submit="runCategories" />

      <ApiOperationCard
        :title="$t('api.products.updateTitle')"
        :description="$t('api.products.updateDescription')"
        :state="update.state"
        :action="$t('api.actions.update')"
        @submit="runUpdate">
        <div class="grid gap-4 sm:grid-cols-2">
          <BaseInput
            v-model="updateForm.id"
            type="number"
            min="1"
            :label="$t('api.fields.productId')"
            required />
          <BaseSelect
            v-model="updateForm.method"
            :label="$t('api.fields.method')"
            :options="[
              { label: 'PUT', value: 'PUT' },
              { label: 'PATCH', value: 'PATCH' },
            ]" />
        </div>
        <BaseTextarea
          v-model="updateForm.payload"
          :label="$t('api.fields.payload')"
          :rows="6" />
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.products.deleteTitle')"
        :description="$t('api.products.deleteDescription')"
        :state="remove.state"
        :action="$t('api.actions.delete')"
        destructive
        @submit="runDelete">
        <BaseInput
          v-model="deleteForm.id"
          type="number"
          min="1"
          :label="$t('api.fields.productId')"
          required />
      </ApiOperationCard>
    </div>
  </section>
</template>
