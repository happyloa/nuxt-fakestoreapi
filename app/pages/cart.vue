<script setup lang="ts">
const authStore = useAuthStore();
const cartStore = useCartStore();
const notifications = useNotificationsStore();
const { t } = useI18n();
const localePath = useLocalePath();

// 移除商品或清空後，被點的按鈕會從畫面消失；把焦點交給清單標題，
// 鍵盤與螢幕閱讀器使用者才不會回到頁首。
const itemsHeading = useTemplateRef<HTMLElement>("itemsHeading");
const focusItems = () => nextTick(() => itemsHeading.value?.focus());

const handleRemove = (id: number) => {
  cartStore.removeItem(id);
  notifications.info(t("notifications.cartItemRemoved"));
  focusItems();
};

const handleClear = () => {
  cartStore.clear();
  notifications.info(t("notifications.cartCleared"));
  focusItems();
};

const goToLogin = () => {
  notifications.info(t("notifications.checkoutLogin"));
  return navigateTo({ path: localePath("/login"), query: { redirect: localePath("/cart") } });
};

const handleCheckout = async () => {
  if (!authStore.isAuthenticated) return goToLogin();
  try {
    const order = await cartStore.checkout();
    if (order) {
      notifications.success(t("notifications.checkoutSuccess", { id: order.id }));
      // The checkout button disables itself once the cart is empty.
      focusItems();
    }
  } catch (error) {
    // The session expired or was cleared elsewhere: sign out here too.
    if ((error as { statusCode?: number } | null)?.statusCode === 401) {
      authStore.user = null;
      return goToLogin();
    }
    notifications.error(t("notifications.checkoutError"));
  }
};

usePageSeo(() => ({
  title: t("seo.cart.title"),
  description: t("seo.cart.description"),
}));
</script>

<template>
  <section class="space-y-10" aria-labelledby="cart-heading">
    <div
      class="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-rule pb-8 dark:border-rule-dark"
    >
      <BaseSectionHeading
        heading-id="cart-heading"
        class="mb-0!"
        :level="1"
        :title="$t('cart.title')"
        :description="$t('cart.subtitle')" />
      <BackLink :to="localePath('/')">{{ $t("cart.continueShopping") }}</BackLink>
    </div>

    <BaseAlert v-if="cartStore.justCheckedOut" variant="success">
      {{ $t("cart.completed") }}
    </BaseAlert>

    <BaseAlert v-if="!authStore.isAuthenticated" variant="info">
      <div
        class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>{{ $t("cart.loginPrompt") }}</span>
        <BaseButton :to="localePath('/login')" size="sm" class="shrink-0">
          {{ $t("navigation.login") }}
        </BaseButton>
      </div>
    </BaseAlert>

    <div
      class="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
      <section aria-labelledby="cart-items-heading">
        <h2
          id="cart-items-heading"
          ref="itemsHeading"
          tabindex="-1"
          class="sr-only">
          {{ $t("cart.itemsHeading") }}
        </h2>
        <CartItemsList
          :items="cartStore.items"
          :loading="cartStore.loading || !cartStore.restored"
          @increment="cartStore.increment"
          @decrement="cartStore.decrement"
          @remove="handleRemove" />
        <p
          v-if="cartStore.restored && !cartStore.items.length && !cartStore.loading"
          class="border-y border-rule py-16 text-center text-sm text-slate-600 dark:border-rule-dark dark:text-slate-300">
          {{ $t("cart.empty") }}
        </p>
      </section>
      <CartSummary
        :total="cartStore.total"
        :item-count="cartStore.count"
        :loading="cartStore.loading"
        @clear="handleClear"
        @checkout="handleCheckout" />
    </div>
  </section>
</template>
