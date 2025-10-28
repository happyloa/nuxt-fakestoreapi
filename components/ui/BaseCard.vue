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
  <component :is="props.as" :class="classes" v-bind="$attrs">
    <slot />
  </component>
</template>
