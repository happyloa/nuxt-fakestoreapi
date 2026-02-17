<script setup lang="ts">
import type { User } from "~/types/fakestore";

defineProps<{ user: User }>();
</script>

<template>
  <BaseCard as="article" class="space-y-4">
    <header class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
          {{ user.name.firstname }} {{ user.name.lastname }}
        </h3>
        <p class="text-sm text-slate-500 dark:text-slate-300">
          {{ user.username }} · {{ user.email }}
        </p>
      </div>
      <BaseBadge variant="brand">ID {{ user.id }}</BaseBadge>
    </header>
    <dl
      class="grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
      <div>
        <dt class="font-semibold text-slate-700 dark:text-slate-200">
          {{ $t("users.card.address") }}
        </dt>
        <dd>
          <address class="not-italic">
            {{ user.address.number }} {{ user.address.street }}<br />
            {{ user.address.city }}, {{ user.address.zipcode }}
          </address>
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-slate-700 dark:text-slate-200">
          {{ $t("users.card.contact") }}
        </dt>
        <dd>{{ $t("users.card.phone") }}: {{ user.phone }}</dd>
        <dd>
          {{
            $t("users.card.geo", {
              lat: user.address.geolocation.lat,
              long: user.address.geolocation.long,
            })
          }}
        </dd>
      </div>
    </dl>
  </BaseCard>
</template>
