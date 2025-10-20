<script setup lang="ts">
import type { FakeStoreUser } from "~/types/fakestore";

const props = defineProps<{
  user: FakeStoreUser;
}>();
</script>

<template>
  <article class="card-surface flex flex-col gap-4 p-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-white">
        {{ props.user.name.firstname }} {{ props.user.name.lastname }}
      </h3>
      <span class="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-light">
        {{ props.user.username }}
      </span>
    </div>
    <p class="text-sm text-slate-300">{{ props.user.email }}</p>
    <div class="text-xs text-slate-400">
      <p>
        {{ props.user.address.number }} {{ props.user.address.street }}, {{ props.user.address.city }}
      </p>
      <p>{{ props.user.address.zipcode }}</p>
      <p class="mt-2 text-slate-400">{{ props.user.phone }}</p>
    </div>
    <NuxtLink
      :to="`/users/${props.user.id}`"
      class="inline-flex items-center justify-center rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-brand hover:text-white"
    >
      {{ $t("users.actions.viewProfile") }}
    </NuxtLink>
  </article>
</template>
