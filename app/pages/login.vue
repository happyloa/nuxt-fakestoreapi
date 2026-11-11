<script setup lang="ts">
const authStore = useAuthStore();
const notifications = useNotificationsStore();
const { t } = useI18n();
const localePath = useLocalePath();
const getRouteBaseName = useRouteBaseName();
const route = useRoute();
const router = useRouter();

// 上一次失敗的訊息不帶到這次造訪。
authStore.loginError = "";

// 導回目標是在當時的語系下產生的；依目前語系重新產生，
// 避免使用者在登入頁切換語言後又被導回原本的語系。
const resolveRedirect = () => {
  const target = safeRedirectPath(route.query.redirect);
  if (!target) return localePath("/account");
  const resolved = router.resolve(target);
  const name = getRouteBaseName(resolved);
  return typeof name === "string"
    ? localePath({ name, params: resolved.params, query: resolved.query, hash: resolved.hash })
    : target;
};

if (authStore.isAuthenticated) {
  navigateTo(resolveRedirect());
}

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
      <!-- 視覺上的標語；頁面標題是右側表單的 h1。 -->
      <p
        class="whitespace-pre-line text-[clamp(2.25rem,4.5vw,3.75rem)] font-extrabold leading-display tracking-heading"
      >
        {{ $t("auth.login.welcome") }}
      </p>
      <p
        class="mt-5 max-w-sm text-sm leading-7 text-slate-600 dark:text-slate-300"
      >
        {{ $t("auth.login.welcomeDescription") }}
      </p>
      <NuxtLink
        :to="localePath('/')"
        :class="UNDERLINE_LINK_CLASS"
        class="mt-8 self-start lg:mt-auto"
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
