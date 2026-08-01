<script setup lang="ts">
/**
 * 購物車管理區塊元件
 * 提供購物車的查詢、單一取得、依使用者取得、建立、更新與刪除功能
 */

import { useI18n } from "vue-i18n";
import { useAdminCartsStore } from "~/stores/adminCarts";
import { useNotificationsStore } from "~/stores/notifications";
import type {
  Cart,
  CreateCartPayload,
  UpdateCartPayload,
} from "~/types/fakestore";

const { t } = useI18n();
const adminCartsStore = useAdminCartsStore();
const notifications = useNotificationsStore();

// 查詢購物車列表 (Query Carts)
const cartQueryForm = reactive({
  limit: 5,
  sort: "desc" as "asc" | "desc",
  startDate: "",
  endDate: "",
});
const cartQuery = useApiOperation<Cart[]>([]);
const cartQueryState = cartQuery.state;
const handleCartsQuery = () =>
  cartQuery.run(
    () =>
      adminCartsStore.fetchAllCarts({
        limit: cartQueryForm.limit || undefined,
        sort: cartQueryForm.sort,
        startDate: cartQueryForm.startDate || undefined,
        endDate: cartQueryForm.endDate || undefined,
      }),
    {
      success: (carts) => t("api.carts.querySuccess", { count: carts.length }),
    },
  );

// 取得單一購物車 (Get Cart By ID)
const cartByIdForm = reactive({ id: "" as string | number });
const cartById = useApiOperation<Cart | null>(null);
const cartByIdState = cartById.state;
const handleCartById = () => {
  if (!cartByIdForm.id) return cartById.fail(t("api.errors.idRequired"));
  return cartById.run(() => adminCartsStore.fetchCartById(Number(cartByIdForm.id)));
};

// 依使用者取得購物車 (Get Cart By User)
const cartByUserForm = reactive({ userId: "" as string | number });
const cartByUser = useApiOperation<Cart[]>([]);
const cartByUserState = cartByUser.state;
const handleCartByUser = () => {
  if (!cartByUserForm.userId)
    return cartByUser.fail(t("api.errors.userIdRequired"));
  return cartByUser.run(() =>
    adminCartsStore.fetchCartsByUser(Number(cartByUserForm.userId)),
  );
};

// 建立購物車 (Create Cart)
const cartCreateForm = ref(
  JSON.stringify(
    {
      userId: 1,
      date: new Date().toISOString(),
      products: [{ productId: 1, quantity: 1 }],
    } as CreateCartPayload,
    null,
    2,
  ),
);
const cartCreate = useApiOperation<Cart | null>(null);
const cartCreateState = cartCreate.state;
const handleCartCreate = () => {
  let payload: CreateCartPayload;
  try {
    payload = JSON.parse(cartCreateForm.value);
  } catch {
    return cartCreate.fail(t("api.errors.invalidJson"));
  }
  return cartCreate.run(() => adminCartsStore.createRemoteCart(payload), {
    success: (cart) => t("api.carts.createSuccess", { id: cart!.id }),
    onSuccess: (cart) =>
      notifications.success(t("notifications.cartCreated", { id: cart!.id })),
  });
};

// 更新購物車 (Update Cart)
const cartUpdateForm = reactive({
  id: "" as string | number,
  method: "PUT" as "PUT" | "PATCH",
  payload: '{\n  "products": [{ "productId": 1, "quantity": 2 }]\n}',
});
const cartUpdate = useApiOperation<Cart | null>(null);
const cartUpdateState = cartUpdate.state;
const handleCartUpdate = () => {
  if (!cartUpdateForm.id) return cartUpdate.fail(t("api.errors.idRequired"));
  let payload: UpdateCartPayload;
  try {
    payload = JSON.parse(cartUpdateForm.payload);
  } catch {
    return cartUpdate.fail(t("api.errors.invalidJson"));
  }
  return cartUpdate.run(
    () =>
      cartUpdateForm.method === "PATCH"
        ? adminCartsStore.patchRemoteCart(Number(cartUpdateForm.id), payload)
        : adminCartsStore.updateRemoteCart(Number(cartUpdateForm.id), payload),
    {
      success: (cart) => t("api.carts.updateSuccess", { id: cart!.id }),
      onSuccess: (cart) =>
        notifications.info(t("notifications.cartPatched", { id: cart!.id })),
    },
  );
};

// 刪除購物車 (Delete Cart)
const cartDeleteForm = reactive({ id: "" as string | number });
const cartDelete = useApiOperation<null>(null);
const cartDeleteState = cartDelete.state;
const handleCartDelete = () => {
  if (!cartDeleteForm.id) return cartDelete.fail(t("api.errors.idRequired"));
  return cartDelete.run(
    async () => {
      await adminCartsStore.deleteRemoteCart(Number(cartDeleteForm.id));
      return null;
    },
    {
      success: () => t("api.carts.deleteSuccess", { id: cartDeleteForm.id }),
      onSuccess: () =>
        notifications.info(
          t("notifications.cartRemoved", { id: cartDeleteForm.id }),
        ),
    },
  );
};
</script>

<template>
  <section class="space-y-6">
    <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
      {{ $t("api.carts.title") }}
    </h2>
    <div class="grid gap-6 lg:grid-cols-2">
      <ApiOperationCard
        :title="$t('api.carts.queryTitle')"
        :description="$t('api.carts.queryDescription')"
        :loading="cartQueryState.loading"
        :error="cartQueryState.error"
        :success-message="cartQueryState.success">
        <form class="space-y-4" @submit.prevent="handleCartsQuery">
          <div class="grid gap-4 sm:grid-cols-2">
            <BaseInput
              v-model.number="cartQueryForm.limit"
              type="number"
              min="1"
              max="20"
              :label="$t('api.carts.fields.limit')" />
            <BaseSelect
              v-model="cartQueryForm.sort"
              :label="$t('api.carts.fields.sort')"
              :options="[
                { label: $t('products.filters.sortAsc'), value: 'asc' },
                { label: $t('products.filters.sortDesc'), value: 'desc' },
              ]" />
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <BaseInput
              v-model="cartQueryForm.startDate"
              type="date"
              :label="$t('api.carts.fields.startDate')" />
            <BaseInput
              v-model="cartQueryForm.endDate"
              type="date"
              :label="$t('api.carts.fields.endDate')" />
          </div>
          <BaseButton type="submit" :loading="cartQueryState.loading">
            {{ $t("api.actions.runQuery") }}
          </BaseButton>
        </form>
        <template #footer>
          <ApiResultViewer
            v-if="cartQueryState.result.length"
            :label="$t('api.results.preview')"
            :value="cartQueryState.result" />
        </template>
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.carts.singleTitle')"
        :description="$t('api.carts.singleDescription')"
        :loading="cartByIdState.loading"
        :error="cartByIdState.error">
        <form class="space-y-4" @submit.prevent="handleCartById">
          <BaseInput
            v-model="cartByIdForm.id"
            type="number"
            min="1"
            :label="$t('api.fields.cartId')"
            required />
          <BaseButton type="submit" :loading="cartByIdState.loading">
            {{ $t("api.actions.fetch") }}
          </BaseButton>
        </form>
        <template #footer>
          <ApiResultViewer
            v-if="cartByIdState.result"
            :label="$t('api.results.response')"
            :value="cartByIdState.result" />
        </template>
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.carts.userTitle')"
        :description="$t('api.carts.userDescription')"
        :loading="cartByUserState.loading"
        :error="cartByUserState.error">
        <form class="space-y-4" @submit.prevent="handleCartByUser">
          <BaseInput
            v-model="cartByUserForm.userId"
            type="number"
            min="1"
            :label="$t('api.fields.userId')"
            required />
          <BaseButton type="submit" :loading="cartByUserState.loading">
            {{ $t("api.actions.fetch") }}
          </BaseButton>
        </form>
        <template #footer>
          <ApiResultViewer
            v-if="cartByUserState.result.length"
            :label="$t('api.results.response')"
            :value="cartByUserState.result" />
        </template>
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.carts.createTitle')"
        :description="$t('api.carts.createDescription')"
        :loading="cartCreateState.loading"
        :error="cartCreateState.error"
        :success-message="cartCreateState.success">
        <form class="space-y-4" @submit.prevent="handleCartCreate">
          <BaseTextarea
            v-model="cartCreateForm"
            :label="$t('api.fields.payload')"
            :rows="6" />
          <BaseButton type="submit" :loading="cartCreateState.loading">
            {{ $t("api.actions.create") }}
          </BaseButton>
        </form>
        <template #footer>
          <ApiResultViewer
            v-if="cartCreateState.result"
            :label="$t('api.results.response')"
            :value="cartCreateState.result" />
        </template>
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.carts.updateTitle')"
        :description="$t('api.carts.updateDescription')"
        :loading="cartUpdateState.loading"
        :error="cartUpdateState.error"
        :success-message="cartUpdateState.success">
        <form class="space-y-4" @submit.prevent="handleCartUpdate">
          <div class="grid gap-4 sm:grid-cols-2">
            <BaseInput
              v-model="cartUpdateForm.id"
              type="number"
              min="1"
              :label="$t('api.fields.cartId')"
              required />
            <BaseSelect
              v-model="cartUpdateForm.method"
              :label="$t('api.products.fields.method')"
              :options="[
                { label: 'PUT', value: 'PUT' },
                { label: 'PATCH', value: 'PATCH' },
              ]" />
          </div>
          <BaseTextarea
            v-model="cartUpdateForm.payload"
            :label="$t('api.fields.payload')"
            :rows="6" />
          <BaseButton type="submit" :loading="cartUpdateState.loading">
            {{ $t("api.actions.update") }}
          </BaseButton>
        </form>
        <template #footer>
          <ApiResultViewer
            v-if="cartUpdateState.result"
            :label="$t('api.results.response')"
            :value="cartUpdateState.result" />
        </template>
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.carts.deleteTitle')"
        :description="$t('api.carts.deleteDescription')"
        :loading="cartDeleteState.loading"
        :error="cartDeleteState.error"
        :success-message="cartDeleteState.success">
        <form class="space-y-4" @submit.prevent="handleCartDelete">
          <BaseInput
            v-model="cartDeleteForm.id"
            type="number"
            min="1"
            :label="$t('api.fields.cartId')"
            required />
          <BaseButton
            type="submit"
            :loading="cartDeleteState.loading"
            variant="outline">
            {{ $t("api.actions.delete") }}
          </BaseButton>
        </form>
      </ApiOperationCard>
    </div>
  </section>
</template>
