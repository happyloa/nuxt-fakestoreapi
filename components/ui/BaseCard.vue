<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    padding?: string
    background?: string
    shadow?: string
    border?: string
  }>(),
  {
    padding: 'p-6',
    background: 'bg-white',
    shadow: 'shadow-card',
    border: 'border border-slate-100',
  },
)

const classes = computed(() =>
  ['rounded-xl', props.background, props.border, props.shadow, props.padding].join(' '),
)
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
