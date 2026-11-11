<script setup lang="ts">
/**
 * 商品列表為空時的提示：篩選沒有結果時可清除篩選；
 * 目錄本身為空則代表上游沒有回傳商品。
 */
withDefaults(defineProps<{ hasActiveFilters?: boolean }>(), {
  hasActiveFilters: false,
});

defineEmits<{ (e: "reset"): void }>();
</script>

<template>
  <section class="border-b border-rule px-2 py-20 text-center dark:border-rule-dark">
    <h3 class="text-2xl font-extrabold tracking-heading">
      {{
        hasActiveFilters
          ? $t("products.empty.noResults.title")
          : $t("products.empty.title")
      }}
    </h3>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
      {{
        hasActiveFilters
          ? $t("products.empty.noResults.description")
          : $t("products.empty.description")
      }}
    </p>
    <BaseButton
      v-if="hasActiveFilters"
      variant="outline"
      class="mt-6"
      @click="$emit('reset')"
    >
      {{ $t("products.empty.noResults.cta") }}
    </BaseButton>
  </section>
</template>
