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

const variants: Record<Variant, string> = {
  info: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-100 dark:border-slate-700",
  success:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-400/40",
  warning:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:border-amber-400/40",
  error:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-200 dark:border-rose-400/40",
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
    :class="['rounded-xl border px-4 py-3 text-sm', variants[variant]]"
  >
    <slot />
  </div>
</template>
