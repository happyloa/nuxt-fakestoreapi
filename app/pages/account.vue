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

const handleLogout = () => {
  authStore.logoutUser();
  notifications.info(t("notifications.loggedOut"), 2000);
  navigateTo(localePath("/"));
};

// 取得使用者全名
const fullName = computed(() => {
  if (!authStore.user?.name) return "";
  const { firstname, lastname } = authStore.user.name;
  return `${firstname} ${lastname}`;
});

// 取得使用者首字母 (用於頭像)
const initials = computed(() => {
  if (!authStore.user?.name) return "?";
  const f = authStore.user.name.firstname?.[0] ?? "";
  const l = authStore.user.name.lastname?.[0] ?? "";
  return (f + l).toUpperCase();
});

// 訂單項目：優先顯示當前購物車，否則顯示上次結帳的紀錄
const orderItems = computed(() =>
  cartStore.items.length ? cartStore.items : cartStore.lastOrderItems,
);

useHead(() => ({
  title: t("seo.account.title"),
  meta: [
    { name: "description", content: t("seo.account.description") },
    { property: "og:title", content: t("seo.account.title") },
    { property: "og:description", content: t("seo.account.description") },
  ],
}));
</script>

<template>
  <div class="space-y-8" data-aos="fade-up">
    <!-- 未登入提示 -->
    <div v-if="!authStore.user" class="flex flex-col items-center gap-6 py-12">
      <div
        class="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <svg
          class="h-10 w-10 text-slate-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </div>
      <div class="space-y-2 text-center">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
          {{ $t("account.title") }}
        </h1>
        <p class="text-slate-500 dark:text-slate-400">
          {{ $t("account.loginPrompt") }}
        </p>
      </div>
      <NuxtLink :to="localePath('/login')">
        <BaseButton>{{ $t("account.loginCta") }}</BaseButton>
      </NuxtLink>
    </div>

    <!-- 已登入帳號頁面 -->
    <template v-else>
      <!-- Hero 區塊 -->
      <div
        class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand/10 via-blue-50 to-indigo-50/50 p-8 dark:from-brand/5 dark:via-slate-900 dark:to-indigo-950/20"
        data-aos="zoom-in">
        <!-- 裝飾圓形 -->
        <div
          class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/5 blur-2xl" />
        <div
          class="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl" />

        <div class="relative flex flex-col items-center gap-5 sm:flex-row">
          <!-- 頭像 -->
          <div
            class="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-2xl font-bold text-white shadow-lg shadow-brand/25">
            {{ initials }}
          </div>
          <div class="text-center sm:text-left">
            <h1
              class="text-2xl font-bold capitalize text-slate-900 dark:text-white">
              {{ fullName }}
            </h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              @{{ authStore.user.username }}
            </p>
            <p class="mt-1 text-xs text-slate-400 dark:text-slate-500">
              {{ authStore.user.email }}
            </p>
          </div>
        </div>
      </div>

      <!-- 資訊卡片網格 -->
      <div class="grid gap-6 md:grid-cols-2">
        <!-- 個人資料卡片 -->
        <BaseCard class="space-y-4" data-aos="fade-up" data-aos-delay="100">
          <h2
            class="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <svg
              class="h-5 w-5 text-brand"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            {{ $t("account.sections.profile") }}
          </h2>
          <dl class="space-y-3 text-sm">
            <div
              class="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <dt class="font-medium text-slate-500 dark:text-slate-400">
                {{ $t("account.fields.username") }}
              </dt>
              <dd class="font-semibold text-slate-900 dark:text-white">
                {{ authStore.user.username }}
              </dd>
            </div>
            <div
              class="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <dt class="font-medium text-slate-500 dark:text-slate-400">
                {{ $t("account.fields.fullName") }}
              </dt>
              <dd
                class="font-semibold capitalize text-slate-900 dark:text-white">
                {{ fullName }}
              </dd>
            </div>
            <div
              class="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <dt class="font-medium text-slate-500 dark:text-slate-400">
                {{ $t("account.fields.email") }}
              </dt>
              <dd class="font-semibold text-slate-900 dark:text-white">
                {{ authStore.user.email }}
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="font-medium text-slate-500 dark:text-slate-400">
                {{ $t("account.fields.phone") }}
              </dt>
              <dd class="font-semibold text-slate-900 dark:text-white">
                {{ authStore.user.phone }}
              </dd>
            </div>
          </dl>
        </BaseCard>

        <!-- 地址卡片 -->
        <BaseCard class="space-y-4" data-aos="fade-up" data-aos-delay="200">
          <h2
            class="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <svg
              class="h-5 w-5 text-emerald-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {{ $t("account.sections.address") }}
          </h2>
          <dl class="space-y-3 text-sm">
            <div
              class="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <dt class="font-medium text-slate-500 dark:text-slate-400">
                {{ $t("account.fields.city") }}
              </dt>
              <dd class="font-semibold text-slate-900 dark:text-white">
                {{ authStore.user.address.city }}
              </dd>
            </div>
            <div
              class="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <dt class="font-medium text-slate-500 dark:text-slate-400">
                {{ $t("account.fields.street") }}
              </dt>
              <dd class="font-semibold text-slate-900 dark:text-white">
                {{ authStore.user.address.street }}
                {{ authStore.user.address.number }}
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="font-medium text-slate-500 dark:text-slate-400">
                {{ $t("account.fields.zipcode") }}
              </dt>
              <dd class="font-semibold text-slate-900 dark:text-white">
                {{ authStore.user.address.zipcode }}
              </dd>
            </div>
          </dl>
        </BaseCard>

        <!-- 最近訂單卡片 -->
        <BaseCard class="space-y-4" data-aos="fade-up" data-aos-delay="300">
          <h2
            class="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <svg
              class="h-5 w-5 text-amber-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            {{ $t("account.sections.recentOrders") }}
          </h2>
          <div v-if="orderItems.length" class="space-y-3">
            <div
              v-for="item in orderItems.slice(0, 3)"
              :key="item.id"
              class="flex items-center gap-3 rounded-lg border border-slate-100 p-3 dark:border-slate-800">
              <img
                :src="item.image"
                :alt="item.title"
                class="h-10 w-10 shrink-0 rounded-lg bg-white object-contain p-1" />
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-slate-900 dark:text-white">
                  {{ item.title }}
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  × {{ item.quantity }} · USD
                  {{ (item.price * item.quantity).toFixed(2) }}
                </p>
              </div>
            </div>
            <p
              v-if="orderItems.length > 3"
              class="text-center text-xs text-slate-400 dark:text-slate-500">
              {{ $t("account.orderItems", { count: orderItems.length }) }}
            </p>
          </div>
          <div
            v-else
            class="flex flex-col items-center gap-2 py-4 text-center text-sm text-slate-400 dark:text-slate-500">
            <svg
              class="h-8 w-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            {{ $t("account.noOrders") }}
          </div>
        </BaseCard>
      </div>

      <!-- 登出按鈕 -->
      <div
        class="flex justify-center pt-4"
        data-aos="fade-up"
        data-aos-delay="400">
        <BaseButton variant="outline" @click="handleLogout">
          <span class="flex items-center gap-2">
            <svg
              class="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            {{ $t("account.logout") }}
          </span>
        </BaseButton>
      </div>
    </template>
  </div>
</template>
