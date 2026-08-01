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
    error?: string;
  }>(),
  {
    type: "text",
    placeholder: "",
    hint: "",
    required: false,
    error: "",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | null): void;
}>();

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string | number | null) => emit("update:modelValue", value),
});

const errorId = useId();
</script>

<template>
  <label class="block text-sm font-medium text-slate-600 dark:text-slate-300">
    <span v-if="label" class="mb-1 block">
      {{ label }}
      <span v-if="required" class="text-rose-500" aria-hidden="true">*</span>
    </span>
    <input
      v-bind="attrs"
      v-model="inputValue"
      :type="type"
      :required="required"
      :placeholder="placeholder"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? errorId : undefined"
      :class="[
        'w-full rounded-lg border bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-100',
        error
          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-400/40 dark:border-rose-500'
          : 'border-slate-200 focus:border-brand focus:ring-brand/40 dark:border-slate-700',
      ]" />
    <span
      v-if="error"
      :id="errorId"
      class="mt-1 block text-xs text-rose-600 dark:text-rose-400"
      >{{ error }}</span
    >
    <span
      v-else-if="hint"
      class="mt-1 block text-xs text-slate-500 dark:text-slate-400"
      >{{ hint }}</span
    >
  </label>
</template>
