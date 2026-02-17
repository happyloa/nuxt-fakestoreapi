<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    as?: keyof HTMLElementTagNameMap;
    padding?: string;
    background?: string;
    shadow?: string;
    border?: string;
  }>(),
  {
    as: "article",
    padding: "p-6",
    background: "bg-white dark:bg-slate-900",
    shadow: "shadow-card dark:shadow-black/30",
    border: "border border-slate-100/80 dark:border-slate-700/60",
  },
);

const classes = computed(() =>
  [
    "rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:hover:shadow-brand/5",
    props.background,
    props.border,
    props.shadow,
    props.padding,
  ].join(" "),
);
</script>

<template>
  <component :is="props.as" :class="classes" v-bind="$attrs">
    <slot />
  </component>
</template>
