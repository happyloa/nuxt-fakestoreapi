<template>
  <div class="inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-300">
    <svg
      class="h-5 w-5 animate-spin text-brand"
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
    <span>
      <slot>{{ $t('ui.loading') }}</slot>
    </span>
  </div>
</template>
