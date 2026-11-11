<script setup lang="ts">
// 靜態卡片容器；傳入的 class 等屬性會自動套用到根元素。
withDefaults(
  defineProps<{
    as?: keyof HTMLElementTagNameMap;
    background?: string;
  }>(),
  {
    as: "article",
    background: "bg-white dark:bg-slate-900",
  },
);
</script>

<template>
  <component
    :is="as"
    :class="[
      'rounded-xl border border-slate-200 p-6 transition-colors duration-200 dark:border-slate-800',
      background,
    ]"
  >
    <slot />
  </component>
</template>
