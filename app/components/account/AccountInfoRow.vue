<script setup lang="ts">
/**
 * 帳號頁的資料列（dt/dd），收斂個人資料與地址卡片中重複的欄位列樣板。
 */
withDefaults(
  defineProps<{
    label: string;
    /** 是否顯示底部分隔線（每組最後一列傳 false） */
    divider?: boolean;
    /** dd 是否首字母大寫（如姓名） */
    capitalize?: boolean;
  }>(),
  { divider: true, capitalize: false },
);
</script>

<template>
  <div
    class="flex items-start justify-between gap-4"
    :class="divider && 'border-b border-rule pb-3 dark:border-rule-dark'"
  >
    <dt class="meta shrink-0 pt-0.5 text-slate-500 dark:text-slate-400">
      {{ label }}
    </dt>
    <dd
      class="min-w-0 wrap-anywhere text-right font-semibold text-slate-900 dark:text-paper"
      :class="capitalize && 'capitalize'"
    >
      <slot />
    </dd>
  </div>
</template>
