<script setup lang="ts">
/**
 * 骨架屏組件 (Skeleton Loader)
 * 用於資料載入前的佔位，提供更好的使用者體驗。
 * 內建微小的脈衝動畫 (animate-pulse)。
 */
defineProps<{
  width?: string;
  height?: string;
  rounded?: string;
  circle?: boolean;
}>();
</script>

<template>
  <div
    class="animate-pulse bg-slate-200 dark:bg-slate-800"
    :class="[circle ? 'rounded-full' : rounded || 'rounded-lg']"
    :style="{ width: width || '100%', height: height || '1rem' }" />
</template>
