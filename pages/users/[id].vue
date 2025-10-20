<script setup lang="ts">
import { useFakeStoreApi } from "~/composables/useFakeStoreApi";
import type { CartSnapshot, FakeStoreUser } from "~/types/fakestore";

const route = useRoute();
const api = useFakeStoreApi();

const userId = computed(() => Number(route.params.id));

const { data: user, pending, error } = await useAsyncData<FakeStoreUser>(
  () => `user:${userId.value}`,
  () => api.getUser(userId.value),
  { watch: [userId] },
);

const { data: carts, pending: cartsPending } = await useAsyncData<CartSnapshot[]>(
  () => `user:${userId.value}:carts`,
  () => api.listCartsForUser(userId.value),
  { watch: [userId] },
);

watchEffect(() => {
  if (user.value) {
    useSeoMeta({
      title: `${user.value.name.firstname} ${user.value.name.lastname} | Nuxt Fake Store`,
      description: user.value.email,
    });
  }
});
</script>

<template>
  <div class="space-y-8">
    <NuxtLink to="/users" class="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
      ← {{ $t("users.back") }}
    </NuxtLink>

    <div v-if="pending" class="card-surface h-64 animate-pulse bg-slate-900/40"></div>
    <UserDetail v-else-if="user" :user="user" />
    <p v-else class="text-sm text-rose-400">
      {{ error?.message || $t("users.notFound") }}
    </p>

    <div v-if="user">
      <div v-if="cartsPending" class="card-surface h-48 animate-pulse bg-slate-900/40"></div>
      <UserCartHistory v-else :carts="carts ?? []" />
    </div>
  </div>
</template>
