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
  <article class="rounded-xl border border-slate-200 bg-white px-4 py-5 shadow-sm">
    <p class="text-xs font-medium uppercase tracking-wider text-slate-500">{{ label }}</p>
    <p class="mt-2 text-2xl font-semibold text-slate-900">{{ value }}</p>
    <slot />
  </article>
</template>
