<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    as?: keyof HTMLElementTagNameMap
    padding?: string
    background?: string
    shadow?: string
    border?: string
  }>(),
  {
    as: 'article',
    padding: 'p-6',
    background: 'bg-white/90 backdrop-blur dark:bg-slate-900/80',
    shadow: 'shadow-card dark:shadow-black/40',
    border: 'border border-slate-200/70 dark:border-slate-800/70',
  },
)

const classes = computed(() =>
  [
    'rounded-xl transition-colors duration-200',
    props.background,
    props.border,
    props.shadow,
    props.padding,
  ].join(' '),
)
</script>

<template>
  <component :is="props.as" :class="classes" v-bind="$attrs">
    <slot />
  </component>
</template>
