<script setup lang="ts">
import type { User } from '~/types/fakestore'

const props = defineProps<{ user: User }>()
const { t } = useI18n()
</script>

<template>
  <header class="card flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex items-center gap-4">
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-2xl font-semibold text-primary-700">
        {{ props.user.name.firstname.charAt(0).toUpperCase() }}{{ props.user.name.lastname.charAt(0).toUpperCase() }}
      </div>
      <div>
        <h1 class="text-2xl font-bold text-slate-900">{{ props.user.name.firstname }} {{ props.user.name.lastname }}</h1>
        <p class="text-sm text-slate-500">@{{ props.user.username }}</p>
      </div>
    </div>
    <NuxtLink to="/users" class="link-button">
      {{ t('users.actions.backToList') }}
    </NuxtLink>
  </header>
</template>
