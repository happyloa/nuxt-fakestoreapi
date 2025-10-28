<script setup lang="ts">
import { computed, resolveDynamicComponent } from 'vue'

type RouteLocation = string | Record<string, any>

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

type ComponentTag = string | Record<string, any>

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    as?: ComponentTag
    to?: RouteLocation
    href?: string
    variant?: Variant
    size?: Size
    block?: boolean
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary' as Variant,
    size: 'md' as Size,
    block: false,
    loading: false,
    disabled: false,
  },
)

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
  const sizes: Record<Size, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm sm:text-base',
    lg: 'px-6 py-3 text-base sm:text-lg',
  }
  const variants: Record<Variant, string> = {
    primary:
      'bg-brand text-brand-foreground shadow hover:bg-brand-dark focus-visible:outline-brand dark:bg-brand-dark dark:hover:bg-brand dark:text-white',
    secondary:
      'bg-slate-200 text-slate-900 hover:bg-slate-300 focus-visible:outline-slate-400 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:focus-visible:outline-slate-500',
    outline:
      'border border-slate-300 bg-white text-slate-900 hover:bg-slate-100 focus-visible:outline-brand dark:border-slate-600 dark:bg-transparent dark:text-slate-100 dark:hover:bg-slate-800/60',
    ghost:
      'text-slate-600 hover:bg-slate-100 focus-visible:outline-brand dark:text-slate-300 dark:hover:bg-slate-800/60 dark:focus-visible:outline-brand',
  }
  const width = props.block ? 'w-full' : ''
  return [base, sizes[props.size], variants[props.variant], width].join(' ')
})

const componentTag = computed<ComponentTag>(() => {
  if (props.as) {
    return resolveDynamicComponent(props.as as any) as ComponentTag
  }

  if (props.to) {
    return resolveDynamicComponent('NuxtLink') as ComponentTag
  }

  if (props.href) {
    return 'a'
  }

  return 'button'
})

const isButton = computed(() => {
  if (props.as) {
    return props.as === 'button'
  }

  return !props.to && !props.href
})
</script>

<template>
  <component
    :is="componentTag"
    :type="isButton ? type : undefined"
    :to="to"
    :href="href"
    :class="classes"
    :disabled="isButton ? disabled || loading : undefined"
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
