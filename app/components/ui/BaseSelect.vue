<script setup lang="ts">
import { useAttrs } from "vue";

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null;
    label?: string;
    placeholder?: string;
    options: { label: string; value: string | number }[];
    required?: boolean;
  }>(),
  {
    placeholder: "",
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

const inputId = useId();
</script>

<template>
  <div class="block text-sm font-medium text-slate-600 dark:text-slate-300">
    <label v-if="label" :for="String(attrs.id ?? inputId)" class="mb-1 block">
      {{ label }}
      <span v-if="required" class="text-rose-500" aria-hidden="true">*</span>
    </label>
    <select
      v-bind="attrs"
      :id="String(attrs.id ?? inputId)"
      v-model="inputValue"
      :required="required"
      class="w-full rounded-lg border border-slate-200 bg-white min-h-12 px-4 py-3 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
    >
      <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        class="text-slate-900 dark:text-slate-100"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
