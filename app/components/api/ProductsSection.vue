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
const productQueryState = reactive({
  loading: false,
  error: "",
  success: "",
  result: [] as Product[],
});
const handleProductQuery = async () => {
  productQueryState.loading = true;
  productQueryState.error = "";
  productQueryState.success = "";
  try {
    const result = await productsStore.queryProducts({
      category: productQueryForm.category,
      limit: productQueryForm.limit,
      sort: productQueryForm.sort,
    });
    productQueryState.result = result;
    productQueryState.success = t("api.products.querySuccess", {
      count: result.length,
    });
  } catch (error: any) {
    productQueryState.error = error?.message ?? t("api.errors.generic");
  } finally {
    productQueryState.loading = false;
  }
};

// 取得單一產品 (Get Product By ID)
const productByIdForm = reactive({ id: "" as string | number });
const productByIdState = reactive({
  loading: false,
  error: "",
  result: null as Product | null,
});
const handleProductById = async () => {
  if (!productByIdForm.id) {
    productByIdState.error = t("api.errors.idRequired");
    return;
  }
  productByIdState.loading = true;
  productByIdState.error = "";
  productByIdState.result = null;
  try {
    const product = await productsStore.fetchProductById(
      Number(productByIdForm.id),
    );
    productByIdState.result = product;
  } catch (error: any) {
    productByIdState.error = error?.message ?? t("api.errors.generic");
  } finally {
    productByIdState.loading = false;
  }
};

// 更新產品 (Update Product)
const productUpdateForm = reactive({
  id: "" as string | number,
  payload: '{\n  "title": "Updated title"\n}',
});
const productUpdateState = reactive({
  loading: false,
  error: "",
  success: "",
  result: null as Product | null,
});
const handleProductUpdate = async () => {
  if (!productUpdateForm.id) {
    productUpdateState.error = t("api.errors.idRequired");
    return;
  }
  let parsed: UpdateProductPayload;
  try {
    parsed = JSON.parse(productUpdateForm.payload);
  } catch (error: any) {
    productUpdateState.error = t("api.errors.invalidJson");
    return;
  }
  productUpdateState.loading = true;
  productUpdateState.error = "";
  productUpdateState.success = "";
  try {
    const updated = await productsStore.updateProduct(
      Number(productUpdateForm.id),
      parsed,
    );
    productUpdateState.result = updated;
    productUpdateState.success = t("api.products.updateSuccess", {
      id: updated.id,
    });
    notifications.success(
      t("notifications.productUpdated", { title: updated.title }),
    );
  } catch (error: any) {
    productUpdateState.error = error?.message ?? t("api.errors.generic");
  } finally {
    productUpdateState.loading = false;
  }
};

// 刪除產品 (Delete Product)
const productDeleteForm = reactive({ id: "" as string | number });
const productDeleteState = reactive({
  loading: false,
  error: "",
  success: "",
});
const handleProductDelete = async () => {
  if (!productDeleteForm.id) {
    productDeleteState.error = t("api.errors.idRequired");
    return;
  }
  productDeleteState.loading = true;
  productDeleteState.error = "";
  productDeleteState.success = "";
  try {
    await productsStore.deleteProduct(Number(productDeleteForm.id));
    productDeleteState.success = t("api.products.deleteSuccess", {
      id: productDeleteForm.id,
    });
    notifications.info(
      t("notifications.productDeleted", { id: productDeleteForm.id }),
    );
  } catch (error: any) {
    productDeleteState.error = error?.message ?? t("api.errors.generic");
  } finally {
    productDeleteState.loading = false;
  }
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
        :title="$t('api.products.updateTitle')"
        :description="$t('api.products.updateDescription')"
        :loading="productUpdateState.loading"
        :error="productUpdateState.error"
        :success-message="productUpdateState.success">
        <form class="space-y-4" @submit.prevent="handleProductUpdate">
          <BaseInput
            v-model="productUpdateForm.id"
            type="number"
            min="1"
            :label="$t('api.fields.productId')"
            required />
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
