<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
  showRetry?: boolean
}>()

const emit = defineEmits<{
  (e: 'retry'): void
}>()

const handleRetry = () => {
  if (props.showRetry) {
    emit('retry')
  }
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-14 text-center text-slate-300 shadow-inner shadow-black/20"
  >
    <div
      class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-3xl text-brand-light"
      aria-hidden="true"
    >
      🛍️
    </div>
    <h2 class="text-lg font-semibold text-white">
      {{ title }}
    </h2>
    <p class="mt-2 max-w-md text-sm text-slate-400">
      {{ description }}
    </p>
    <button
      v-if="showRetry"
      type="button"
      class="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      @click="handleRetry"
    >
      <span>{{ $t('products.retry') }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        class="h-4 w-4"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M16.023 9.348h4.992v-4.992"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M2.985 19.644v-4.992"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3 14.652c.563 1.488 1.707 2.778 3.363 3.624 3.03 1.5 6.737.492 8.754-2.316M21 9.348c-.563-1.488-1.707-2.778-3.363-3.624C14.607 4.224 10.9 5.232 8.883 8.04"
        />
      </svg>
    </button>
  </div>
</template>
