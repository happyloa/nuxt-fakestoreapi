<script setup lang="ts">
import type { User } from "~/types/fakestore";

interface Props {
  users?: User[];
  loading?: boolean;
  error?: string;
  search?: string;
}

const props = withDefaults(defineProps<Props>(), {
  users: () => [],
  loading: false,
  error: "",
  search: "",
});

const emit = defineEmits<{ (e: "update:search", value: string): void }>();
</script>

<template>
  <section class="space-y-6" aria-labelledby="user-list-heading">
    <div
      class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <BaseSectionHeading
        id="user-list-heading"
        :title="$t('users.list.title')"
        :description="$t('users.list.description')" />
      <BaseInput
        :model-value="search"
        class="sm:w-64"
        :label="$t('users.list.searchLabel')"
        :placeholder="$t('users.list.searchPlaceholder')"
        @update:model-value="emit('update:search', $event as string)" />
    </div>
    <div v-if="loading" class="grid gap-4 sm:grid-cols-2" aria-busy="true">
      <BaseCard
        v-for="index in 4"
        :key="index"
        class="h-40 animate-pulse bg-slate-100 dark:bg-slate-800"></BaseCard>
    </div>
    <BaseAlert v-else-if="error" variant="error">
      {{ error }}
    </BaseAlert>
    <p
      v-else-if="!users.length"
      class="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-sm text-slate-600 transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
      {{ $t("users.list.empty") }}
    </p>
    <ul v-else class="grid gap-6 sm:grid-cols-2">
      <li v-for="user in users" :key="user.id">
        <UserCard :user="user" />
      </li>
    </ul>
  </section>
</template>
