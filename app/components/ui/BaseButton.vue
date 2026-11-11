<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";
import { NuxtLink } from "#components";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

// BaseButton 提供統一的樣式與狀態處理：有 to 時渲染 NuxtLink，有 href 時渲染 a，否則為 button。
const props = withDefaults(
  defineProps<{
    type?: "button" | "submit" | "reset";
    to?: RouteLocationRaw;
    href?: string;
    variant?: Variant;
    size?: Size;
    block?: boolean;
    loading?: boolean;
    disabled?: boolean;
  }>(),
  {
    type: "button",
    variant: "primary" as Variant,
    size: "md" as Size,
    block: false,
    loading: false,
    disabled: false,
  },
);

const classes = computed(() => {
  // 根據尺寸、樣式與寬度設定組合 Tailwind class。
  const base =
    "cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40";
  const sizes: Record<Size, string> = {
    sm: "min-h-10 px-4 text-[13px]",
    md: "min-h-11 px-5 text-sm",
    lg: "min-h-13 px-7 text-[15px]",
  };
  const variants: Record<Variant, string> = {
    primary:
      "bg-slate-900 text-paper hover:bg-brand dark:bg-paper dark:text-slate-950 dark:hover:bg-brand-light",
    secondary:
      "bg-plate text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-paper dark:hover:bg-slate-700",
    outline:
      "border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-paper dark:border-paper/70 dark:text-paper dark:hover:bg-paper dark:hover:text-slate-950",
    ghost:
      "text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline dark:text-slate-300 dark:hover:text-paper",
  };
  const width = props.block ? "w-full" : "";
  return [base, sizes[props.size], variants[props.variant], width].join(" ");
});

const isLink = computed(() => Boolean(props.to || props.href));
const inactive = computed(() => props.loading || props.disabled);

const elementAttrs = computed(() => {
  if (props.to) {
    return { to: props.to };
  }
  if (props.href) {
    return { href: props.href };
  }
  return {
    type: props.type,
    disabled: inactive.value,
    "aria-busy": props.loading ? "true" : undefined,
  };
});

// 連結沒有原生 disabled，停用或載入中時改為阻擋導覽並移出 Tab 順序。
const linkAttrs = computed(() =>
  isLink.value && inactive.value
    ? { tabindex: -1, "aria-disabled": "true" }
    : {},
);

const onClick = (event: MouseEvent) => {
  if (isLink.value && inactive.value) {
    event.preventDefault();
  }
};
</script>

<template>
  <component
    :is="to ? NuxtLink : href ? 'a' : 'button'"
    v-bind="{ ...elementAttrs, ...linkAttrs }"
    :class="classes"
    @click="onClick"
  >
    <svg
      v-if="loading"
      class="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
    <slot />
  </component>
</template>
