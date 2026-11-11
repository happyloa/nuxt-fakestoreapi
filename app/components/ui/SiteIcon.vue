<script setup lang="ts">
type Icon = "arrow" | "back" | "up" | "close" | "plus" | "sun" | "moon";
defineProps<{ name: Icon }>();
const paths: Record<Icon, string> = {
  arrow: "M4 12h16m-6-6 6 6-6 6",
  back: "m15 19-7-7 7-7",
  up: "m5 15 7-7 7 7",
  close: "m6 6 12 12M6 18 18 6",
  plus: "M12 5v14M5 12h14",
  sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  moon: "M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z",
};
</script>
<template>
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path :d="paths[name]" />
  </svg>
</template>
