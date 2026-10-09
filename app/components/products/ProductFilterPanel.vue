<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    categories?: string[];
    selectedCategory?: string;
    sortOrder?: "asc" | "desc";
    searchQuery?: string;
  }>(),
  {
    categories: () => [],
    selectedCategory: "all",
    sortOrder: "asc",
    searchQuery: "",
  },
);
const emit = defineEmits<{
  (e: "update:category", value: string): void;
  (e: "update:sort", value: "asc" | "desc"): void;
  (e: "update:search", value: string): void;
  (e: "refresh"): void;
}>();
const { t } = useI18n();
const categoryLabel = useCategoryLabel();
const categories = computed(() => [
  { value: "all", label: t("products.filters.allCategories") },
  ...props.categories.map((value) => ({ value, label: categoryLabel(value) })),
]);
const sortOptions = computed(() => [
  { label: t("products.filters.sortAsc"), value: "asc" },
  { label: t("products.filters.sortDesc"), value: "desc" },
]);
</script>
<template>
  <div class="space-y-5 border-b border-slate-200 pb-6 dark:border-slate-800">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div class="relative flex-1 sm:max-w-md">
        <BaseInput
          :model-value="searchQuery"
          type="search"
          :label="t('products.filters.searchLabel')"
          :placeholder="t('products.filters.searchPlaceholder')"
          @update:model-value="emit('update:search', $event as string)"
        />
      </div>
      <div class="sm:ml-auto sm:w-56">
        <BaseSelect
          :model-value="sortOrder"
          :label="t('products.filters.sortLabel')"
          :options="sortOptions"
          @update:model-value="emit('update:sort', $event as 'asc' | 'desc')"
        />
      </div>
    </div>
    <div
      class="flex flex-wrap items-center gap-2"
      role="group"
      :aria-label="t('products.filters.categoryLabel')"
    >
      <button
        v-for="category in categories"
        :key="category.value"
        type="button"
        :aria-pressed="selectedCategory === category.value"
        class="min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition-colors"
        :class="
          selectedCategory === category.value
            ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900'
            : 'border-slate-200 bg-transparent text-slate-600 hover:border-slate-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-400'
        "
        @click="emit('update:category', category.value)"
      >
        {{ category.label }}
      </button>
      <button
        v-if="selectedCategory !== 'all' || searchQuery || sortOrder !== 'asc'"
        type="button"
        class="min-h-11 px-3 text-sm text-brand underline underline-offset-4 dark:text-brand-light"
        @click="emit('refresh')"
      >
        {{ t("products.filters.reset") }}
      </button>
    </div>
  </div>
</template>
