<script setup lang="ts">
const props = defineProps<{ count?: number }>();

const skeletonCount = computed(() => props.count ?? 6);

/**
 * 商品列表載入時的骨架畫面，提升使用者對於資料狀態的感知。
 */
</script>

<template>
  <ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
    <li v-for="index in skeletonCount" :key="index">
      <BaseCard class="animate-pulse space-y-4">
        <div class="h-48 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
        <div class="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
        <div class="h-3 w-1/2 rounded bg-slate-100 dark:bg-slate-700"></div>
        <div class="flex gap-2">
          <div
            class="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          <div
            class="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </BaseCard>
    </li>
  </ul>
</template>
