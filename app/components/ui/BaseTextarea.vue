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
  <label class="block">
    <span v-if="label" :class="FIELD_LABEL_CLASS">
      {{ label }}
      <span v-if="required" class="text-brand dark:text-brand-light" aria-hidden="true">*</span>
    </span>
    <textarea
      v-bind="attrs"
      v-model="inputValue"
      :rows="rows"
      :required="required"
      :placeholder="placeholder"
      :class="FIELD_CONTROL_CLASS"
    />
  </label>
</template>
