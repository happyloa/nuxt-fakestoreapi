<script setup lang="ts">
import { useRoute } from '#imports'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const auth = useAuthStore()
const cart = useCartStore()
const { t } = useI18n()
const isMenuOpen = ref(false)

const navigation = computed(() => [
  { name: t('navigation.products'), to: '/' },
  { name: t('navigation.newProduct'), to: '/products/new' },
  { name: t('navigation.cart'), to: '/cart' },
  { name: t('navigation.users'), to: '/users' },
  { name: t('navigation.apiPlayground'), to: '/api' },
  { name: t('navigation.login'), to: '/login' },
])

const cartLabel = computed(() =>
  cart.count ? t('cart.summary.items', { count: cart.count }) : t('cart.title'),
)

const isActive = (path: string) => route.path === path

watch(
  () => route.path,
  () => {
    isMenuOpen.value = false
  },
)
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-slate-200/40 bg-white/80 backdrop-blur transition-colors duration-200 dark:border-slate-800/60 dark:bg-slate-950/80">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="flex items-center gap-2 text-lg font-bold text-brand dark:text-brand-light">
        <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white shadow-lg shadow-brand/30">FS</span>
        <span>Fake Store Dashboard</span>
      </NuxtLink>
      <nav class="hidden items-center gap-4 text-sm font-medium text-slate-600 transition-colors duration-200 md:flex dark:text-slate-200">
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
        <ThemeToggle />
        <span
          v-if="auth.user"
          class="rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200"
        >
          {{ $t('header.welcome', { name: auth.user.username }) }}
        </span>
      </nav>
      <button
        class="inline-flex items-center rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 md:hidden dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
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
    <div v-if="isMenuOpen" class="border-t border-slate-200 bg-white transition-colors duration-200 md:hidden dark:border-slate-800 dark:bg-slate-900">
      <nav class="mx-auto max-w-6xl space-y-2 px-4 py-4 text-sm font-medium text-slate-600 dark:text-slate-200">
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
          <ThemeToggle />
        </div>
        <span v-if="auth.user" class="block px-3 text-xs text-slate-500 dark:text-slate-300">
          {{ $t('header.welcome', { name: auth.user.username }) }}
        </span>
      </nav>
    </div>
  </header>
</template>
