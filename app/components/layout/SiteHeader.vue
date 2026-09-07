<script setup lang="ts">
const route = useRoute();
const auth = useAuthStore();
const cart = useCartStore();
const { t } = useI18n();
const localePath = useLocalePath();
const menu = useTemplateRef<HTMLDialogElement>("menu");
const isMenuOpen = ref(false);
const navigation = computed(() => [
  { name: t("navigation.products"), to: localePath("/") },
  { name: t("navigation.cart"), to: localePath("/cart") },
  { name: t("navigation.newProduct"), to: localePath("/products/new") },
  { name: t("navigation.users"), to: localePath("/users") },
  { name: t("navigation.apiPlayground"), to: localePath("/api") },
]);
const accountPath = computed(() => localePath(auth.isAuthenticated ? "/account" : "/login"));
const closeMenu = () => { menu.value?.close(); };
const openMenu = () => { menu.value?.showModal(); isMenuOpen.value = true; };
watch(() => route.fullPath, closeMenu);
useWindowEvent("resize", () => { if (window.innerWidth >= 1280) closeMenu(); });
watch(isMenuOpen, (open) => { document.body.style.overflow = open ? "hidden" : ""; });
onBeforeUnmount(() => { if (import.meta.client) document.body.style.overflow = ""; });
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
      <NuxtLink :to="localePath('/')" class="flex shrink-0 items-center gap-2.5 text-lg font-bold">
        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-sm text-white" aria-hidden="true">FS</span>
        <span class="text-slate-900 dark:text-white">Fake Store</span>
      </NuxtLink>
      <nav :aria-label="t('navigation.ariaPrimary')" class="hidden items-center gap-1 text-sm font-medium xl:flex">
        <NuxtLink v-for="item in navigation" :key="item.to" :to="item.to"
          :aria-current="route.path === item.to ? 'page' : undefined"
          class="rounded-lg px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          :class="route.path === item.to ? 'bg-brand/10 text-brand dark:text-brand-light' : 'text-slate-600 dark:text-slate-300'">
          {{ item.name }}
          <span v-if="item.to === localePath('/cart') && cart.count" class="ml-1 rounded-full bg-brand px-1.5 py-0.5 text-xs text-white">{{ cart.count }}</span>
        </NuxtLink>
        <NuxtLink :to="accountPath" :aria-current="route.path === accountPath ? 'page' : undefined" class="rounded-lg px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800">
          {{ auth.isAuthenticated ? t('navigation.account') : t('navigation.login') }}
        </NuxtLink>
        <LanguageSwitcher />
      </nav>
      <div class="flex items-center gap-2 xl:hidden">
        <NuxtLink :to="localePath('/cart')" class="rounded-lg px-3 py-2.5 text-sm font-medium text-brand dark:text-brand-light">
          {{ t('navigation.cart') }}<span v-if="cart.count"> ({{ cart.count }})</span>
        </NuxtLink>
        <button type="button" :aria-expanded="isMenuOpen" aria-controls="site-navigation-mobile" :aria-label="t('navigation.ariaToggle')" class="rounded-lg border border-slate-300 p-3 dark:border-slate-700" @click="openMenu">
          <svg class="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
    </div>
    <dialog ref="menu" id="site-navigation-mobile" :aria-label="t('navigation.menu')"
      class="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-none w-80 max-w-[90vw] border-0 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/60 dark:bg-slate-900 dark:text-white"
      @close="isMenuOpen = false" @click="($event.target === menu) && closeMenu()">
      <nav :aria-label="t('navigation.ariaPrimary')" class="flex min-h-full flex-col p-5">
        <div class="mb-5 flex items-center justify-between">
          <span class="text-lg font-bold">{{ t('navigation.menu') }}</span>
          <button autofocus type="button" :aria-label="t('navigation.ariaClose')" class="rounded-lg px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800" @click="closeMenu">?</button>
        </div>
        <NuxtLink v-for="item in navigation" :key="item.to" :to="item.to" :aria-current="route.path === item.to ? 'page' : undefined"
          class="rounded-lg px-4 py-3 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
          :class="route.path === item.to ? 'bg-brand/10 text-brand dark:text-brand-light' : ''" @click="closeMenu">
          {{ item.name }}<span v-if="item.to === localePath('/cart') && cart.count"> ({{ cart.count }})</span>
        </NuxtLink>
        <NuxtLink :to="accountPath" class="rounded-lg px-4 py-3 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800" @click="closeMenu">
          {{ auth.isAuthenticated ? t('navigation.account') : t('navigation.login') }}
        </NuxtLink>
        <div class="mt-auto border-t border-slate-200 pt-6 dark:border-slate-700"><LanguageSwitcher /></div>
      </nav>
    </dialog>
  </header>
</template>
