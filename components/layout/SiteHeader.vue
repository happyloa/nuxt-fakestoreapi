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

const navigation = [
  { name: 'Products', to: '/' },
  { name: 'New Product', to: '/products/new' },
  { name: 'Cart', to: '/cart' },
  { name: 'Users', to: '/users' },
  { name: 'Login', to: '/login' },
]

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
  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="flex items-center gap-2 text-lg font-bold text-brand">
        <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white">FS</span>
        <span>Fake Store Dashboard</span>
      </NuxtLink>
      <nav class="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
        <NuxtLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          :class="[
            'transition hover:text-brand',
            isActive(item.to)
              ? 'text-brand'
              : 'text-slate-600',
          ]"
        >
          <span v-if="item.to === '/cart' && cart.count" class="flex items-center gap-2">
            {{ t('cart.title') }}
            <span class="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">{{ cart.count }}</span>
          </span>
          <template v-else>
            {{ item.to === '/cart' ? cartLabel : item.name }}
          </template>
        </NuxtLink>
        <LanguageSwitcher />
        <button
          v-if="auth.user"
          class="rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold text-slate-600"
        >
          {{ $t('header.welcome', { name: auth.user.username }) }}
        </button>
      </nav>
      <button
        class="inline-flex items-center rounded-lg border border-slate-200 p-2 text-slate-600 md:hidden"
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
    <div v-if="isMenuOpen" class="border-t border-slate-200 bg-white md:hidden">
      <nav class="mx-auto max-w-6xl space-y-1 px-4 py-4 text-sm font-medium text-slate-600">
        <NuxtLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          class="block rounded-lg px-3 py-2 hover:bg-slate-100"
        >
          {{ item.to === '/cart' ? cartLabel : item.name }}
        </NuxtLink>
        <div class="flex items-center justify-between px-3 py-2">
          <LanguageSwitcher />
          <span v-if="auth.user" class="text-xs text-slate-500">
            {{ $t('header.welcome', { name: auth.user.username }) }}
          </span>
        </div>
      </nav>
    </div>
  </header>
</template>
