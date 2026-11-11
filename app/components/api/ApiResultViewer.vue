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
      class="meta text-slate-500 dark:text-slate-400"
    >
      {{ label }}
    </figcaption>
    <!-- pre 會保留空白，code 必須緊接在標籤內，否則第一行會多出縮排。 -->
    <pre class="max-h-64 overflow-auto bg-slate-900 p-4 font-mono text-xs leading-5 text-slate-100 dark:bg-black/40"><code>{{ formatted }}</code></pre>
  </figure>
</template>
