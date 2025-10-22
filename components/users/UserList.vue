<script setup lang="ts">
import type { User } from '~/types/fakestore'

const props = defineProps({
  users: {
    type: Array as () => User[],
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  search: {
    type: String,
    default: '',
  },
})

const emit = defineEmits<{ (e: 'update:search', value: string): void }>()
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <BaseSectionHeading
        :title="$t('users.list.title')"
        :description="$t('users.list.description')"
      />
      <BaseInput
        :model-value="search"
        class="sm:w-64"
        :label="$t('users.list.searchLabel')"
        :placeholder="$t('users.list.searchPlaceholder')"
        @update:model-value="emit('update:search', $event as string)"
      />
    </div>
    <div v-if="loading" class="grid gap-4 sm:grid-cols-2">
      <BaseCard v-for="index in 4" :key="index" class="h-40 animate-pulse bg-slate-100"></BaseCard>
    </div>
    <BaseAlert v-else-if="error" variant="error">
      {{ error }}
    </BaseAlert>
    <div v-else-if="!users.length" class="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <p class="text-sm text-slate-600">{{ $t('users.list.empty') }}</p>
    </div>
    <div v-else class="grid gap-6 sm:grid-cols-2">
      <UserCard v-for="user in users" :key="user.id" :user="user" />
    </div>
  </div>
</template>
