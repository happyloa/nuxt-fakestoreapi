<script setup lang="ts">
import { useAttrs } from "vue";

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();
const model = defineModel<string | number | null>({ required: true });

withDefaults(
  defineProps<{
    label?: string;
    placeholder?: string;
    options: { label: string; value: string | number }[];
    required?: boolean;
  }>(),
  { placeholder: "", required: false },
);

const inputId = useId();
const selectId = computed(() => String(attrs.id ?? inputId));
</script>

<template>
  <div>
    <label v-if="label" :for="selectId" :class="FIELD_LABEL_CLASS">
      {{ label }}
      <span v-if="required" class="text-brand dark:text-brand-light" aria-hidden="true">*</span>
    </label>
    <select
      v-bind="attrs"
      :id="selectId"
      v-model="model"
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
