<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useAuthStore } from "~/stores/auth";
import { useCartStore } from "~/stores/cart";
import { useNotificationsStore } from "~/stores/notifications";

const authStore = useAuthStore();
const cartStore = useCartStore();
const notifications = useNotificationsStore();
const { t } = useI18n();
const checkoutLoading = ref(false);

/**
 * 監聽登入狀態以同步購物車，提供與 Fake Store API 對應的體驗。
 */

onMounted(() => {
  // 只在本地購物車為空時才從 API 初始載入，避免覆蓋使用者在其他頁面加入的商品
  // （Fake Store API 是模擬 API，POST 不會真的持久化，GET 永遠回傳原始資料）
  if (authStore.user && !cartStore.items.length) {
    cartStore.fetchCart(authStore.user.id);
  }
});

watch(
  () => authStore.user?.id,
  (userId, oldUserId) => {
    if (userId && userId !== oldUserId) {
      // 切換使用者時才重新載入
      cartStore.fetchCart(userId);
    } else if (!userId) {
      cartStore.clear();
    }
  },
);

const handleClear = () => {
  cartStore.clear({ preserveUser: true });
  notifications.info(t("notifications.cartCleared"), 2000);
};

const handleIncrement = (id: number) => {
  cartStore.increment(id);
  notifications.info(t("notifications.cartUpdated"), 2000);
};

const handleDecrement = (id: number) => {
  cartStore.decrement(id);
  notifications.info(t("notifications.cartUpdated"), 2000);
};

const handleRemove = (id: number) => {
  cartStore.removeItem(id);
  notifications.info(t("notifications.cartItemRemoved"), 2000);
};

const handleCheckout = async () => {
  if (!authStore.isAuthenticated) {
    notifications.info(t("notifications.checkoutLogin"), 2500);
    return;
  }
  if (!cartStore.items.length) {
    notifications.info(t("notifications.checkoutEmpty"), 2500);
    return;
  }
  checkoutLoading.value = true;
  try {
    const order = await cartStore.checkout();
    if (order) {
      notifications.success(
        t("notifications.checkoutSuccess", { id: order.id }),
        4000,
      );
    }
  } catch (error: any) {
    notifications.error(
      error?.message ?? t("notifications.checkoutError"),
      4000,
    );
  } finally {
    checkoutLoading.value = false;
  }
};

useHead(() => ({
  title: t("seo.cart.title"),
  meta: [
    { name: "description", content: t("seo.cart.description") },
    { property: "og:title", content: t("seo.cart.title") },
    { property: "og:description", content: t("seo.cart.description") },
  ],
}));
</script>

<template>
  <section class="space-y-8" aria-labelledby="cart-heading">
    <BaseSectionHeading
      id="cart-heading"
      :title="$t('cart.title')"
      :description="$t('cart.subtitle')" />

    <BaseAlert v-if="!authStore.isAuthenticated" variant="info">
      {{ $t("cart.loginPrompt") }}
    </BaseAlert>

    <div
      v-else
      class="grid gap-8 lg:items-start lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <section class="space-y-4" aria-labelledby="cart-items-heading">
        <h2 id="cart-items-heading" class="sr-only">
          {{ $t("cart.itemsHeading") }}
        </h2>
        <CartItemsList
          :items="cartStore.items"
          :loading="cartStore.loading"
          @increment="handleIncrement"
          @decrement="handleDecrement"
          @remove="handleRemove" />
        <BaseAlert v-if="cartStore.error" variant="error">
          {{ cartStore.error }}
        </BaseAlert>
        <BaseAlert
          v-if="!cartStore.items.length && !cartStore.loading"
          variant="warning">
          {{ $t("cart.empty") }}
        </BaseAlert>
      </section>
      <CartSummary
        :total="cartStore.total"
        :item-count="cartStore.count"
        :loading="cartStore.loading"
        :checkout-loading="checkoutLoading"
        @clear="handleClear"
        @checkout="handleCheckout" />
    </div>
  </section>
</template>
