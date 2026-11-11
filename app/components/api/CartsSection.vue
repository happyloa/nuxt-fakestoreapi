<script setup lang="ts">
/** 購物車端點：查詢、單筆、依會員、建立、更新與刪除。 */
import {
  createCart,
  deleteCart,
  getCartById,
  getCarts,
  getCartsByUser,
  updateCart,
} from "~/services/fakestore/carts";
import type { UpdateMethod } from "~/services/fakestore/client";
import type {
  Cart,
  CreateCartPayload,
  UpdateCartPayload,
} from "#shared/types/fakestore";

const { t } = useI18n();
const notifications = useNotificationsStore();

const queryForm = reactive({
  limit: 5,
  sort: "desc" as "asc" | "desc",
  startDate: "",
  endDate: "",
});
const query = useApiOperation<Cart[]>([]);
const runQuery = () =>
  query.run(
    () =>
      getCarts({
        limit: queryForm.limit || undefined,
        sort: queryForm.sort,
        startDate: queryForm.startDate || undefined,
        endDate: queryForm.endDate || undefined,
      }),
    { success: (carts) => t("api.carts.querySuccess", { count: carts.length }) },
  );

const byIdForm = reactive({ id: "" });
const byId = useApiOperation<Cart | null>(null);
const runById = () => byId.run(() => getCartById(Number(byIdForm.id)));

const byUserForm = reactive({ userId: "" });
const byUser = useApiOperation<Cart[]>([]);
const runByUser = () => byUser.run(() => getCartsByUser(Number(byUserForm.userId)));

const createPayload = ref(
  JSON.stringify(
    {
      userId: 1,
      date: new Date().toISOString().slice(0, 10),
      products: [{ productId: 1, quantity: 1 }],
    } satisfies CreateCartPayload,
    null,
    2,
  ),
);
const create = useApiOperation<Cart | null>(null);
const runCreate = () =>
  create.runWithJson<CreateCartPayload>(createPayload.value, createCart, {
    success: (cart) => t("api.carts.createSuccess", { id: cart!.id }),
    onSuccess: (cart) => notifications.success(t("notifications.cartCreated", { id: cart!.id })),
  });

const updateForm = reactive({
  id: "",
  method: "PUT" as UpdateMethod,
  payload: '{\n  "products": [{ "productId": 1, "quantity": 2 }]\n}',
});
const update = useApiOperation<Cart | null>(null);
const runUpdate = () =>
  update.runWithJson<UpdateCartPayload>(
    updateForm.payload,
    (payload) => updateCart(Number(updateForm.id), payload, updateForm.method),
    {
      success: (cart) => t("api.carts.updateSuccess", { id: cart!.id }),
      onSuccess: (cart) => notifications.info(t("notifications.cartPatched", { id: cart!.id })),
    },
  );

const deleteForm = reactive({ id: "" });
const remove = useApiOperation<Cart | null>(null);
const runDelete = () => {
  const id = deleteForm.id;
  return remove.run(() => deleteCart(Number(id)), {
    success: () => t("api.carts.deleteSuccess", { id }),
    onSuccess: () => notifications.info(t("notifications.cartRemoved", { id })),
  });
};
</script>

<template>
  <section class="space-y-6">
    <h2 class="meta text-slate-500 dark:text-slate-400">
      {{ $t("api.carts.title") }}
    </h2>
    <div class="grid gap-6 lg:grid-cols-2">
      <ApiOperationCard
        :title="$t('api.carts.queryTitle')"
        :description="$t('api.carts.queryDescription')"
        :state="query.state"
        :action="$t('api.actions.runQuery')"
        :result-label="$t('api.results.preview')"
        @submit="runQuery">
        <div class="grid gap-4 sm:grid-cols-2">
          <BaseInput
            v-model.number="queryForm.limit"
            type="number"
            min="1"
            max="20"
            :label="$t('api.fields.limit')" />
          <BaseSelect
            v-model="queryForm.sort"
            :label="$t('api.fields.sort')"
            :options="[
              { label: $t('api.fields.sortAsc'), value: 'asc' },
              { label: $t('api.fields.sortDesc'), value: 'desc' },
            ]" />
          <BaseInput
            v-model="queryForm.startDate"
            type="date"
            :label="$t('api.carts.fields.startDate')" />
          <BaseInput
            v-model="queryForm.endDate"
            type="date"
            :label="$t('api.carts.fields.endDate')" />
        </div>
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.carts.singleTitle')"
        :description="$t('api.carts.singleDescription')"
        :state="byId.state"
        :action="$t('api.actions.fetch')"
        @submit="runById">
        <BaseInput
          v-model="byIdForm.id"
          type="number"
          min="1"
          :label="$t('api.fields.cartId')"
          required />
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.carts.userTitle')"
        :description="$t('api.carts.userDescription')"
        :state="byUser.state"
        :action="$t('api.actions.fetch')"
        @submit="runByUser">
        <BaseInput
          v-model="byUserForm.userId"
          type="number"
          min="1"
          :label="$t('api.fields.userId')"
          required />
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.carts.createTitle')"
        :description="$t('api.carts.createDescription')"
        :state="create.state"
        :action="$t('api.actions.create')"
        @submit="runCreate">
        <BaseTextarea
          v-model="createPayload"
          :label="$t('api.fields.payload')"
          :rows="8" />
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.carts.updateTitle')"
        :description="$t('api.carts.updateDescription')"
        :state="update.state"
        :action="$t('api.actions.update')"
        @submit="runUpdate">
        <div class="grid gap-4 sm:grid-cols-2">
          <BaseInput
            v-model="updateForm.id"
            type="number"
            min="1"
            :label="$t('api.fields.cartId')"
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
        :title="$t('api.carts.deleteTitle')"
        :description="$t('api.carts.deleteDescription')"
        :state="remove.state"
        :action="$t('api.actions.delete')"
        destructive
        @submit="runDelete">
        <BaseInput
          v-model="deleteForm.id"
          type="number"
          min="1"
          :label="$t('api.fields.cartId')"
          required />
      </ApiOperationCard>
    </div>
  </section>
</template>
