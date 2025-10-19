<script setup lang="ts">
const props = defineProps<{ title: string }>()
</script>

<template>
  <article class="card space-y-3 text-sm text-slate-600">
    <h2 class="text-lg font-semibold text-slate-900">{{ props.title }}</h2>
    <slot />
  </article>
</template>
