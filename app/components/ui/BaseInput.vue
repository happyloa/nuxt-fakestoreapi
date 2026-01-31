<script setup lang="ts">
import { useAttrs } from "vue";

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null;
    type?: string;
    label?: string;
    placeholder?: string;
    hint?: string;
    required?: boolean;
  }>(),
  {
    type: "text",
    placeholder: "",
    hint: "",
    required: false,
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | null): void;
}>();

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string | number | null) => emit("update:modelValue", value),
});
</script>

<template>
  <label class="block text-sm font-medium text-slate-600 dark:text-slate-300">
    <span v-if="label" class="mb-1 block">{{ label }}</span>
    <input
      v-bind="attrs"
      v-model="inputValue"
      :type="type"
      :required="required"
      :placeholder="placeholder"
      class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />
    <span
      v-if="hint"
      class="mt-1 block text-xs text-slate-500 dark:text-slate-400"
      >{{ hint }}</span
    >
  </label>
</template>
