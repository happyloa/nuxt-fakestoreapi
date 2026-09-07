<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useAuthStore } from "~/stores/auth";
import { useNotificationsStore } from "~/stores/notifications";

const authStore = useAuthStore();
const notifications = useNotificationsStore();
const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

// 安全的重導目標：僅接受站內相對路徑，避免 open redirect
const resolveRedirect = () => {
  const r = route.query.redirect;
  if (typeof r === "string" && r.startsWith("/") && !r.startsWith("//") && !/[\\\x00-\x1f]/.test(r)) {
    return r;
  }
  return localePath("/account");
};

// 已登入的使用者直接導向目標頁
if (authStore.isAuthenticated) {
  navigateTo(resolveRedirect());
}

/**
 * 由本站伺服器建立工作階段；登入後保留訪客已選購的商品。
 */

const handleSubmit = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  await authStore.loginUser(username, password);
  if (authStore.isAuthenticated) {

    notifications.success(
      t("notifications.loggedIn", {
        name: authStore.user?.username ?? username,
      }),
    );
    navigateTo(resolveRedirect());
  }
};

usePageSeo(() => ({
  title: t("seo.login.title"),
  description: t("seo.login.description"),
}));
</script>

<template>
  <div class="flex flex-col items-center gap-6" data-aos="fade-up">
    <LoginForm
      v-if="!authStore.isAuthenticated"
      :loading="authStore.loading"
      :error="authStore.error ?? undefined"
      @submit="handleSubmit" />
  </div>
</template>
