<script setup lang="ts">
/**
 * 當商品列表為空時的友善提示元件。
 * 區分兩種情境：
 * 1. hasActiveFilters → 篩選/搜尋無結果，提供「清除篩選」CTA
 * 2. 否則 → 目錄確實為空，提供「新增商品」CTA
 */
withDefaults(defineProps<{ hasActiveFilters?: boolean }>(), {
  hasActiveFilters: false,
});

defineEmits<{ (e: "reset"): void }>();

const localePath = useLocalePath();
</script>

<template>
  <section
    class="border-b border-rule px-2 py-20 text-center dark:border-rule-dark"
    aria-live="polite">
    <template v-if="hasActiveFilters">
      <h3 class="text-2xl font-extrabold tracking-heading">
        {{ $t("products.empty.noResults.title") }}
      </h3>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
        {{ $t("products.empty.noResults.description") }}
      </p>
      <BaseButton variant="outline" class="mt-6" @click="$emit('reset')">
        {{ $t("products.empty.noResults.cta") }}
      </BaseButton>
    </template>
    <template v-else>
      <h3 class="text-2xl font-extrabold tracking-heading">
        {{ $t("products.empty.title") }}
      </h3>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
        {{ $t("products.empty.description") }}
      </p>
      <BaseButton :to="localePath('/products/new')" class="mt-6">
        {{ $t("products.empty.cta") }}
      </BaseButton>
    </template>
  </section>
</template>
