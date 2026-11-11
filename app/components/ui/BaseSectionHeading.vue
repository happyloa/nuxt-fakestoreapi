<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    description?: string;
    level?: number;
    /** 放在標題元素本身，供 aria-labelledby 只取標題文字 */
    headingId?: string;
  }>(),
  {
    description: "",
    level: 2,
    headingId: undefined,
  },
);
</script>

<template>
  <hgroup class="mb-8 space-y-3 text-left">
    <component
      :is="'h' + level"
      :id="headingId"
      :class="
        level === 1
          ? 'text-[clamp(2.5rem,6vw,4.75rem)] leading-display tracking-heading'
          : 'text-xl tracking-heading sm:text-2xl'
      "
      class="font-extrabold text-slate-900 dark:text-paper"
    >
      {{ title }}
    </component>
    <p
      v-if="description"
      class="max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-7"
    >
      {{ description }}
    </p>
  </hgroup>
</template>
