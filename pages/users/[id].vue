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
      <UserDetailHeader :user="user" />

      <section class="grid gap-6 md:grid-cols-2">
        <UserInfoCard :title="t('userDetail.contact')">
          <p>{{ user.email }}</p>
          <p>{{ user.phone }}</p>
          <p>{{ addressSummary }}</p>
        </UserInfoCard>
        <UserInfoCard :title="t('userDetail.account')">
          <p>{{ t('userDetail.username', { username: user.username }) }}</p>
          <p>
            {{ t('userDetail.geo', {
              lat: user.address.geolocation.lat,
              long: user.address.geolocation.long,
            }) }}
          </p>
        </UserInfoCard>
      </section>

      <UserOrdersSection :carts="carts || []" />
    </div>
  </section>
</template>
