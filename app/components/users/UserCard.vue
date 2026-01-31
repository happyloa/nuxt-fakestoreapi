<script setup lang="ts">
import type { User } from "~/types/fakestore";

defineProps<{ user: User }>();
</script>

<template>
  <BaseCard class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
          {{ user.name.firstname }} {{ user.name.lastname }}
        </h3>
        <p class="text-sm text-slate-500 dark:text-slate-300">
          {{ user.username }} · {{ user.email }}
        </p>
      </div>
      <BaseBadge variant="brand">ID {{ user.id }}</BaseBadge>
    </div>
    <div
      class="grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
      <div>
        <p class="font-semibold text-slate-700 dark:text-slate-200">
          {{ $t("users.card.address") }}
        </p>
        <p>{{ user.address.number }} {{ user.address.street }}</p>
        <p>{{ user.address.city }}, {{ user.address.zipcode }}</p>
      </div>
      <div>
        <p class="font-semibold text-slate-700 dark:text-slate-200">
          {{ $t("users.card.contact") }}
        </p>
        <p>{{ $t("users.card.phone") }}: {{ user.phone }}</p>
        <p>
          {{
            $t("users.card.geo", {
              lat: user.address.geolocation.lat,
              long: user.address.geolocation.long,
            })
          }}
        </p>
      </div>
    </div>
  </BaseCard>
</template>
