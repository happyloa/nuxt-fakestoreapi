<script setup lang="ts">
interface Props {
  value?: object | unknown[] | string | number | boolean | null;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: null,
  label: "",
});

const formatted = computed(() =>
  typeof props.value === "string"
    ? props.value
    : JSON.stringify(props.value, null, 2),
);
</script>

<template>
  <figure class="space-y-2">
    <figcaption
      v-if="label"
      class="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {{ label }}
    </figcaption>
    <pre
      class="max-h-64 overflow-auto rounded-xl bg-slate-900/95 p-4 text-xs text-slate-100">
      <code>{{ formatted }}</code>
    </pre>
  </figure>
</template>
