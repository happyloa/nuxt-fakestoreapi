<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'brand' | 'accent' | 'neutral'
  }>(),
  {
    variant: 'neutral',
  },
)

const variantClass = computed(() => {
  switch (props.variant) {
    case 'brand':
      return 'bg-brand/10 text-brand-dark'
    case 'accent':
      return 'bg-accent/10 text-accent-dark'
    default:
      return 'bg-slate-200 text-slate-700'
  }
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
      variantClass,
    ]"
  >
    <slot />
  </span>
</template>
