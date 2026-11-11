<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";
import { NuxtLink } from "#components";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

// 有 to 時渲染 NuxtLink，否則為 button。
const props = withDefaults(
  defineProps<{
    type?: "button" | "submit" | "reset";
    to?: RouteLocationRaw;
    variant?: Variant;
    size?: Size;
    block?: boolean;
    loading?: boolean;
    disabled?: boolean;
  }>(),
  {
    type: "button",
    variant: "primary",
    size: "md",
    block: false,
    loading: false,
    disabled: false,
  },
);

const sizes: Record<Size, string> = {
  sm: "min-h-10 px-4 text-[13px]",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-13 px-7 text-[15px]",
};
const variants: Record<Variant, string> = {
  primary:
    "bg-slate-900 text-paper hover:bg-brand dark:bg-paper dark:text-slate-950 dark:hover:bg-brand-light",
  outline:
    "border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-paper dark:border-paper/70 dark:text-paper dark:hover:bg-paper dark:hover:text-slate-950",
  ghost:
    "text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline dark:text-slate-300 dark:hover:text-paper",
};

const classes = computed(() => [
  "cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40 aria-busy:cursor-wait",
  sizes[props.size],
  variants[props.variant],
  props.block && "w-full",
]);

// 載入中不設原生 disabled，焦點才不會從按鈕上掉落；改以 aria-disabled
// 標示並攔下點擊（含表單 Enter 送出觸發的點擊）。
const onClick = (event: MouseEvent) => {
  if (!props.loading) return;
  event.preventDefault();
  event.stopImmediatePropagation();
};
</script>

<template>
  <NuxtLink v-if="to" :to="to" :class="classes"><slot /></NuxtLink>
  <button
    v-else
    :type="type"
    :class="classes"
    :disabled="disabled"
    :aria-disabled="loading || undefined"
    :aria-busy="loading || undefined"
    @click="onClick"
  >
    <svg
      v-if="loading"
      class="h-4 w-4 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
    <slot />
  </button>
</template>
