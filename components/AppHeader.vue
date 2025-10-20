<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useCartStore } from "~/stores/cart";
import { useAuthStore } from "~/stores/auth";

const cart = useCartStore();
const auth = useAuthStore();
const { t } = useI18n();
const route = useRoute();
const isMenuOpen = ref(false);

const navItems = computed(() => [
  { label: t("navigation.home"), to: "/" },
  { label: t("navigation.products"), to: "/products" },
  { label: t("navigation.createProduct"), to: "/products/new" },
  { label: t("navigation.users"), to: "/users" },
  { label: `${t("navigation.cart")} (${cart.count})`, to: "/cart" },
]);

watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false;
  },
);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const logout = () => {
  auth.logout();
};
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
      <NuxtLink to="/" class="flex items-center gap-2 text-lg font-semibold text-white">
        <span aria-hidden="true" class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand/20 text-xl">🛍️</span>
        <span>{{ t("app.title") }}</span>
      </NuxtLink>

      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg border border-slate-800 px-3 py-2 text-sm font-medium text-slate-200 shadow-sm transition hover:border-brand hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:hidden"
        @click="toggleMenu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          class="h-5 w-5"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span>{{ t("navigation.menu") }}</span>
      </button>

      <nav class="hidden items-center gap-6 text-sm font-medium lg:flex">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="rounded-full px-4 py-2 transition"
          :class="[
            route.path === item.to
              ? 'bg-brand/10 text-brand-light shadow-glow'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white',
          ]"
        >
          {{ item.label }}
        </NuxtLink>

        <NuxtLink
          v-if="!auth.user"
          to="/login"
          class="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-light"
        >
          {{ t("navigation.login") }}
        </NuxtLink>
        <div v-else class="flex items-center gap-3">
          <span class="text-sm text-slate-300">
            {{ t("navigation.welcome", { name: auth.user.username }) }}
          </span>
          <button
            type="button"
            class="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-brand hover:text-white"
            @click="logout"
          >
            {{ t("navigation.logout") }}
          </button>
        </div>
      </nav>
    </div>

    <Transition name="fade">
      <div
        v-if="isMenuOpen"
        class="border-t border-slate-800 bg-slate-950/95 px-4 py-4 shadow-2xl shadow-black/30 lg:hidden"
      >
        <nav class="flex flex-col gap-3 text-sm font-medium">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="rounded-xl px-3 py-2"
            :class="[
              route.path === item.to
                ? 'bg-brand/10 text-brand-light'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white',
            ]"
          >
            {{ item.label }}
          </NuxtLink>
          <NuxtLink
            v-if="!auth.user"
            to="/login"
            class="rounded-xl bg-brand px-3 py-2 text-center text-sm font-semibold text-slate-950 transition hover:bg-brand-light"
          >
            {{ t("navigation.login") }}
          </NuxtLink>
          <button
            v-else
            type="button"
            class="rounded-xl border border-slate-700 px-3 py-2 text-left text-sm font-semibold text-slate-200 transition hover:border-brand hover:text-white"
            @click="logout"
          >
            {{ t("navigation.logout") }}
          </button>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
