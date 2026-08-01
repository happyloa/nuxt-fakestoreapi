<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string;
    description?: string;
    align?: "left" | "center";
    level?: number;
  }>(),
  {
    description: "",
    align: "left",
    level: 2,
  },
);
</script>

<template>
  <hgroup
    :class="[
      'mb-8 space-y-2',
      align === 'center' ? 'text-center' : 'text-left',
    ]">
    <component
      :is="'h' + level"
      class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
      {{ title }}
    </component>
    <p
      v-if="description"
      class="text-sm text-slate-600 dark:text-slate-300 sm:text-base">
      {{ description }}
    </p>
    <slot />
  </hgroup>
</template>
