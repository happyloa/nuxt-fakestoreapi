<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: [Object, Array, String, Number, Boolean],
    default: null,
  },
  label: {
    type: String,
    default: '',
  },
})

const formatted = computed(() =>
  typeof props.value === 'string'
    ? props.value
    : JSON.stringify(props.value, null, 2),
)
</script>

<template>
  <div class="space-y-2">
    <p v-if="label" class="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {{ label }}
    </p>
    <pre class="max-h-64 overflow-auto rounded-xl bg-slate-900/95 p-4 text-xs text-slate-100">
      <code>{{ formatted }}</code>
    </pre>
  </div>
</template>
