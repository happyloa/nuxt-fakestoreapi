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
  { name: t("navigation.apiPlayground"), to: localePath("/api") },
  { name: t("navigation.newProduct"), to: localePath("/products/new") },
  { name: t("navigation.users"), to: localePath("/users") },
]);
const accountPath = computed(() =>
  localePath(auth.isAuthenticated ? "/account" : "/login"),
);
const closeMenu = () => menu.value?.close();
const openMenu = () => {
  menu.value?.showModal();
  isMenuOpen.value = true;
};
watch(() => route.fullPath, closeMenu);
useWindowEvent("resize", () => {
  if (window.innerWidth >= 1024) closeMenu();
});
watch(isMenuOpen, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
});
onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = "";
});
</script>
<template>
  <header
    class="sticky top-0 z-40 border-b border-slate-200 bg-paper/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95"
  >
    <div
      class="mx-auto flex h-20 max-w-7xl items-center gap-2 px-4 sm:gap-5 sm:px-8 lg:px-10"
    >
      <NuxtLink
        :to="localePath('/')"
        class="mr-auto flex shrink-0 items-center gap-2 sm:gap-2.5"
        aria-label="Storefront Lab"
      >
        <span
          class="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white sm:h-10 sm:w-10"
          ><SiteIcon name="bag" class="h-5 w-5"
        /></span>
        <span class="text-lg font-extrabold tracking-tight sm:text-2xl"
          >Storefront<span class="ml-1 hidden text-brand sm:inline"
            >lab</span
          ></span
        >
      </NuxtLink>
      <nav
        :aria-label="t('navigation.ariaPrimary')"
        class="hidden items-center gap-5 text-sm font-semibold lg:flex"
      >
        <NuxtLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          :aria-current="route.path === item.to ? 'page' : undefined"
          class="py-2 transition-colors hover:text-brand dark:hover:text-brand-light"
          :class="
            route.path === item.to
              ? 'text-brand dark:text-brand-light'
              : 'text-slate-600 dark:text-slate-300'
          "
          >{{ item.name }}</NuxtLink
        >
      </nav>
      <div class="flex shrink-0 items-center sm:gap-2">
        <LanguageSwitcher />
        <ThemeToggle class="hidden sm:flex" />
        <NuxtLink
          :to="accountPath"
          :aria-label="
            auth.isAuthenticated
              ? t('navigation.account')
              : t('navigation.login')
          "
          class="hidden h-11 w-11 items-center justify-center rounded-full hover:bg-slate-100 sm:flex dark:hover:bg-slate-800"
          ><SiteIcon name="user" class="h-5 w-5"
        /></NuxtLink>
        <NuxtLink
          :to="localePath('/cart')"
          :aria-label="t('navigation.cart') + ' (' + cart.count + ')'"
          class="relative flex h-11 w-11 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <SiteIcon name="bag" class="h-5 w-5" /><span
            v-if="cart.count"
            class="absolute right-0 top-0 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white"
            >{{ cart.count }}</span
          >
        </NuxtLink>
        <button
          type="button"
          :aria-expanded="isMenuOpen"
          aria-controls="site-navigation-mobile"
          :aria-label="t('navigation.ariaToggle')"
          class="flex h-11 w-11 items-center justify-center rounded-full hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
          @click="openMenu"
        >
          <SiteIcon name="menu" class="h-6 w-6" />
        </button>
      </div>
    </div>
    <dialog
      ref="menu"
      id="site-navigation-mobile"
      :aria-label="t('navigation.menu')"
      class="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-none w-80 max-w-[90vw] border-0 bg-paper p-0 text-slate-900 shadow-xl backdrop:bg-slate-950/50 dark:bg-slate-900 dark:text-white"
      @close="isMenuOpen = false"
      @click="$event.target === menu && closeMenu()"
    >
      <nav
        :aria-label="t('navigation.ariaPrimary')"
        class="flex min-h-full flex-col p-6"
      >
        <div class="mb-8 flex items-center justify-between">
          <span class="text-xl font-bold">{{ t("navigation.menu") }}</span
          ><button
            autofocus
            type="button"
            :aria-label="t('navigation.ariaClose')"
            class="flex h-11 w-11 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            @click="closeMenu"
          >
            <SiteIcon name="close" class="h-5 w-5" />
          </button>
        </div>
        <NuxtLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          :aria-current="route.path === item.to ? 'page' : undefined"
          class="border-b border-slate-200 py-4 text-lg font-semibold dark:border-slate-700"
          :class="
            route.path === item.to ? 'text-brand dark:text-brand-light' : ''
          "
          @click="closeMenu"
          >{{ item.name }}</NuxtLink
        >
        <NuxtLink
          :to="localePath('/cart')"
          class="border-b border-slate-200 py-4 text-lg font-semibold dark:border-slate-700"
          @click="closeMenu"
          >{{ t("navigation.cart") }} ({{ cart.count }})</NuxtLink
        >
        <NuxtLink
          :to="accountPath"
          class="py-4 text-lg font-semibold"
          @click="closeMenu"
          >{{
            auth.isAuthenticated
              ? t("navigation.account")
              : t("navigation.login")
          }}</NuxtLink
        >
        <div class="mt-auto flex items-center justify-between pt-8">
          <LanguageSwitcher /><ThemeToggle />
        </div>
      </nav>
    </dialog>
  </header>
</template>
