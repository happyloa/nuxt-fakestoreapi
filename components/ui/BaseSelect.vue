<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null
    label?: string
    placeholder?: string
    options: { label: string; value: string | number }[]
    required?: boolean
  }>(),
  {
    placeholder: '',
    required: false,
  },
)

const emit = defineEmits<{ (e: 'update:modelValue', value: string | number | null): void }>()

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string | number | null) => emit('update:modelValue', value),
})
</script>

<template>
  <label class="block text-sm font-medium text-slate-600">
    <span v-if="label" class="mb-1 block">{{ label }}</span>
    <select
      v-bind="attrs"
      v-model="inputValue"
      :required="required"
      class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
    >
      <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </label>
</template>
