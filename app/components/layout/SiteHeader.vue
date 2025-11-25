<script setup lang="ts">
/**
 * 網站頁首元件 (Site Header)
 * 包含 Logo、導覽選單、語系切換、主題切換與使用者歡迎訊息
 * 支援響應式設計 (Mobile Menu)
 */
import { useRoute } from '#imports'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const auth = useAuthStore()
const cart = useCartStore()
const { t } = useI18n()
const isMenuOpen = ref(false)

const localePath = useLocalePath()

// 定義導覽連結
const navigation = computed(() => [
  { name: t('navigation.products'), to: localePath('/') },
  { name: t('navigation.newProduct'), to: localePath('/products/new') },
  { name: t('navigation.cart'), to: localePath('/cart') },
  { name: t('navigation.users'), to: localePath('/users') },
  { name: t('navigation.apiPlayground'), to: localePath('/api') },
  { name: t('navigation.login'), to: localePath('/login') },
])

// 購物車連結文字 (若有商品則顯示數量)
const cartLabel = computed(() =>
  cart.count ? t('cart.summary.items', { count: cart.count }) : t('cart.title'),
)

const isActive = (path: string) => route.path === path

// 監聽路由變化，切換頁面時自動關閉手機版選單
watch(
  () => route.path,
  () => {
    isMenuOpen.value = false
  },
)

// 處理 ESC 鍵關閉選單
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    isMenuOpen.value = false
  }
}

// 處理視窗大小調整，寬螢幕時自動關閉手機版選單
const handleResize = () => {
  if (window.innerWidth >= 768) {
    isMenuOpen.value = false
  }
}

onMounted(() => {
  if (!import.meta.client) return
  window.addEventListener('keyup', handleEscape)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  window.removeEventListener('keyup', handleEscape)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-slate-200/40 bg-white/80 backdrop-blur transition-colors duration-200 dark:border-slate-800/60 dark:bg-slate-950/80">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 xl:px-10">
      <NuxtLink :to="localePath('/')" class="flex items-center gap-2 text-lg font-bold text-brand dark:text-brand-light">
        <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white shadow-lg shadow-brand/30">FS</span>
        <span>Fake Store Dashboard</span>
      </NuxtLink>
      <nav
        aria-label="Primary navigation"
        class="hidden items-center gap-2 text-sm font-medium text-slate-600 transition-colors duration-200 md:flex md:flex-wrap md:justify-end md:gap-4 lg:gap-6 dark:text-slate-200"
      >
        <NuxtLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          :class="[
            'transition hover:text-brand dark:hover:text-brand-light',
            isActive(item.to)
              ? 'text-brand dark:text-brand-light'
              : 'text-slate-600 dark:text-slate-200',
          ]"
        >
          <span v-if="item.to === '/cart' && cart.count" class="flex items-center gap-2">
            {{ t('cart.title') }}
            <span class="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand dark:bg-brand/20 dark:text-brand-foreground">{{ cart.count }}</span>
          </span>
          <template v-else>
            {{ item.to === '/cart' ? cartLabel : item.name }}
          </template>
        </NuxtLink>
        <LanguageSwitcher />
        <span
          v-if="auth.user"
          class="rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200"
        >
          {{ $t('header.welcome', { name: auth.user.username }) }}
        </span>
      </nav>
      <button
        class="inline-flex items-center rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 md:hidden dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-controls="site-navigation-mobile"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span class="sr-only">Toggle navigation</span>
        <svg
          class="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
    <ClientOnly>
      <Teleport to="body">
        <div
          v-if="isMenuOpen"
          class="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity md:hidden"
          @click="isMenuOpen = false"
        />
      </Teleport>
    </ClientOnly>
    <ClientOnly>
      <Transition name="slide-down">
        <div
          v-if="isMenuOpen"
          id="site-navigation-mobile"
          class="md:hidden"
        >
          <nav
            aria-label="Primary navigation"
            class="absolute inset-x-0 top-full z-50 border-b border-slate-200 bg-white/95 px-4 py-4 text-sm font-medium text-slate-600 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-200"
          >
            <NuxtLink
              v-for="item in navigation"
              :key="item.to"
              :to="item.to"
              class="block rounded-lg px-3 py-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
              {{ item.to === '/cart' ? cartLabel : item.name }}
            </NuxtLink>
            <div class="flex items-center justify-between gap-3 px-3 py-2">
              <LanguageSwitcher />
            </div>
            <span v-if="auth.user" class="block px-3 text-xs text-slate-500 dark:text-slate-300">
              {{ $t('header.welcome', { name: auth.user.username }) }}
            </span>
          </nav>
        </div>
      </Transition>
    </ClientOnly>
  </header>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10%);
}
</style>
