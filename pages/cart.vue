<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'

const cart = useCartStore()
const auth = useAuthStore()
const { t } = useI18n()

const checkoutState = reactive({
  loading: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'info',
})

const subtotal = computed(() => cart.total)
const taxRate = 0.07
const estimatedTax = computed(() => subtotal.value * taxRate)
const grandTotal = computed(() => subtotal.value + estimatedTax.value)

const updateQuantity = (id: number, value: string) => {
  const parsed = Number(value)
  if (Number.isFinite(parsed) && parsed > 0) {
    cart.updateQuantity(id, parsed)
  }
}

const removeItem = (id: number) => {
  cart.removeItem(id)
}

const checkout = async () => {
  checkoutState.loading = true
  checkoutState.type = 'info'
  checkoutState.message = t('cart.messages.syncing')
  try {
    if (!auth.user) {
      checkoutState.type = 'error'
      checkoutState.message = t('cart.messages.loginRequired')
      return
    }
    await cart.syncCart()
    checkoutState.type = 'success'
    checkoutState.message = t('cart.messages.synced')
  } catch (error: any) {
    checkoutState.type = 'error'
    checkoutState.message = error?.message || t('cart.messages.failed')
  } finally {
    checkoutState.loading = false
  }
}

watch(
  () => auth.user?.id,
  (id) => {
    if (id) {
      cart.fetchCart(id)
    }
  },
  { immediate: true },
)
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
    <header class="flex flex-col gap-4 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div class="space-y-2">
        <p class="text-sm font-semibold uppercase tracking-wide text-primary-600">{{ t('cart.badge') }}</p>
        <h1 class="text-3xl font-bold text-slate-900">{{ t('cart.title') }}</h1>
        <p class="text-slate-600">{{ t('cart.subtitle') }}</p>
      </div>
      <NuxtLink to="/products" class="link-button">
        {{ t('cart.actions.continueShopping') }}
      </NuxtLink>
    </header>

    <div
      v-if="checkoutState.message"
      class="mt-6 rounded-3xl border px-6 py-4 text-sm font-semibold"
      :class="{
        'border-primary-200 bg-primary-50 text-primary-700': checkoutState.type === 'success',
        'border-red-200 bg-red-50 text-red-600': checkoutState.type === 'error',
        'border-slate-200 bg-white text-slate-600': checkoutState.type === 'info',
      }"
    >
      {{ checkoutState.message }}
    </div>

    <div class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div class="space-y-4">
        <article
          v-for="item in cart.items"
          :key="item.id"
          class="card flex flex-col gap-4 md:flex-row md:items-center"
        >
          <img :src="item.image" :alt="item.title" class="h-32 w-32 rounded-2xl border border-slate-100 bg-slate-50 object-contain" loading="lazy" />
          <div class="flex-1 space-y-2">
            <h2 class="text-lg font-semibold text-slate-900">{{ item.title }}</h2>
            <p class="text-sm text-slate-500">{{ t('cart.itemPrice', { price: item.price.toFixed(2) }) }}</p>
            <div class="flex flex-wrap items-center gap-3">
              <label class="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600">
                {{ t('cart.quantity') }}
                <input
                  :value="item.quantity"
                  type="number"
                  min="1"
                  class="w-16 rounded-xl border border-slate-200 px-2 py-1 text-center text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  @input="updateQuantity(item.id, ($event.target as HTMLInputElement).value)"
                />
              </label>
              <button
                type="button"
                class="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                @click="removeItem(item.id)"
              >
                {{ t('cart.actions.remove') }}
              </button>
            </div>
          </div>
          <div class="text-right text-lg font-semibold text-slate-900">${{ (item.price * item.quantity).toFixed(2) }}</div>
        </article>

        <div v-if="!cart.items.length" class="card text-center text-sm text-slate-500">
          {{ t('cart.empty') }}
        </div>
      </div>

      <aside class="space-y-6">
        <div class="card space-y-4">
          <h2 class="text-xl font-semibold text-slate-900">{{ t('cart.summary.title') }}</h2>
          <div class="space-y-3 text-sm text-slate-600">
            <div class="flex items-center justify-between">
              <span>{{ t('cart.summary.subtotal') }}</span>
              <span class="font-semibold text-slate-900">${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span>{{ t('cart.summary.tax') }}</span>
              <span class="font-semibold text-slate-900">${{ estimatedTax.toFixed(2) }}</span>
            </div>
          </div>
          <div class="flex items-center justify-between border-t border-dashed border-slate-200 pt-3 text-lg font-bold text-slate-900">
            <span>{{ t('cart.summary.total') }}</span>
            <span>${{ grandTotal.toFixed(2) }}</span>
          </div>
          <button
            type="button"
            class="w-full rounded-full bg-primary-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="checkoutState.loading || !cart.items.length"
            @click="checkout"
          >
            <span v-if="checkoutState.loading" class="flex items-center justify-center gap-2">
              <span class="h-4 w-4 animate-spin rounded-full border-2 border-primary-200 border-t-white" />
              {{ t('cart.actions.processing') }}
            </span>
            <span v-else>
              {{ t('cart.actions.checkout') }}
            </span>
          </button>
          <p class="text-xs text-slate-400">{{ t('cart.summary.note') }}</p>
        </div>

        <div class="card bg-slate-900 text-white">
          <h3 class="text-lg font-semibold">{{ t('cart.help.title') }}</h3>
          <p class="mt-2 text-sm text-slate-200">{{ t('cart.help.description') }}</p>
          <NuxtLink to="/users" class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
            {{ t('cart.help.action') }}
          </NuxtLink>
        </div>
      </aside>
    </div>
  </section>
</template>
