<script setup lang="ts">
const props = defineProps<{
  subtotal: number
  estimatedTax: number
  grandTotal: number
  loading: boolean
  disabled: boolean
}>()

const emit = defineEmits<{ (e: 'checkout'): void }>()

const { t } = useI18n()
</script>

<template>
  <div class="card space-y-4">
    <h2 class="text-xl font-semibold text-slate-900">{{ t('cart.summary.title') }}</h2>
    <div class="space-y-3 text-sm text-slate-600">
      <div class="flex items-center justify-between">
        <span>{{ t('cart.summary.subtotal') }}</span>
        <span class="font-semibold text-slate-900">${{ props.subtotal.toFixed(2) }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span>{{ t('cart.summary.tax') }}</span>
        <span class="font-semibold text-slate-900">${{ props.estimatedTax.toFixed(2) }}</span>
      </div>
    </div>
    <div class="flex items-center justify-between border-t border-dashed border-slate-200 pt-3 text-lg font-bold text-slate-900">
      <span>{{ t('cart.summary.total') }}</span>
      <span>${{ props.grandTotal.toFixed(2) }}</span>
    </div>
    <button
      type="button"
      class="w-full rounded-full bg-primary-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
      :disabled="props.disabled"
      @click="emit('checkout')"
    >
      <span v-if="props.loading" class="flex items-center justify-center gap-2">
        <span class="h-4 w-4 animate-spin rounded-full border-2 border-primary-200 border-t-white" />
        {{ t('cart.actions.processing') }}
      </span>
      <span v-else>
        {{ t('cart.actions.checkout') }}
      </span>
    </button>
    <p class="text-xs text-slate-400">{{ t('cart.summary.note') }}</p>
  </div>
</template>
