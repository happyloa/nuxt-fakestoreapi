<script setup lang="ts">
const props = defineProps<{
  search: string
  category: string
  sort: 'asc' | 'desc'
  categories: string[]
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:category', value: string): void
  (e: 'update:sort', value: 'asc' | 'desc'): void
}>()

const { t } = useI18n()
</script>

<template>
  <aside class="space-y-6 rounded-3xl border border-slate-200 bg-white p-6">
    <div class="space-y-3">
      <label for="product-search" class="block text-sm font-semibold text-slate-700">
        {{ t('products.filters.search') }}
      </label>
      <input
        id="product-search"
        :value="props.search"
        type="search"
        class="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
        :placeholder="t('products.filters.searchPlaceholder')"
        @input="emit('update:search', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="space-y-3">
      <p class="text-sm font-semibold text-slate-700">{{ t('products.filters.category') }}</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="option in props.categories"
          :key="option"
          type="button"
          class="rounded-full px-4 py-2 text-sm font-semibold capitalize transition"
          :class="[
            props.category === option
              ? 'bg-primary-600 text-white shadow'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
          ]"
          @click="emit('update:category', option)"
        >
          {{ option === 'all' ? t('products.filters.all') : option }}
        </button>
      </div>
    </div>

    <div class="space-y-3">
      <label class="block text-sm font-semibold text-slate-700">{{ t('products.filters.sort') }}</label>
      <select
        :value="props.sort"
        class="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
        @change="emit('update:sort', ($event.target as HTMLSelectElement).value as 'asc' | 'desc')"
      >
        <option value="asc">{{ t('products.filters.sortAsc') }}</option>
        <option value="desc">{{ t('products.filters.sortDesc') }}</option>
      </select>
    </div>
  </aside>
</template>
