<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const model = defineModel<string>({ required: true });

withDefaults(
  defineProps<{
    label?: string;
    rows?: number;
    required?: boolean;
  }>(),
  { rows: 4, required: false },
);
</script>

<template>
  <label class="block">
    <span v-if="label" :class="FIELD_LABEL_CLASS">
      {{ label }}
      <span v-if="required" class="text-brand dark:text-brand-light" aria-hidden="true">*</span>
    </span>
    <textarea
      v-bind="$attrs"
      v-model="model"
      :rows="rows"
      :required="required"
      :class="FIELD_CONTROL_CLASS"
    />
  </label>
</template>
