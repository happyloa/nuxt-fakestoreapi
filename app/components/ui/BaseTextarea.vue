<script setup lang="ts">
import { useAttrs } from "vue";

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();

const props = withDefaults(
  defineProps<{
    modelValue: string;
    label?: string;
    placeholder?: string;
    rows?: number;
    required?: boolean;
  }>(),
  {
    placeholder: "",
    rows: 4,
    required: false,
  },
);

const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>();

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});
</script>

<template>
  <label class="block text-sm font-medium text-slate-600 dark:text-slate-300">
    <span v-if="label" class="mb-1 block">
      {{ label }}
      <span v-if="required" class="text-rose-500" aria-hidden="true">*</span>
    </span>
    <textarea
      v-bind="attrs"
      v-model="inputValue"
      :rows="rows"
      :required="required"
      :placeholder="placeholder"
      class="w-full rounded-lg border border-slate-200 bg-white min-h-12 px-4 py-3 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
    />
  </label>
</template>
