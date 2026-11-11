<script setup lang="ts">
// 以細線框出的區塊；傳入的 class 等屬性會自動套用到根元素。
withDefaults(
  defineProps<{
    as?: keyof HTMLElementTagNameMap;
    background?: string;
  }>(),
  {
    as: "article",
    background: "",
  },
);
</script>

<template>
  <component
    :is="as"
    :class="[
      'border border-rule p-6 transition-colors duration-200 sm:p-7 dark:border-rule-dark',
      background,
    ]"
  >
    <slot />
  </component>
</template>
