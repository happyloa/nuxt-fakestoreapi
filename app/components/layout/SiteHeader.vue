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
const accountLink = computed(() => ({
  to: localePath(auth.isAuthenticated ? "/account" : "/login"),
  name: auth.isAuthenticated ? t("navigation.account") : t("navigation.login"),
}));
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
    class="sticky top-0 z-40 border-b border-rule bg-paper dark:border-rule-dark dark:bg-slate-950"
  >
    <div
      class="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5 sm:px-8 lg:px-10"
    >
      <NuxtLink
        :to="localePath('/')"
        class="mr-auto shrink-0 text-[17px] font-extrabold tracking-[-0.03em]"
        >Storefront Lab</NuxtLink
      >
      <nav
        :aria-label="t('navigation.ariaPrimary')"
        class="hidden items-center gap-7 text-[13px] font-semibold lg:flex"
      >
        <NuxtLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          :aria-current="route.path === item.to ? 'page' : undefined"
          class="py-2 underline-offset-[7px] transition-colors"
          :class="
            route.path === item.to
              ? 'text-slate-900 underline decoration-brand decoration-2 dark:text-paper dark:decoration-brand-light'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-paper'
          "
          >{{ item.name }}</NuxtLink
        >
      </nav>
      <div class="flex shrink-0 items-center text-[13px] font-semibold">
        <LanguageSwitcher />
        <ThemeToggle class="hidden sm:flex" />
        <NuxtLink
          :to="accountLink.to"
          class="hidden h-11 items-center px-2 text-slate-600 hover:text-slate-900 sm:flex dark:text-slate-300 dark:hover:text-paper"
          >{{ accountLink.name }}</NuxtLink
        >
        <NuxtLink
          :to="localePath('/cart')"
          :aria-label="t('navigation.cart') + ' (' + cart.count + ')'"
          class="flex h-11 items-center gap-1.5 px-2"
        >
          {{ t("navigation.cart")
          }}<span
            class="min-w-6 bg-slate-900 px-1.5 py-0.5 text-center font-mono text-[11px] leading-4 text-paper tabular-nums dark:bg-paper dark:text-slate-950"
            :class="{ 'bg-brand! dark:bg-brand-light!': cart.count > 0 }"
            >{{ cart.count }}</span
          >
        </NuxtLink>
        <button
          type="button"
          :aria-expanded="isMenuOpen"
          aria-controls="site-navigation-mobile"
          :aria-label="t('navigation.ariaToggle')"
          class="flex h-11 items-center pl-3 lg:hidden"
          @click="openMenu"
        >
          {{ t("navigation.menu") }}
        </button>
      </div>
    </div>
    <dialog
      ref="menu"
      id="site-navigation-mobile"
      :aria-label="t('navigation.menu')"
      class="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-paper p-0 text-slate-900 backdrop:bg-transparent dark:bg-slate-950 dark:text-paper"
      @close="isMenuOpen = false"
    >
      <nav
        :aria-label="t('navigation.ariaPrimary')"
        class="flex min-h-full flex-col px-5 pb-8 sm:px-8"
      >
        <div
          class="flex h-16 items-center justify-between border-b border-rule dark:border-rule-dark"
        >
          <span class="text-[17px] font-extrabold tracking-[-0.03em]"
            >Storefront Lab</span
          ><button
            autofocus
            type="button"
            :aria-label="t('navigation.ariaClose')"
            class="flex h-11 w-11 items-center justify-end"
            @click="closeMenu"
          >
            <SiteIcon name="close" class="h-6 w-6" />
          </button>
        </div>
        <NuxtLink
          v-for="item in [...navigation, accountLink]"
          :key="item.to"
          :to="item.to"
          :aria-current="route.path === item.to ? 'page' : undefined"
          class="border-b border-rule py-4 text-3xl font-extrabold tracking-heading dark:border-rule-dark"
          :class="route.path === item.to && 'text-brand dark:text-brand-light'"
          @click="closeMenu"
          >{{ item.name }}</NuxtLink
        >
        <div class="mt-auto flex items-center justify-between pt-8">
          <LanguageSwitcher /><ThemeToggle />
        </div>
      </nav>
    </dialog>
  </header>
</template>
