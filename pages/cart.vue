<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import { useNotificationsStore } from '~/stores/notifications'

const authStore = useAuthStore()
const cartStore = useCartStore()
const notifications = useNotificationsStore()
const { t } = useI18n()

onMounted(() => {
  if (authStore.user) {
    cartStore.fetchCart(authStore.user.id)
  }
})

watch(
  () => authStore.user?.id,
  (userId) => {
    if (userId) {
      cartStore.fetchCart(userId)
    } else {
      cartStore.clear()
    }
  },
)

const handleClear = () => {
  cartStore.clear({ preserveUser: true })
  notifications.info(t('notifications.cartCleared'), 2000)
}

const handleIncrement = (id: number) => {
  cartStore.increment(id)
  notifications.info(t('notifications.cartUpdated'), 2000)
}

const handleDecrement = (id: number) => {
  cartStore.decrement(id)
  notifications.info(t('notifications.cartUpdated'), 2000)
}

const handleRemove = (id: number) => {
  cartStore.removeItem(id)
  notifications.info(t('notifications.cartItemRemoved'), 2000)
}

useSeoMeta({
  title: 'Cart | Fake Store Dashboard',
  description: 'View and manage your Fake Store API shopping cart.',
  ogTitle: 'Cart | Fake Store Dashboard',
  ogDescription: 'View and manage your Fake Store API shopping cart.',
})
</script>

<template>
  <div class="space-y-8">
    <BaseSectionHeading
      :title="$t('cart.title')"
      :description="$t('cart.subtitle')"
    />

    <BaseAlert v-if="!authStore.user" variant="info">
      {{ $t('cart.loginPrompt') }}
    </BaseAlert>

    <div v-else class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="space-y-4">
        <CartItemsList
          :items="cartStore.items"
          :loading="cartStore.loading"
          @increment="handleIncrement"
          @decrement="handleDecrement"
          @remove="handleRemove"
        />
        <BaseAlert v-if="cartStore.error" variant="error">
          {{ cartStore.error }}
        </BaseAlert>
        <BaseAlert v-if="!cartStore.items.length && !cartStore.loading" variant="warning">
          {{ $t('cart.empty') }}
        </BaseAlert>
      </div>
      <CartSummary
        :total="cartStore.total"
        :item-count="cartStore.count"
        :loading="cartStore.loading"
        @clear="handleClear"
      />
    </div>
  </div>
</template>
