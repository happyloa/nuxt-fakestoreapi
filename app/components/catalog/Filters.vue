<script setup lang="ts">
// The URL remains the source of truth; this component only renders controls.
type SortOrder = "featured" | "price-asc" | "price-desc"

defineProps<{
  categories: string[]
  resultCount: number
}>()

const search = defineModel<string>("search", { required: true })
const category = defineModel<string>("category", { required: true })
const sort = defineModel<SortOrder>("sort", { required: true })
const emit = defineEmits<{ clear: [] }>()
const { t } = useI18n()

const translatedCategory = (rawCategory: string) => {
  const key = `catalog.categories.${rawCategory}`
  const translated = t(key)
  return translated === key ? rawCategory : translated
}
</script>

<template>
  <section id="catalog" class="scroll-mt-24" :aria-label="$t('catalog.title')">
    <div class="flex flex-col gap-5 border-b border-slate-200 pb-6 dark:border-slate-800">
      <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p class="eyebrow">{{ $t("catalog.eyebrow") }}</p>
          <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {{ $t("catalog.title") }}
          </h2>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {{ $t("catalog.description") }}
          </p>
        </div>
        <p class="text-sm font-medium text-slate-600 dark:text-slate-300" aria-live="polite">
          {{ $t("catalog.resultCount", { count: resultCount }) }}
        </p>
      </div>

      <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem_12rem_auto]">
        <label class="field-label">
          <span>{{ $t("catalog.searchLabel") }}</span>
          <input
            v-model="search"
            class="field-control"
            type="search"
            :placeholder="$t('catalog.searchPlaceholder')"
            autocomplete="off" />
        </label>
        <label class="field-label">
          <span>{{ $t("catalog.categoryLabel") }}</span>
          <select v-model="category" class="field-control">
            <option value="all">{{ $t("catalog.allCategories") }}</option>
            <option v-for="item in categories" :key="item" :value="item">
              {{ translatedCategory(item) }}
            </option>
          </select>
        </label>
        <label class="field-label">
          <span>{{ $t("catalog.sortLabel") }}</span>
          <select v-model="sort" class="field-control">
            <option value="featured">{{ $t("catalog.featured") }}</option>
            <option value="price-asc">{{ $t("catalog.priceAscending") }}</option>
            <option value="price-desc">{{ $t("catalog.priceDescending") }}</option>
          </select>
        </label>
        <button class="btn-quiet self-end" type="button" @click="emit('clear')">
          {{ $t("catalog.clearFilters") }}
        </button>
      </div>
    </div>
  </section>
</template>
