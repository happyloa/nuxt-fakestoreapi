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
    required?: boolean;
  }>(),
  {
    type: "text",
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
</script>

<template>
  <label class="block">
    <span v-if="label" :class="FIELD_LABEL_CLASS">
      {{ label }}
      <span v-if="required" class="text-brand dark:text-brand-light" aria-hidden="true">*</span>
    </span>
    <input
      v-bind="attrs"
      v-model="inputValue"
      :type="type"
      :required="required"
      :placeholder="placeholder"
      :class="FIELD_CONTROL_CLASS"
    />
  </label>
</template>
