<script setup lang="ts">
// 其餘屬性（min、placeholder、autocomplete…）交給 <input>，外層 label 提供名稱。
defineOptions({ inheritAttrs: false });

const model = defineModel<string | number | null>({ required: true });

withDefaults(
  defineProps<{
    type?: string;
    label?: string;
    required?: boolean;
  }>(),
  { type: "text", required: false },
);
</script>

<template>
  <label class="block">
    <span v-if="label" :class="FIELD_LABEL_CLASS">
      {{ label }}
      <span v-if="required" class="text-brand dark:text-brand-light" aria-hidden="true">*</span>
    </span>
    <input
      v-bind="$attrs"
      v-model="model"
      :type="type"
      :required="required"
      :class="FIELD_CONTROL_CLASS"
    />
  </label>
</template>
