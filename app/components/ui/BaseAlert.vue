<script setup lang="ts">
type Variant = "info" | "success" | "warning" | "error";

withDefaults(
  defineProps<{
    variant?: Variant;
  }>(),
  {
    variant: "info",
  },
);

// 以左側色條標示類型，像印刷品上的註記。
const variants: Record<Variant, string> = {
  info: "border-slate-400 bg-plate/60 text-slate-700 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-200",
  success:
    "border-emerald-700 bg-emerald-50 text-emerald-900 dark:border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-100",
  warning:
    "border-amber-600 bg-amber-50 text-amber-900 dark:border-amber-400 dark:bg-amber-950/40 dark:text-amber-100",
  error:
    "border-brand bg-brand/[0.06] text-brand-dark dark:border-brand-light dark:bg-brand/15 dark:text-brand-light",
};

// 只有錯誤會立即打斷螢幕報讀；成功與警告以 polite 狀態宣告，靜態說明不作為即時區域。
const roles: Record<Variant, string | undefined> = {
  info: undefined,
  success: "status",
  warning: "status",
  error: "alert",
};
</script>

<template>
  <div
    :role="roles[variant]"
    :class="['border-l-2 px-4 py-3 text-sm leading-6', variants[variant]]"
  >
    <slot />
  </div>
</template>
