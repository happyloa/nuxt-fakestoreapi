<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    placeholder?: string
    hint?: string
    rows?: number
    required?: boolean
  }>(),
  {
    placeholder: '',
    hint: '',
    rows: 4,
    required: false,
  },
)

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})
</script>

<template>
  <label class="block text-sm font-medium text-slate-600">
    <span v-if="label" class="mb-1 block">{{ label }}</span>
    <textarea
      v-bind="attrs"
      v-model="inputValue"
      :rows="rows"
      :required="required"
      :placeholder="placeholder"
      class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
    />
    <span v-if="hint" class="mt-1 block text-xs text-slate-500">{{ hint }}</span>
  </label>
</template>
