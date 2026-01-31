<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: "brand" | "accent" | "neutral";
  }>(),
  {
    variant: "neutral",
  },
);

const variantClass = computed(() => {
  switch (props.variant) {
    case "brand":
      return "bg-brand/10 text-brand-dark dark:bg-brand/20 dark:text-brand-foreground";
    case "accent":
      return "bg-accent/10 text-accent-dark dark:bg-accent/20 dark:text-accent-light";
    default:
      return "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-100";
  }
});
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
      variantClass,
    ]">
    <slot />
  </span>
</template>
