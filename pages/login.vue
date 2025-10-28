<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import { useNotificationsStore } from '~/stores/notifications'

const authStore = useAuthStore()
const cartStore = useCartStore()
const notifications = useNotificationsStore()
const { t } = useI18n()

const handleSubmit = async ({ username, password }: { username: string; password: string }) => {
  await authStore.login(username, password)
  if (authStore.user) {
    cartStore.fetchCart(authStore.user.id)
    notifications.success(
      t('notifications.loggedIn', { name: authStore.user.username }),
    )
  }
}

const handleLogout = () => {
  authStore.logout()
  notifications.info(t('notifications.loggedOut'), 2000)
}

useSeoMeta({
  title: 'Login | Fake Store Dashboard',
  description: 'Authenticate with the Fake Store API to sync your shopping cart.',
  ogTitle: 'Login | Fake Store Dashboard',
  ogDescription: 'Authenticate with the Fake Store API to sync your shopping cart.',
})
</script>

<template>
  <div class="flex flex-col items-center gap-6">
    <LoginForm :loading="authStore.loading" :error="authStore.error" @submit="handleSubmit" />
    <BaseAlert v-if="authStore.user" variant="success">
      {{ $t('auth.login.success', { name: authStore.user.username }) }}
      <BaseButton class="mt-3" variant="outline" @click="handleLogout">
        {{ $t('auth.login.logout') }}
      </BaseButton>
    </BaseAlert>
  </div>
</template>
