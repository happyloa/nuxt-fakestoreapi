<script setup lang="ts">
import { useFakeStoreApi } from "~/composables/useFakeStoreApi";
import type { FakeStoreUser } from "~/types/fakestore";

useSeoMeta({
  title: "Users | Nuxt Fake Store",
  ogTitle: "Users | Nuxt Fake Store",
  description: "Browse Fake Store API users and inspect their details.",
  ogDescription: "Browse Fake Store API users and inspect their details.",
});

const api = useFakeStoreApi();
const { data: users, pending } = await useAsyncData<FakeStoreUser[]>(
  "users:list",
  () => api.listUsers(),
);
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="section-title">
        {{ $t("users.title") }}
      </h1>
      <p class="mt-2 text-sm text-slate-400">
        {{ $t("users.subtitle") }}
      </p>
    </div>

    <div v-if="pending" class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      <div v-for="placeholder in 6" :key="placeholder" class="card-surface h-48 animate-pulse bg-slate-900/40"></div>
    </div>
    <div v-else-if="users?.length" class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      <UserCard v-for="user in users" :key="user.id" :user="user" />
    </div>
    <p v-else class="text-sm text-slate-400">
      {{ $t("users.empty") }}
    </p>
  </div>
</template>
