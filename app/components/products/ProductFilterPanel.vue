<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    categories?: string[];
    /** 各分類的商品數，key 為分類 id */
    counts?: Record<string, number>;
    total?: number;
    selectedCategory?: string;
    sortOrder?: "asc" | "desc";
    searchQuery?: string;
    hasActiveFilters?: boolean;
  }>(),
  {
    categories: () => [],
    counts: () => ({}),
    total: 0,
    selectedCategory: "all",
    sortOrder: "asc",
    searchQuery: "",
    hasActiveFilters: false,
  },
);
const emit = defineEmits<{
  (e: "update:category", value: string): void;
  (e: "update:sort", value: "asc" | "desc"): void;
  (e: "update:search", value: string): void;
  (e: "reset"): void;
}>();
const { t } = useI18n();
const categoryLabel = useCategoryLabel();
const categories = computed(() => [
  { value: "all", label: t("products.filters.allCategories"), count: props.total },
  ...props.categories.map((value) => ({
    value,
    label: categoryLabel(value),
    count: props.counts[value] ?? 0,
  })),
]);
const sortOptions = computed(() => [
  { label: t("products.filters.sortAsc"), value: "asc" },
  { label: t("products.filters.sortDesc"), value: "desc" },
]);
</script>
<template>
  <div class="border-y border-rule dark:border-rule-dark">
    <div
      class="-mx-1 flex gap-x-7 overflow-x-auto px-1"
      role="group"
      :aria-label="t('products.filters.categoryLabel')"
    >
      <button
        v-for="category in categories"
        :key="category.value"
        type="button"
        :aria-pressed="selectedCategory === category.value"
        class="relative flex min-h-13 shrink-0 items-start gap-1 text-[15px] font-semibold underline-offset-[10px] transition-colors focus-visible:-outline-offset-4"
        :class="tabClass(selectedCategory === category.value)"
        @click="emit('update:category', category.value)"
      >
        <span class="self-center">{{ category.label }}</span
        ><span class="sr-only"> (</span
        ><span class="mt-3 font-mono text-[11px] tabular-nums">{{
          category.count
        }}</span
        ><span class="sr-only">)</span>
      </button>
    </div>
    <div
      class="flex flex-col gap-4 border-t border-rule py-5 sm:flex-row sm:items-end dark:border-rule-dark"
    >
      <div class="flex-1 sm:max-w-md">
        <BaseInput
          :model-value="searchQuery"
          type="search"
          :label="t('products.filters.searchLabel')"
          :placeholder="t('products.filters.searchPlaceholder')"
          @update:model-value="emit('update:search', $event as string)"
        />
      </div>
      <button
        v-if="hasActiveFilters"
        type="button"
        class="min-h-12 self-start text-sm font-semibold text-brand underline underline-offset-4 sm:self-end dark:text-brand-light"
        @click="emit('reset')"
      >
        {{ t("products.filters.reset") }}
      </button>
      <div class="sm:ml-auto sm:w-56">
        <BaseSelect
          :model-value="sortOrder"
          :label="t('products.filters.sortLabel')"
          :options="sortOptions"
          @update:model-value="emit('update:sort', $event as 'asc' | 'desc')"
        />
      </div>
    </div>
  </div>
</template>
