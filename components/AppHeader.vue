<script setup lang="ts">
import { useRoute } from '#vue-router'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const cart = useCartStore()
const auth = useAuthStore()
const { locale, locales, setLocale, t } = useI18n()

const isMenuOpen = ref(false)
const availableLocales = computed(() => locales.value.filter((l) => !l.code.includes('-')))

const navigation = computed(() => [
  { label: t('navigation.home'), to: '/' },
  { label: t('navigation.products'), to: '/products' },
  { label: t('navigation.cart'), to: '/cart', badge: cart.count },
  { label: t('navigation.users'), to: '/users' },
  { label: t('navigation.addProduct'), to: '/products/new' },
])

const isActive = (path: string) => route.path === path

const switchLocale = async (code: string) => {
  if (code === locale.value) return
  await setLocale(code)
  isMenuOpen.value = false
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="flex items-center gap-3 text-xl font-semibold text-primary-700">
        <span class="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white shadow-md">
          FS
        </span>
        <span>{{ t('app.title') }}</span>
      </NuxtLink>

      <nav class="hidden items-center gap-6 text-sm font-medium md:flex">
        <NuxtLink
          v-for="link in navigation"
          :key="link.to"
          :to="link.to"
          class="relative rounded-full px-4 py-2 transition"
          :class="[
            isActive(link.to)
              ? 'bg-primary-50 text-primary-700'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
          ]"
        >
          <span>{{ link.label }}</span>
          <span
            v-if="link.badge"
            class="absolute -right-3 -top-2 inline-flex min-w-[1.75rem] items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-white"
          >
            {{ link.badge }}
          </span>
        </NuxtLink>
      </nav>

      <div class="hidden items-center gap-3 md:flex">
        <div class="flex items-center gap-2 rounded-full px-2 py-1">
          <span class="text-xs font-semibold text-slate-500">{{ t('navigation.language') }}</span>
          <select
            class="bg-transparent text-sm font-semibold text-primary-700 focus:outline-none"
            :value="locale"
            @change="switchLocale(($event.target as HTMLSelectElement).value)"
          >
            <option v-for="item in availableLocales" :key="item.code" :value="item.code">
              {{ item.name || item.code.toUpperCase() }}
            </option>
          </select>
        </div>

        <div v-if="auth.user" class="flex items-center gap-3 rounded-full bg-slate-100 px-3 py-1.5">
          <span class="text-sm font-semibold text-slate-700">{{ auth.user.username }}</span>
          <button
            type="button"
            class="text-xs font-semibold text-primary-600 hover:text-primary-700"
            @click="auth.logout()"
          >
            {{ t('actions.logout') }}
          </button>
        </div>
        <NuxtLink v-else to="/login" class="link-button text-sm">
          {{ t('actions.login') }}
        </NuxtLink>
      </div>

      <button
        type="button"
        class="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 md:hidden"
        @click="toggleMenu"
        aria-label="Toggle navigation"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <Transition name="fade">
      <div
        v-if="isMenuOpen"
        class="md:hidden"
      >
        <div class="space-y-1 border-t border-slate-200 bg-white px-4 py-4">
          <NuxtLink
            v-for="link in navigation"
            :key="link.to"
            :to="link.to"
            class="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition"
            :class="[
              isActive(link.to)
                ? 'bg-primary-50 text-primary-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            ]"
            @click="isMenuOpen = false"
          >
            <span>{{ link.label }}</span>
            <span
              v-if="link.badge"
              class="ml-3 inline-flex min-w-[1.75rem] items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-white"
            >
              {{ link.badge }}
            </span>
          </NuxtLink>

          <div class="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <span class="text-sm font-semibold text-slate-600">{{ t('navigation.language') }}</span>
            <select
              class="rounded-lg bg-transparent px-1.5 py-1 text-sm font-semibold text-primary-700 focus:outline-none"
              :value="locale"
              @change="switchLocale(($event.target as HTMLSelectElement).value)"
            >
              <option v-for="item in availableLocales" :key="item.code" :value="item.code">
                {{ item.name || item.code.toUpperCase() }}
              </option>
            </select>
          </div>

          <div class="flex justify-end">
            <button
              v-if="auth.user"
              type="button"
              class="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              @click="auth.logout(); isMenuOpen = false"
            >
              {{ t('actions.logout') }}
            </button>
            <NuxtLink
              v-else
              to="/login"
              class="w-full rounded-xl bg-primary-600 px-4 py-2 text-center text-sm font-semibold text-white"
              @click="isMenuOpen = false"
            >
              {{ t('actions.login') }}
            </NuxtLink>
          </div>
        </div>
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
