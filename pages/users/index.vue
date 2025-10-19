<script setup lang="ts">
import type { User } from '~/types/fakestore'
import { useFakeStoreClient } from '~/composables/useFakeStoreClient'

const client = useFakeStoreClient()
const { t } = useI18n()

const search = ref('')
const sort = ref<'asc' | 'desc'>('asc')

const { data: users, pending, error } = await useAsyncData<User[]>(
  'users',
  () => client.listUsers(),
)

const filteredUsers = computed(() => {
  const list = users.value ?? []
  const query = search.value.trim().toLowerCase()
  const sorted = [...list].sort((a, b) => {
    const aName = `${a.name.firstname} ${a.name.lastname}`.toLowerCase()
    const bName = `${b.name.firstname} ${b.name.lastname}`.toLowerCase()
    return sort.value === 'asc' ? aName.localeCompare(bName) : bName.localeCompare(aName)
  })
  if (!query) return sorted
  return sorted.filter((user) =>
    `${user.name.firstname} ${user.name.lastname}`.toLowerCase().includes(query) ||
    user.username.toLowerCase().includes(query),
  )
})
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
    <UserListHeader />

    <UserFilters
      :search="search"
      :sort="sort"
      @update:search="search = $event"
      @update:sort="sort = $event"
    />

    <div class="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <UserCard v-for="user in filteredUsers" :key="user.id" :user="user" />
    </div>

    <div v-if="pending" class="mt-8 card text-sm text-slate-500">
      {{ t('common.loading') }}
    </div>
    <div v-if="error" class="mt-8 card bg-red-50 text-sm text-red-600">
      {{ t('common.error') }}
    </div>
    <div v-if="!pending && !filteredUsers.length" class="mt-8 card text-sm text-slate-500">
      {{ t('users.empty') }}
    </div>
  </section>
</template>
