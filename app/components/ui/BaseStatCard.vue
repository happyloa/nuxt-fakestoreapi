<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
})
</script>

<template>
  <article
    class="rounded-xl border border-slate-200 bg-white px-4 py-5 shadow-sm transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900"
  >
    <p class="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{{ label }}</p>
    <p class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{{ value }}</p>
    <slot />
  </article>
</template>
