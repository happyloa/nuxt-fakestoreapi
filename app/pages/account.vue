<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useCartStore } from "~/stores/cart";
import { useNotificationsStore } from "~/stores/notifications";

const authStore = useAuthStore();
const cartStore = useCartStore();
const notifications = useNotificationsStore();
const { t } = useI18n();
const localePath = useLocalePath();

// 此頁需登入才能瀏覽；未登入者由 auth middleware 導向登入頁
definePageMeta({ middleware: "auth" });

const handleLogout = async () => {
  try {
    await authStore.logoutUser();
  } catch {
    notifications.error(t("api.errors.generic"));
    return;
  }
  notifications.info(t("notifications.loggedOut"), 2000);
  navigateTo(localePath("/"));
};

// 取得使用者全名
const fullName = computed(() => {
  if (!authStore.user?.name) return "";
  const { firstName, lastName } = authStore.user.name;
  return `${firstName} ${lastName}`;
});

// 最近一次示範結帳的商品（只存在於目前瀏覽器分頁的狀態中）
const orderItems = computed(() => cartStore.lastOrderItems);

usePageSeo(() => ({
  title: t("seo.account.title"),
  description: t("seo.account.description"),
}));
</script>

<template>
  <div class="space-y-8">
    <template v-if="authStore.user">
      <div
        class="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-b border-rule pb-8 dark:border-rule-dark"
      >
        <div class="min-w-0">
          <p class="meta text-slate-500 dark:text-slate-400">
            {{ catalogNumber(authStore.user.id) }} / {{ authStore.user.username }}
          </p>
          <h1
            class="mt-4 text-[clamp(2.5rem,6vw,4.75rem)] font-extrabold leading-[0.95] tracking-heading"
          >
            {{ $t("account.title") }}
          </h1>
          <p class="mt-3 text-base capitalize text-slate-600 dark:text-slate-300">
            {{ fullName }}
          </p>
        </div>
        <BaseButton
          variant="outline"
          @click="handleLogout"
          >{{ $t("account.logout") }}</BaseButton
        >
      </div>
      <div class="grid items-start gap-6 md:grid-cols-2">
        <BaseCard class="space-y-5"
          ><h2 class="meta text-slate-500 dark:text-slate-400">
            {{ $t("account.sections.profile") }}
          </h2>
          <dl class="space-y-3 text-sm">
            <AccountInfoRow :label="$t('account.fields.username')">{{
              authStore.user.username
            }}</AccountInfoRow
            ><AccountInfoRow
              :label="$t('account.fields.fullName')"
              capitalize
              >{{ fullName }}</AccountInfoRow
            ><AccountInfoRow :label="$t('account.fields.email')">{{
              authStore.user.email
            }}</AccountInfoRow
            ><AccountInfoRow
              :label="$t('account.fields.phone')"
              :divider="false"
              >{{ authStore.user.phone }}</AccountInfoRow
            >
          </dl></BaseCard
        >
        <BaseCard class="space-y-5"
          ><h2 class="meta text-slate-500 dark:text-slate-400">
            {{ $t("account.sections.address") }}
          </h2>
          <dl class="space-y-3 text-sm">
            <AccountInfoRow :label="$t('account.fields.city')">{{
              authStore.user.address.city
            }}</AccountInfoRow
            ><AccountInfoRow :label="$t('account.fields.street')"
              >{{ authStore.user.address.street }}
              {{ authStore.user.address.number }}</AccountInfoRow
            ><AccountInfoRow
              :label="$t('account.fields.zipcode')"
              :divider="false"
              >{{ authStore.user.address.zipcode }}</AccountInfoRow
            >
          </dl></BaseCard
        >
        <BaseCard class="space-y-5 md:col-span-2"
          ><h2 class="meta text-slate-500 dark:text-slate-400">
            {{ $t("account.sections.recentOrders") }}
          </h2>
          <ul
            v-if="orderItems.length"
            class="divide-y divide-rule dark:divide-rule-dark"
          >
            <li
              v-for="item in orderItems"
              :key="item.id"
              class="grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-3 py-4 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:items-center sm:gap-4"
            >
              <span class="flex h-12 w-12 items-center justify-center bg-plate p-1.5 sm:h-16 sm:w-16"
                ><img
                  :src="item.image"
                  :alt="item.title"
                  width="64"
                  height="64"
                  loading="lazy"
                  class="max-h-full object-contain mix-blend-multiply"
              /></span>
              <div class="min-w-0 flex-1">
                <p class="wrap-anywhere text-sm font-semibold">
                  {{ item.title }}
                </p>
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {{ item.quantity }} × {{ $n(item.price, "currency") }}
                </p>
              </div>
              <span class="col-start-2 text-sm font-bold sm:col-start-auto">{{
                $n(item.price * item.quantity, "currency")
              }}</span>
            </li>
          </ul>
          <p
            v-else
            class="py-8 text-center text-sm text-slate-500 dark:text-slate-400"
          >
            {{ $t("account.noOrders") }}
          </p></BaseCard
        >
      </div>
    </template>
    <div v-else class="space-y-5 py-12 text-center">
      <h1 class="text-3xl font-extrabold">{{ $t("account.title") }}</h1>
      <p class="text-slate-500 dark:text-slate-400">
        {{ $t("account.loginPrompt") }}
      </p>
      <BaseButton :to="localePath('/login')">{{
        $t("account.loginCta")
      }}</BaseButton>
    </div>
  </div>
</template>
