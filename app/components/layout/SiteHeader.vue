<script setup lang="ts">
/**
 * 網站頁首元件 (Site Header)
 * 包含 Logo、導覽選單、語系切換、主題切換與使用者歡迎訊息
 * 支援響應式設計 (Mobile Menu) + 滾動縮小效果
 */
import { useRoute } from "#imports";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "~/stores/auth";
import { useCartStore } from "~/stores/cart";

const route = useRoute();
const auth = useAuthStore();
const cart = useCartStore();
const { t } = useI18n();
const isMenuOpen = ref(false);
const isScrolled = ref(false);

const localePath = useLocalePath();

// 定義導覽連結
const navigation = computed(() => [
  { name: t("navigation.products"), to: localePath("/") },
  { name: t("navigation.newProduct"), to: localePath("/products/new") },
  { name: t("navigation.cart"), to: localePath("/cart") },
  { name: t("navigation.users"), to: localePath("/users") },
  { name: t("navigation.apiPlayground"), to: localePath("/api") },
  auth.user
    ? { name: t("navigation.account"), to: localePath("/account") }
    : { name: t("navigation.login"), to: localePath("/login") },
]);

// 購物車連結文字 (若有商品則顯示數量)
const cartLabel = computed(() =>
  cart.count ? t("cart.summary.items", { count: cart.count }) : t("cart.title"),
);

const isActive = (path: string) => route.path === path;

// 監聽路由變化，切換頁面時自動關閉手機版選單
watch(
  () => route.path,
  () => {
    isMenuOpen.value = false;
  },
);

// 處理 ESC 鍵關閉選單
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    isMenuOpen.value = false;
  }
};

// 處理視窗大小調整，寬螢幕時自動關閉手機版選單
const handleResize = () => {
  if (window.innerWidth >= 1024) {
    isMenuOpen.value = false;
  }
};

// 滾動偵測
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  if (!import.meta.client) return;
  window.addEventListener("keyup", handleEscape);
  window.addEventListener("resize", handleResize);
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});

onBeforeUnmount(() => {
  if (!import.meta.client) return;
  window.removeEventListener("keyup", handleEscape);
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b transition-all duration-300"
    :class="[
      isScrolled
        ? 'border-slate-200/60 bg-white/85 py-0 shadow-sm backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/85'
        : 'border-transparent bg-white/70 py-1 backdrop-blur-md dark:bg-slate-950/70',
    ]">
    <div
      class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 xl:px-10">
      <NuxtLink
        :to="localePath('/')"
        class="group flex items-center gap-2.5 text-lg font-bold transition-all duration-300 hover:scale-[1.02]">
        <span
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dark text-sm font-bold text-white shadow-lg shadow-brand/25 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-brand/40"
          >FS</span
        >
        <span class="gradient-brand-text font-extrabold">Fake Store</span>
      </NuxtLink>
      <nav
        aria-label="Primary navigation"
        class="hidden items-center gap-1.5 text-sm font-medium text-slate-600 lg:flex lg:flex-wrap lg:justify-end lg:gap-2 dark:text-slate-200">
        <NuxtLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          class="relative rounded-lg px-3 py-2 transition-all duration-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
          :class="[
            isActive(item.to)
              ? 'text-brand dark:text-brand-light font-semibold'
              : 'text-slate-600 dark:text-slate-300',
          ]">
          <span
            v-if="item.to === localePath('/cart') && cart.count"
            class="flex items-center gap-2">
            {{ t("cart.title") }}
            <span
              class="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand dark:bg-brand/20 dark:text-brand-foreground"
              >{{ cart.count }}</span
            >
          </span>
          <template v-else>
            {{ item.to === localePath("/cart") ? cartLabel : item.name }}
          </template>
          <!-- Active indicator -->
          <span
            v-if="isActive(item.to)"
            class="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-brand transition-all dark:bg-brand-light" />
        </NuxtLink>
        <div class="ml-2">
          <LanguageSwitcher />
        </div>
      </nav>
      <button
        class="inline-flex items-center rounded-xl border border-slate-200/60 p-2.5 text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:shadow-sm lg:hidden dark:border-slate-700/60 dark:text-slate-200 dark:hover:bg-slate-800"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-controls="site-navigation-mobile"
        @click="isMenuOpen = !isMenuOpen">
        <span class="sr-only">Toggle navigation</span>
        <Transition name="menu-icon" mode="out-in">
          <svg
            v-if="!isMenuOpen"
            key="menu"
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg
            v-else
            key="close"
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Transition>
      </button>
    </div>
    <!-- Mobile overlay -->
    <ClientOnly>
      <Teleport to="body">
        <Transition name="overlay">
          <div
            v-if="isMenuOpen"
            class="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
            @click="isMenuOpen = false" />
        </Transition>
      </Teleport>
    </ClientOnly>
    <!-- Mobile slide-in panel -->
    <ClientOnly>
      <Teleport to="body">
        <Transition name="slide-right">
          <div
            v-if="isMenuOpen"
            id="site-navigation-mobile"
            class="fixed inset-y-0 right-0 z-50 w-72 lg:hidden">
            <nav
              aria-label="Primary navigation"
              class="flex h-full flex-col bg-white/95 px-5 py-6 shadow-2xl backdrop-blur-xl dark:bg-slate-900/95">
              <div class="mb-6 flex items-center justify-between">
                <span class="gradient-brand-text text-lg font-bold">選單</span>
                <button
                  type="button"
                  class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  @click="isMenuOpen = false">
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div class="flex-1 space-y-1">
                <NuxtLink
                  v-for="item in navigation"
                  :key="item.to"
                  :to="item.to"
                  class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                  :class="[
                    isActive(item.to)
                      ? 'bg-brand/5 text-brand dark:bg-brand/10 dark:text-brand-light'
                      : 'text-slate-700 dark:text-slate-200',
                  ]">
                  {{ item.to === localePath("/cart") ? cartLabel : item.name }}
                </NuxtLink>
              </div>
              <div
                class="mt-6 flex items-center gap-3 border-t border-slate-200/60 pt-6 dark:border-slate-700/60">
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>
  </header>
</template>

<style scoped>
/* Menu icon transition */
.menu-icon-enter-active,
.menu-icon-leave-active {
  transition: all 0.2s ease;
}
.menu-icon-enter-from,
.menu-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}

/* Overlay */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* Slide-right panel */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
