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
  <div>
    <label v-if="label" :for="String(attrs.id ?? inputId)" :class="FIELD_LABEL_CLASS">
      {{ label }}
      <span v-if="required" class="text-brand dark:text-brand-light" aria-hidden="true">*</span>
    </label>
    <select
      v-bind="attrs"
      :id="String(attrs.id ?? inputId)"
      v-model="inputValue"
      :required="required"
      :class="FIELD_CONTROL_CLASS"
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
