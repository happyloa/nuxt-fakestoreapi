<script setup lang="ts">
import type { User } from '~/types/fakestore'

const props = defineProps<{
  user: User
}>()

const { t } = useI18n()
</script>

<template>
  <article class="card flex flex-col gap-4">
    <div class="flex items-center gap-4">
      <div class="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700">
        {{ props.user.name.firstname.charAt(0).toUpperCase() }}{{ props.user.name.lastname.charAt(0).toUpperCase() }}
      </div>
      <div>
        <p class="text-lg font-semibold text-slate-900">{{ props.user.name.firstname }} {{ props.user.name.lastname }}</p>
        <p class="text-sm text-slate-500">@{{ props.user.username }}</p>
      </div>
    </div>
    <div class="space-y-2 text-sm text-slate-600">
      <p>{{ props.user.email }}</p>
      <p>{{ props.user.phone }}</p>
      <p>
        {{ props.user.address.number }} {{ props.user.address.street }}, {{ props.user.address.city }}
      </p>
    </div>
    <NuxtLink :to="`/users/${props.user.id}`" class="link-button w-full justify-center">
      {{ t('users.actions.viewProfile') }}
    </NuxtLink>
  </article>
</template>
