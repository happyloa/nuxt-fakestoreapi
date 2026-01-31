<script setup lang="ts">
/**
 * 購物車管理區塊元件
 * 提供購物車的查詢、單一取得、依使用者取得、建立、更新與刪除功能
 */

import { useI18n } from "vue-i18n";
import { useCartStore } from "~/stores/cart";
import { useNotificationsStore } from "~/stores/notifications";
import type {
  Cart,
  CreateCartPayload,
  UpdateCartPayload,
} from "~/types/fakestore";

const { t } = useI18n();
const cartStore = useCartStore();
const notifications = useNotificationsStore();

// 查詢購物車列表 (Query Carts)
const cartQueryForm = reactive({
  limit: 5,
  sort: "desc" as "asc" | "desc",
  startDate: "",
  endDate: "",
});
const cartQueryState = reactive({
  loading: false,
  error: "",
  success: "",
  result: [] as Cart[],
});
const handleCartsQuery = async () => {
  cartQueryState.loading = true;
  cartQueryState.error = "";
  cartQueryState.success = "";
  try {
    const result = await cartStore.fetchAllCarts({
      limit: cartQueryForm.limit || undefined,
      sort: cartQueryForm.sort,
      startDate: cartQueryForm.startDate || undefined,
      endDate: cartQueryForm.endDate || undefined,
    });
    cartQueryState.result = result;
    cartQueryState.success = t("api.carts.querySuccess", {
      count: result.length,
    });
  } catch (error: any) {
    cartQueryState.error = error?.message ?? t("api.errors.generic");
  } finally {
    cartQueryState.loading = false;
  }
};

// 取得單一購物車 (Get Cart By ID)
const cartByIdForm = reactive({ id: "" as string | number });
const cartByIdState = reactive({
  loading: false,
  error: "",
  result: null as Cart | null,
});
const handleCartById = async () => {
  if (!cartByIdForm.id) {
    cartByIdState.error = t("api.errors.idRequired");
    return;
  }
  cartByIdState.loading = true;
  cartByIdState.error = "";
  cartByIdState.result = null;
  try {
    const cart = await cartStore.fetchCartById(Number(cartByIdForm.id));
    cartByIdState.result = cart;
  } catch (error: any) {
    cartByIdState.error = error?.message ?? t("api.errors.generic");
  } finally {
    cartByIdState.loading = false;
  }
};

// 依使用者取得購物車 (Get Cart By User)
const cartByUserForm = reactive({ userId: "" as string | number });
const cartByUserState = reactive({
  loading: false,
  error: "",
  result: [] as Cart[],
});
const handleCartByUser = async () => {
  if (!cartByUserForm.userId) {
    cartByUserState.error = t("api.errors.userIdRequired");
    return;
  }
  cartByUserState.loading = true;
  cartByUserState.error = "";
  cartByUserState.result = [];
  try {
    const carts = await cartStore.fetchCartsByUser(
      Number(cartByUserForm.userId),
    );
    cartByUserState.result = carts;
  } catch (error: any) {
    cartByUserState.error = error?.message ?? t("api.errors.generic");
  } finally {
    cartByUserState.loading = false;
  }
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
const cartCreateState = reactive({
  loading: false,
  error: "",
  success: "",
  result: null as Cart | null,
});
const handleCartCreate = async () => {
  let payload: CreateCartPayload;
  try {
    payload = JSON.parse(cartCreateForm.value);
  } catch (error: any) {
    cartCreateState.error = t("api.errors.invalidJson");
    return;
  }
  cartCreateState.loading = true;
  cartCreateState.error = "";
  cartCreateState.success = "";
  try {
    const created = await cartStore.createRemoteCart(payload);
    cartCreateState.result = created;
    cartCreateState.success = t("api.carts.createSuccess", { id: created.id });
    notifications.success(t("notifications.cartCreated", { id: created.id }));
  } catch (error: any) {
    cartCreateState.error = error?.message ?? t("api.errors.generic");
  } finally {
    cartCreateState.loading = false;
  }
};

// 更新購物車 (Update Cart)
const cartUpdateForm = reactive({
  id: "" as string | number,
  payload: '{\n  "products": [{ "productId": 1, "quantity": 2 }]\n}',
});
const cartUpdateState = reactive({
  loading: false,
  error: "",
  success: "",
  result: null as Cart | null,
});
const handleCartUpdate = async () => {
  if (!cartUpdateForm.id) {
    cartUpdateState.error = t("api.errors.idRequired");
    return;
  }
  let payload: UpdateCartPayload;
  try {
    payload = JSON.parse(cartUpdateForm.payload);
  } catch (error: any) {
    cartUpdateState.error = t("api.errors.invalidJson");
    return;
  }
  cartUpdateState.loading = true;
  cartUpdateState.error = "";
  cartUpdateState.success = "";
  try {
    const updated = await cartStore.updateRemoteCart(
      Number(cartUpdateForm.id),
      payload,
    );
    cartUpdateState.result = updated;
    cartUpdateState.success = t("api.carts.updateSuccess", { id: updated.id });
    notifications.info(t("notifications.cartPatched", { id: updated.id }));
  } catch (error: any) {
    cartUpdateState.error = error?.message ?? t("api.errors.generic");
  } finally {
    cartUpdateState.loading = false;
  }
};

// 刪除購物車 (Delete Cart)
const cartDeleteForm = reactive({ id: "" as string | number });
const cartDeleteState = reactive({
  loading: false,
  error: "",
  success: "",
});
const handleCartDelete = async () => {
  if (!cartDeleteForm.id) {
    cartDeleteState.error = t("api.errors.idRequired");
    return;
  }
  cartDeleteState.loading = true;
  cartDeleteState.error = "";
  cartDeleteState.success = "";
  try {
    await cartStore.deleteRemoteCart(Number(cartDeleteForm.id));
    cartDeleteState.success = t("api.carts.deleteSuccess", {
      id: cartDeleteForm.id,
    });
    notifications.info(
      t("notifications.cartRemoved", { id: cartDeleteForm.id }),
    );
  } catch (error: any) {
    cartDeleteState.error = error?.message ?? t("api.errors.generic");
  } finally {
    cartDeleteState.loading = false;
  }
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
          <BaseInput
            v-model="cartUpdateForm.id"
            type="number"
            min="1"
            :label="$t('api.fields.cartId')"
            required />
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
