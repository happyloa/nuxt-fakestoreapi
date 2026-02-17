<script setup lang="ts">
interface Props {
  label: string;
  value: string | number;
  accentColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  accentColor: "from-brand to-brand-dark",
});
</script>

<template>
  <article
    class="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white px-5 py-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700/60 dark:bg-slate-900 dark:hover:border-slate-600/60">
    <!-- 頂部漸層色條 -->
    <div
      class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r transition-all duration-300 group-hover:h-1.5"
      :class="accentColor" />
    <p
      class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
      {{ label }}
    </p>
    <p
      class="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
      {{ value }}
    </p>
    <slot />
  </article>
</template>
