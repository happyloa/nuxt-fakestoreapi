<script setup lang="ts">
import type { Component } from "vue";
import { NuxtLink } from "#components";

type RouteLocation = string | Record<string, any>;

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

type ComponentTag = string | Component;

// BaseButton 提供統一的樣式與狀態處理，並透過多型支援 button、link 與自定元件。
const props = withDefaults(
  defineProps<{
    type?: "button" | "submit" | "reset";
    as?: ComponentTag;
    to?: RouteLocation;
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
    "cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.97]";
  const sizes: Record<Size, string> = {
    sm: "px-3.5 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm sm:text-base",
    lg: "px-7 py-3.5 text-base sm:text-lg",
  };
  const variants: Record<Variant, string> = {
    primary:
      "bg-gradient-to-r from-brand to-brand-dark text-white shadow-md shadow-brand/20 hover:shadow-lg hover:shadow-brand/30 hover:brightness-110 focus-visible:outline-brand",
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

const isButton = computed(() => {
  // 判斷當前是否為原生 button，用於控制 type 與 disabled 屬性。
  if (props.as) {
    return props.as === "button";
  }

  return !props.to && !props.href;
});
</script>

<template>
  <!-- 依照傳入的屬性決定渲染元素：NuxtLink > 自定元件 > a > button -->
  <NuxtLink
    v-if="to"
    :to="to"
    :class="classes"
    :aria-disabled="loading || disabled ? 'true' : undefined">
    <svg
      v-if="loading"
      class="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24">
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
    <slot />
  </NuxtLink>
  <component
    v-else-if="as"
    :is="as"
    :type="isButton ? type : undefined"
    :to="to"
    :href="href"
    :class="classes"
    :disabled="isButton ? disabled || loading : undefined">
    <svg
      v-if="loading"
      class="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24">
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
    <slot />
  </component>
  <a
    v-else-if="href"
    :href="href"
    :class="classes"
    :aria-disabled="loading || disabled ? 'true' : undefined">
    <svg
      v-if="loading"
      class="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24">
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
    <slot />
  </a>
  <button v-else :type="type" :class="classes" :disabled="disabled || loading">
    <svg
      v-if="loading"
      class="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24">
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
    <slot />
  </button>
</template>
