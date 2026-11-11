<script setup lang="ts">
const props = defineProps<{
  value: unknown;
  label: string;
}>();

const formatted = computed(() => JSON.stringify(props.value, null, 2));
</script>

<template>
  <figure class="space-y-2">
    <figcaption class="meta text-slate-500 dark:text-slate-400">
      {{ label }}
    </figcaption>
    <!-- 可聚焦才能用鍵盤捲動（Safari 不會自動讓捲動區塊可聚焦）。
         pre 會保留空白，code 必須緊接在標籤內，否則第一行會多出縮排。 -->
    <pre
      tabindex="0"
      role="region"
      :aria-label="label"
      class="max-h-64 overflow-auto bg-slate-900 p-4 font-mono text-xs leading-5 text-slate-100 dark:bg-black/40"
    ><code>{{ formatted }}</code></pre>
  </figure>
</template>
