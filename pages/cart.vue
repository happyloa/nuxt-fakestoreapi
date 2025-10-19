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
    <CartHeader />

    <CartStatusMessage :message="checkoutState.message" :type="checkoutState.type" />

    <div class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <CartItemsList
        :items="cart.items"
        @update-quantity="updateQuantity"
        @remove="removeItem"
      />

      <aside class="space-y-6">
        <CartSummaryCard
          :subtotal="subtotal"
          :estimated-tax="estimatedTax"
          :grand-total="grandTotal"
          :loading="checkoutState.loading"
          :disabled="checkoutState.loading || !cart.items.length"
          @checkout="checkout"
        />
        <CartHelpCard />
      </aside>
    </div>
  </section>
</template>
