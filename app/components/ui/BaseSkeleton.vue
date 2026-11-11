<script setup lang="ts">
/**
 * 骨架屏佔位，資料載入前顯示，內建脈衝動畫。
 */
defineProps<{
  width?: string;
  height?: string;
}>();
</script>

<template>
  <div
    class="animate-pulse bg-slate-200 dark:bg-slate-800"
    :style="{ width: width || '100%', height: height || '1rem' }" />
</template>
