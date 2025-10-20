<script setup lang="ts">
const props = defineProps<{
  categories: string[];
  selectedCategory: string;
  search: string;
  sort: string;
}>();

const emit = defineEmits<{
  (event: "update:category", value: string): void;
  (event: "update:search", value: string): void;
  (event: "update:sort", value: string): void;
}>();
</script>

<template>
  <aside class="card-surface sticky top-28 space-y-5 p-6">
    <div>
      <h2 class="section-title text-xl">
        {{ $t("products.filters.title") }}
      </h2>
      <p class="mt-2 text-xs text-slate-400">
        {{ $t("products.filters.subtitle") }}
      </p>
    </div>

    <label class="block text-xs font-semibold uppercase tracking-wide text-slate-400">
      {{ $t("products.filters.search") }}
      <input
        :value="props.search"
        type="search"
        class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 focus:border-brand focus:outline-none"
        :placeholder="$t('products.filters.searchPlaceholder')"
        @input="emit('update:search', ($event.target as HTMLInputElement).value)"
      />
    </label>

    <label class="block text-xs font-semibold uppercase tracking-wide text-slate-400">
      {{ $t("products.filters.category") }}
      <select
        :value="props.selectedCategory"
        class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 focus:border-brand focus:outline-none"
        @change="emit('update:category', ($event.target as HTMLSelectElement).value)"
      >
        <option value="all">{{ $t("products.filters.all") }}</option>
        <option v-for="category in props.categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </label>

    <label class="block text-xs font-semibold uppercase tracking-wide text-slate-400">
      {{ $t("products.filters.sort") }}
      <select
        :value="props.sort"
        class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 focus:border-brand focus:outline-none"
        @change="emit('update:sort', ($event.target as HTMLSelectElement).value)"
      >
        <option value="asc">{{ $t("products.filters.sortAsc") }}</option>
        <option value="desc">{{ $t("products.filters.sortDesc") }}</option>
      </select>
    </label>
  </aside>
</template>
