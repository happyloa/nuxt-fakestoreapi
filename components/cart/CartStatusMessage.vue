<script setup lang="ts">
const props = defineProps<{
  message: string
  type: 'success' | 'error' | 'info'
}>()

const classes = computed(() => {
  switch (props.type) {
    case 'success':
      return 'border-primary-200 bg-primary-50 text-primary-700'
    case 'error':
      return 'border-red-200 bg-red-50 text-red-600'
    default:
      return 'border-slate-200 bg-white text-slate-600'
  }
})
</script>

<template>
  <div v-if="props.message" class="mt-6 rounded-3xl border px-6 py-4 text-sm font-semibold" :class="classes">
    {{ props.message }}
  </div>
</template>
