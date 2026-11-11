<script setup lang="ts">
import type { User } from "#shared/types/fakestore";

defineProps<{ user: User }>();
</script>

<template>
  <BaseCard class="space-y-4">
    <header class="flex items-start justify-between gap-4">
      <div>
        <!-- 會員資料來自英文的上游 API；欄位標籤則跟隨介面語系。 -->
        <h2 lang="en" class="text-lg font-bold capitalize tracking-[-0.01em] text-slate-900 dark:text-paper">
          {{ user.name.firstname }} {{ user.name.lastname }}
        </h2>
        <p lang="en" class="text-sm text-slate-500 dark:text-slate-300">
          {{ user.username }} · {{ user.email }}
        </p>
      </div>
      <span class="meta shrink-0 text-slate-500 dark:text-slate-400">{{ catalogNumber(user.id) }}</span>
    </header>
    <dl
      class="grid gap-4 border-t border-rule pt-4 text-sm text-slate-600 sm:grid-cols-2 dark:border-rule-dark dark:text-slate-300">
      <div>
        <dt class="meta mb-1 text-slate-500 dark:text-slate-400">
          {{ $t("users.card.address") }}
        </dt>
        <dd>
          <address lang="en" class="not-italic">
            {{ user.address.number }} {{ user.address.street }}<br />
            {{ user.address.city }}, {{ user.address.zipcode }}
          </address>
        </dd>
      </div>
      <div>
        <dt class="meta mb-1 text-slate-500 dark:text-slate-400">
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
