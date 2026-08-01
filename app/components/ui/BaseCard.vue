<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    as?: keyof HTMLElementTagNameMap;
    padding?: string;
    background?: string;
    shadow?: string;
    border?: string;
    // 是否套用 hover 上浮效果。預設 false：靜態卡片（表單、摘要、面板）
    // 不應傳達「可點擊」的錯誤暗示；僅真正可互動的卡片才開啟。
    interactive?: boolean;
  }>(),
  {
    as: "article",
    padding: "p-6",
    background: "bg-white dark:bg-slate-900",
    shadow: "shadow-card dark:shadow-black/30",
    border: "border border-slate-100/80 dark:border-slate-700/60",
    interactive: false,
  },
);

const classes = computed(() =>
  [
    "rounded-2xl transition-all duration-300",
    props.interactive
      ? "hover:-translate-y-1 hover:scale-[1.01] hover:shadow-card-hover dark:hover:shadow-brand/5"
      : "",
    props.background,
    props.border,
    props.shadow,
    props.padding,
  ]
    .filter(Boolean)
    .join(" "),
);
</script>

<template>
  <component :is="props.as" :class="classes" v-bind="$attrs">
    <slot />
  </component>
</template>
