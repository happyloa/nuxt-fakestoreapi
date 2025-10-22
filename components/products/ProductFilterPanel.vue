<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  categories: {
    type: Array as () => string[],
    default: () => [],
  },
  selectedCategory: {
    type: String,
    default: 'all',
  },
  sortOrder: {
    type: String as () => 'asc' | 'desc',
    default: 'asc',
  },
  searchQuery: {
    type: String,
    default: '',
  },
})

const emit = defineEmits<{
  (e: 'update:category', value: string): void
  (e: 'update:sort', value: 'asc' | 'desc'): void
  (e: 'update:search', value: string): void
  (e: 'refresh'): void
}>()

const { t } = useI18n()

const sortOptions = computed(() => [
  { label: t('products.filters.sortAsc'), value: 'asc' },
  { label: t('products.filters.sortDesc'), value: 'desc' },
])
</script>

<template>
  <BaseCard class="space-y-6">
    <BaseSectionHeading
      :title="$t('products.filters.title')"
      :description="$t('products.filters.description')"
    />
    <div class="space-y-4">
      <BaseInput
        :model-value="searchQuery"
        :label="$t('products.filters.searchLabel')"
        :placeholder="$t('products.filters.searchPlaceholder')"
        @update:model-value="emit('update:search', $event as string)"
      />
      <div class="grid gap-4 sm:grid-cols-2">
        <BaseSelect
          :model-value="selectedCategory"
          :label="$t('products.filters.categoryLabel')"
          :options="[{ label: $t('products.filters.allCategories'), value: 'all' }, ...categories.map((category) => ({ label: category, value: category }))]"
          @update:model-value="emit('update:category', $event as string)"
        />
        <BaseSelect
          :model-value="sortOrder"
          :label="$t('products.filters.sortLabel')"
          :options="sortOptions"
          @update:model-value="emit('update:sort', $event as 'asc' | 'desc')"
        />
      </div>
      <BaseButton variant="outline" block @click="emit('refresh')">
        {{ $t('products.filters.reset') }}
      </BaseButton>
    </div>
  </BaseCard>
</template>
