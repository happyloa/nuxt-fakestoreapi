<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useAuthStore } from "~/stores/auth";
import { useCartStore } from "~/stores/cart";
import { useNotificationsStore } from "~/stores/notifications";

const authStore = useAuthStore();
const cartStore = useCartStore();
const notifications = useNotificationsStore();
const { t } = useI18n();
const localePath = useLocalePath();

// 已登入的使用者直接導向帳號頁
if (authStore.user) {
  navigateTo(localePath("/account"));
}

/**
 * Fake Store API 僅提供基本的帳密驗證，因此登入後立即同步購物車。
 */

const handleSubmit = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  await authStore.loginUser(username, password);
  if (authStore.user) {
    cartStore.fetchCart(authStore.user.id);
    notifications.success(
      t("notifications.loggedIn", { name: authStore.user.username }),
    );
    navigateTo(localePath("/account"));
  }
};

useHead(() => ({
  title: t("seo.login.title"),
  meta: [
    { name: "description", content: t("seo.login.description") },
    { property: "og:title", content: t("seo.login.title") },
    { property: "og:description", content: t("seo.login.description") },
  ],
}));
</script>

<template>
  <div class="flex flex-col items-center gap-6" data-aos="fade-up">
    <LoginForm
      v-if="!authStore.user"
      :loading="authStore.loading"
      :error="authStore.error ?? undefined"
      @submit="handleSubmit" />
  </div>
</template>
