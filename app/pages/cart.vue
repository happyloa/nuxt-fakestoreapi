<script setup lang="ts">
import type { CartReceipt } from "~/composables/useCart"

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { lines, itemCount, subtotal, isCheckingOut, setQuantity, remove, clear, checkout } = useCart()
const { isSignedIn } = useSession()
const checkoutError = ref("")
const receipt = ref<CartReceipt | null>(null)

const decrease = (productId: number) => {
  const line = lines.value.find((item) => item.product.id === productId)
  if (line) setQuantity(productId, line.quantity - 1)
}

const increase = (productId: number) => {
  const line = lines.value.find((item) => item.product.id === productId)
  if (line) setQuantity(productId, line.quantity + 1)
}

const submitOrder = async () => {
  checkoutError.value = ""
  if (!isSignedIn.value) {
    await navigateTo({
      path: localePath("/login"),
      query: { redirect: route.fullPath },
    })
    return
  }

  try {
    receipt.value = await checkout()
  } catch {
    checkoutError.value = t("cart.checkoutError")
  }
}

useSeoMeta({
  title: () => t("cart.title"),
  description: () => t("cart.description"),
})
</script>

<template>
  <div class="space-y-8">
    <header class="max-w-2xl">
      <p class="eyebrow">{{ $t("navigation.cart") }}</p>
      <h1 class="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
        {{ $t("cart.title") }}
      </h1>
      <p class="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
        {{ $t("cart.description") }}
      </p>
    </header>

    <section v-if="receipt" class="success-panel" role="status">
      <p class="eyebrow">{{ $t("cart.successTitle") }}</p>
      <h2 class="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
        {{ $t("cart.successDescription", { id: receipt.id }) }}
      </h2>
      <NuxtLink class="btn-primary mt-5" :to="localePath('/')">
        {{ $t("cart.continueShopping") }}
      </NuxtLink>
    </section>

    <section v-if="!itemCount" class="empty-state">
      <div class="empty-state__icon" aria-hidden="true">□</div>
      <h2>{{ $t("cart.emptyTitle") }}</h2>
      <p>{{ $t("cart.emptyDescription") }}</p>
      <NuxtLink class="btn-primary mt-5" :to="localePath('/')">
        {{ $t("cart.continueShopping") }}
      </NuxtLink>
    </section>

    <div v-else class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
      <ul class="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
        <CartLineItem
          v-for="line in lines"
          :key="line.product.id"
          :line="line"
          @decrease="decrease"
          @increase="increase"
          @remove="remove" />
      </ul>
      <div>
        <p v-if="!isSignedIn" class="notice mb-4" role="status">
          {{ $t("cart.loginRequired") }}
        </p>
        <CartSummary
          :item-count="itemCount"
          :subtotal="subtotal"
          :pending="isCheckingOut"
          @checkout="submitOrder"
          @clear="clear" />
        <p v-if="checkoutError" class="form-error mt-4" role="alert">{{ checkoutError }}</p>
      </div>
    </div>
  </div>
</template>
