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
    <header class="flex flex-col gap-6 border-b border-slate-200 pb-8 md:flex-row md:items-center md:justify-between">
      <div class="space-y-2">
        <p class="text-sm font-semibold uppercase tracking-wide text-primary-600">{{ t('users.badge') }}</p>
        <h1 class="text-3xl font-bold text-slate-900">{{ t('users.title') }}</h1>
        <p class="text-slate-600">{{ t('users.subtitle') }}</p>
      </div>
      <NuxtLink to="/products" class="text-sm font-semibold text-primary-600 hover:text-primary-700">
        {{ t('users.actions.exploreProducts') }} →
      </NuxtLink>
    </header>

    <div class="mt-8 flex flex-wrap gap-4">
      <label class="flex-1 min-w-[220px] space-y-2">
        <span class="text-sm font-semibold text-slate-700">{{ t('users.filters.search') }}</span>
        <input
          v-model="search"
          type="search"
          class="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          :placeholder="t('users.filters.searchPlaceholder')"
        />
      </label>
      <label class="w-full max-w-[220px] space-y-2">
        <span class="text-sm font-semibold text-slate-700">{{ t('users.filters.sort') }}</span>
        <select
          v-model="sort"
          class="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
        >
          <option value="asc">{{ t('users.filters.asc') }}</option>
          <option value="desc">{{ t('users.filters.desc') }}</option>
        </select>
      </label>
    </div>

    <div class="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="user in filteredUsers"
        :key="user.id"
        class="card flex flex-col gap-4"
      >
        <div class="flex items-center gap-4">
          <div class="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700">
            {{ user.name.firstname.charAt(0).toUpperCase() }}{{ user.name.lastname.charAt(0).toUpperCase() }}
          </div>
          <div>
            <p class="text-lg font-semibold text-slate-900">{{ user.name.firstname }} {{ user.name.lastname }}</p>
            <p class="text-sm text-slate-500">@{{ user.username }}</p>
          </div>
        </div>
        <div class="space-y-2 text-sm text-slate-600">
          <p>{{ user.email }}</p>
          <p>{{ user.phone }}</p>
          <p>
            {{ user.address.number }} {{ user.address.street }}, {{ user.address.city }}
          </p>
        </div>
        <NuxtLink :to="`/users/${user.id}`" class="link-button w-full justify-center">
          {{ t('users.actions.viewProfile') }}
        </NuxtLink>
      </article>
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
