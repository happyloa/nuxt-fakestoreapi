<script setup lang="ts">
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
    class="mx-auto grid max-w-6xl gap-12 py-2 lg:grid-cols-2 lg:gap-0 lg:py-8"
  >
    <div
      class="flex flex-col border-rule lg:border-r lg:pr-16 dark:border-rule-dark"
    >
      <p class="meta mb-6 text-slate-500 dark:text-slate-400">Storefront Lab</p>
      <h2
        class="whitespace-pre-line text-[clamp(2.25rem,4.5vw,3.75rem)] font-extrabold leading-[0.98] tracking-heading"
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
        class="mt-8 inline-flex items-center gap-2 self-start border-b-2 border-slate-900 pb-1 text-sm font-bold hover:border-brand hover:text-brand lg:mt-auto dark:border-paper dark:hover:border-brand-light dark:hover:text-brand-light"
        >{{ $t("cart.continueShopping")
        }}<SiteIcon name="arrow" class="h-4 w-4"
      /></NuxtLink>
    </div>
    <LoginForm
      v-if="!authStore.isAuthenticated"
      class="lg:pl-16"
      :loading="authStore.loading"
      :error="authStore.loginError ? $t(authStore.loginError) : ''"
      @submit="handleSubmit"
    />
  </div>
</template>
