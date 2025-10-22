<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'info' | 'success' | 'warning' | 'error'
    title?: string
  }>(),
  {
    variant: 'info',
    title: '',
  },
)

const variants: Record<string, string> = {
  info: 'bg-slate-100 text-slate-700 border-slate-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  error: 'bg-rose-50 text-rose-700 border-rose-200',
}
</script>

<template>
  <div :class="['rounded-xl border px-4 py-3 text-sm', variants[variant]]">
    <p v-if="title" class="mb-1 font-semibold">{{ title }}</p>
    <slot />
  </div>
</template>
