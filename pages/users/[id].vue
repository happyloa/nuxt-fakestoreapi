<script setup lang="ts">
import type { Cart, User } from '~/types/fakestore'
import { useFakeStoreClient } from '~/composables/useFakeStoreClient'

const client = useFakeStoreClient()
const { t } = useI18n()
const route = useRoute()

const userId = computed(() => Number(route.params.id))

const { data: user, pending, error } = await useAsyncData<User>(
  `user-${userId.value}`,
  () => client.getUser(userId.value),
  { watch: [userId] },
)

const { data: carts } = await useAsyncData<Cart[]>(
  `user-carts-${userId.value}`,
  () => client.listCartsByUser(userId.value),
  { watch: [userId] },
)

const addressSummary = computed(() => {
  if (!user.value) return ''
  return `${user.value.address.number} ${user.value.address.street}, ${user.value.address.city} ${user.value.address.zipcode}`
})
</script>

<template>
  <section class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
    <div v-if="pending" class="card text-center text-sm text-slate-500">
      {{ t('common.loading') }}
    </div>
    <div v-else-if="error || !user" class="card text-sm text-red-600">
      {{ t('common.error') }}
    </div>
    <div v-else class="space-y-10">
      <header class="card flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-2xl font-semibold text-primary-700">
            {{ user.name.firstname.charAt(0).toUpperCase() }}{{ user.name.lastname.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h1 class="text-2xl font-bold text-slate-900">{{ user.name.firstname }} {{ user.name.lastname }}</h1>
            <p class="text-sm text-slate-500">@{{ user.username }}</p>
          </div>
        </div>
        <NuxtLink to="/users" class="link-button">
          {{ t('users.actions.backToList') }}
        </NuxtLink>
      </header>

      <section class="grid gap-6 md:grid-cols-2">
        <article class="card space-y-3 text-sm text-slate-600">
          <h2 class="text-lg font-semibold text-slate-900">{{ t('userDetail.contact') }}</h2>
          <p>{{ user.email }}</p>
          <p>{{ user.phone }}</p>
          <p>{{ addressSummary }}</p>
        </article>
        <article class="card space-y-3 text-sm text-slate-600">
          <h2 class="text-lg font-semibold text-slate-900">{{ t('userDetail.account') }}</h2>
          <p>{{ t('userDetail.username', { username: user.username }) }}</p>
          <p>
            {{ t('userDetail.geo', {
              lat: user.address.geolocation.lat,
              long: user.address.geolocation.long,
            }) }}
          </p>
        </article>
      </section>

      <section>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-slate-900">{{ t('userDetail.orders') }}</h2>
          <NuxtLink to="/cart" class="text-sm font-semibold text-primary-600 hover:text-primary-700">
            {{ t('userDetail.viewCart') }} →
          </NuxtLink>
        </div>
        <div v-if="!carts?.length" class="card mt-4 text-sm text-slate-500">
          {{ t('userDetail.noOrders') }}
        </div>
        <div v-else class="mt-4 space-y-4">
          <article
            v-for="cart in carts"
            :key="cart.id"
            class="card space-y-3 text-sm text-slate-600"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <p class="font-semibold text-slate-900">{{ t('userDetail.orderId', { id: cart.id }) }}</p>
              <p class="text-xs uppercase tracking-wide text-slate-400">{{ new Date(cart.date).toLocaleDateString() }}</p>
            </div>
            <ul class="space-y-2">
              <li
                v-for="product in cart.products"
                :key="product.productId"
                class="flex items-center justify-between"
              >
                <span>{{ t('userDetail.productLine', product) }}</span>
                <span class="font-semibold">× {{ product.quantity }}</span>
              </li>
            </ul>
          </article>
        </div>
      </section>
    </div>
  </section>
</template>
