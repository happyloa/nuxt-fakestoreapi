<script setup lang="ts">
import type { Product } from "#shared/types/fakestore";

const emit = defineEmits<{
  (e: "add-to-cart", product: Product): void;
  (e: "reset"): void;
  (e: "retry"): void;
}>();

withDefaults(
  defineProps<{
    products?: Product[];
    loading?: boolean;
    error?: string;
    hasActiveFilters?: boolean;
  }>(),
  {
    products: () => [],
    loading: false,
    error: "",
    hasActiveFilters: false,
  },
);
</script>

<template>
  <div>
    <ProductGridSkeleton v-if="loading" :count="8" />
    <BaseAlert v-else-if="error" variant="error" class="mt-6">
      <div class="space-y-3">
        <p>{{ error }}</p>
        <BaseButton variant="outline" size="sm" @click="emit('retry')">{{
          $t("ui.retry")
        }}</BaseButton>
      </div>
    </BaseAlert>
    <ProductEmptyState
      v-else-if="!products.length"
      :has-active-filters="hasActiveFilters"
      @reset="emit('reset')"
    />
    <!-- 無間距格線：外框畫上與左邊線，每格補右與下邊線。 -->
    <ul
      v-else
      class="grid grid-cols-2 border-l border-rule md:grid-cols-3 lg:grid-cols-4 dark:border-rule-dark"
    >
      <li
        v-for="product in products"
        :key="product.id"
        class="border-b border-r border-rule dark:border-rule-dark"
      >
        <ProductCard :product="product" @add-to-cart="emit('add-to-cart', $event)" />
      </li>
    </ul>
  </div>
</template>
