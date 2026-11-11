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
    "cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.97]";
  const sizes: Record<Size, string> = {
    sm: "min-h-10 px-4 py-2 text-sm",
    md: "min-h-11 px-5 py-3 text-sm",
    lg: "min-h-12 px-7 py-3.5 text-sm sm:text-base",
  };
  const variants: Record<Variant, string> = {
    primary:
      "bg-brand text-white hover:bg-brand-dark focus-visible:outline-brand",
    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:outline-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:focus-visible:outline-slate-500",
    outline:
      "border border-slate-200/60 bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-300 focus-visible:outline-brand dark:border-slate-600/60 dark:bg-transparent dark:text-slate-100 dark:hover:bg-slate-800/60 dark:hover:border-slate-500",
    ghost:
      "text-slate-600 hover:bg-slate-100 focus-visible:outline-brand dark:text-slate-300 dark:hover:bg-slate-800/60 dark:focus-visible:outline-brand",
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
