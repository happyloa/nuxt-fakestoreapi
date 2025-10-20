<script setup lang="ts">
import type { FakeStoreUser } from "~/types/fakestore";

const props = defineProps<{
  user: FakeStoreUser;
}>();
</script>

<template>
  <section class="card-surface space-y-6 p-8">
    <div>
      <h1 class="text-3xl font-bold text-white">
        {{ props.user.name.firstname }} {{ props.user.name.lastname }}
      </h1>
      <p class="mt-2 text-sm text-slate-400">{{ props.user.email }}</p>
    </div>

    <div class="grid gap-6 sm:grid-cols-2">
      <div class="space-y-2">
        <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-400">
          {{ $t("users.detail.contact") }}
        </h2>
        <p class="text-sm text-slate-200">{{ props.user.phone }}</p>
        <p class="text-sm text-slate-400">{{ props.user.username }}</p>
      </div>
      <div class="space-y-2">
        <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-400">
          {{ $t("users.detail.address") }}
        </h2>
        <p class="text-sm text-slate-200">
          {{ props.user.address.number }} {{ props.user.address.street }}
        </p>
        <p class="text-sm text-slate-200">
          {{ props.user.address.city }} {{ props.user.address.zipcode }}
        </p>
        <p class="text-xs text-slate-500">
          {{ $t("users.detail.coordinates", { lat: props.user.address.geolocation.lat, long: props.user.address.geolocation.long }) }}
        </p>
      </div>
    </div>
  </section>
</template>
