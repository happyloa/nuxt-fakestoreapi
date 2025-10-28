<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    align?: 'left' | 'center'
  }>(),
  {
    description: '',
    align: 'left',
  },
)
</script>

<template>
  <header :class="['mb-8 space-y-2', align === 'center' ? 'text-center' : 'text-left']">
    <h2 class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
      {{ title }}
    </h2>
    <p v-if="description" class="text-sm text-slate-600 sm:text-base">
      {{ description }}
    </p>
    <slot />
  </header>
</template>
