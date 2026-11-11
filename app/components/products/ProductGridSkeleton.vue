<script setup lang="ts">
// 商品格線載入中的佔位，與 ProductCard 相同的格線與比例。
withDefaults(defineProps<{ count?: number }>(), { count: 8 });
</script>

<template>
  <ul
    class="grid grid-cols-2 border-l border-rule md:grid-cols-3 lg:grid-cols-4 dark:border-rule-dark"
    aria-busy="true"
    :aria-label="$t('ui.loading')"
  >
    <li
      v-for="index in count"
      :key="index"
      class="space-y-4 border-b border-r border-rule p-3 sm:p-5 dark:border-rule-dark"
    >
      <BaseSkeleton width="40%" height="0.6875rem" />
      <BaseSkeleton height="auto" class="aspect-4/5" />
      <BaseSkeleton width="80%" />
      <BaseSkeleton width="35%" height="1.25rem" />
    </li>
  </ul>
</template>
