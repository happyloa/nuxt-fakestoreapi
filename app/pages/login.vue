<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useAuthStore } from "~/stores/auth";
import { useCartStore } from "~/stores/cart";
import { useNotificationsStore } from "~/stores/notifications";

const authStore = useAuthStore();
const cartStore = useCartStore();
const notifications = useNotificationsStore();
const { t } = useI18n();

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
  }
};

const handleLogout = () => {
  authStore.logoutUser();
  notifications.info(t("notifications.loggedOut"), 2000);
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
    <!-- 登入成功卡片 -->
    <div
      v-if="authStore.user"
      class="relative w-full max-w-md overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 via-white to-teal-50/50 p-6 shadow-lg shadow-emerald-500/10 dark:border-emerald-500/30 dark:from-emerald-950/40 dark:via-slate-900 dark:to-teal-950/30 dark:shadow-emerald-500/5"
      data-aos="zoom-in">
      <!-- 頂部漸層色條 -->
      <div
        class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
      <div class="flex flex-col items-center gap-4 text-center">
        <!-- 打勾圖標 -->
        <div
          class="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
          <svg
            class="h-7 w-7"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div class="space-y-1">
          <p class="text-lg font-bold text-emerald-800 dark:text-emerald-200">
            {{ $t("auth.login.success", { name: authStore.user.username }) }}
          </p>
        </div>
        <BaseButton variant="outline" @click="handleLogout">
          {{ $t("auth.login.logout") }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>
