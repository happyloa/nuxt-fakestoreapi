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
  if (
    typeof r === "string" &&
    r.startsWith("/") &&
    !r.startsWith("//") &&
    !/[\\\x00-\x1f]/.test(r)
  ) {
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
  <div
    class="mx-auto grid max-w-5xl items-center gap-10 py-4 lg:grid-cols-2 lg:gap-20 lg:py-10"
  >
    <div class="rounded-2xl bg-[#eef0e7] p-8 sm:p-10 dark:bg-[#2c3326]">
      <SiteIcon
        name="bag"
        class="mb-6 h-10 w-10 text-accent dark:text-accent-light"
      />
      <h2
        class="whitespace-pre-line text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl"
      >
        {{ $t("auth.login.welcome") }}
      </h2>
      <p
        class="mt-5 max-w-sm text-sm leading-7 text-slate-600 dark:text-slate-300"
      >
        {{ $t("auth.login.welcomeDescription") }}
      </p>
      <NuxtLink
        :to="localePath('/')"
        class="mt-8 inline-flex items-center gap-2 text-sm font-bold text-brand-dark dark:text-brand-light"
        >{{ $t("cart.continueShopping")
        }}<SiteIcon name="arrow" class="h-4 w-4"
      /></NuxtLink>
    </div>
    <LoginForm
      v-if="!authStore.isAuthenticated"
      :loading="authStore.loading"
      :error="authStore.error ?? undefined"
      @submit="handleSubmit"
    />
  </div>
</template>
