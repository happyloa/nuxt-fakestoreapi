<script setup lang="ts">
const props = defineProps<{
  search: string
  sort: 'asc' | 'desc'
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:sort', value: 'asc' | 'desc'): void
}>()

const { t } = useI18n()
</script>

<template>
  <div class="mt-8 flex flex-wrap gap-4">
    <label class="flex-1 min-w-[220px] space-y-2">
      <span class="text-sm font-semibold text-slate-700">{{ t('users.filters.search') }}</span>
      <input
        :value="props.search"
        type="search"
        class="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
        :placeholder="t('users.filters.searchPlaceholder')"
        @input="emit('update:search', ($event.target as HTMLInputElement).value)"
      />
    </label>
    <label class="w-full max-w-[220px] space-y-2">
      <span class="text-sm font-semibold text-slate-700">{{ t('users.filters.sort') }}</span>
      <select
        :value="props.sort"
        class="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
        @change="emit('update:sort', ($event.target as HTMLSelectElement).value as 'asc' | 'desc')"
      >
        <option value="asc">{{ t('users.filters.asc') }}</option>
        <option value="desc">{{ t('users.filters.desc') }}</option>
      </select>
    </label>
  </div>
</template>
