<script setup lang="ts">
defineEmits<{
  (e: 'clear'): void
}>()

defineProps({
  total: {
    type: Number,
    default: 0,
  },
  itemCount: {
    type: Number,
    default: 0,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <BaseCard
    as="aside"
    class="space-y-4"
    aria-labelledby="cart-summary-heading"
  >
    <BaseSectionHeading
      id="cart-summary-heading"
      :title="$t('cart.summary.title')"
      :description="$t('cart.summary.description')"
    />
    <div class="space-y-2 text-sm text-slate-600">
      <p>{{ $t('cart.summary.items', { count: itemCount }) }}</p>
      <p class="text-lg font-semibold text-slate-900">
        {{ $t('cart.summary.total', { total: total.toFixed(2) }) }}
      </p>
    </div>
    <div class="space-y-2">
      <BaseButton :loading="loading" block>
        {{ $t('cart.summary.checkout') }}
      </BaseButton>
      <BaseButton variant="outline" block @click="$emit('clear')">
        {{ $t('cart.summary.clear') }}
      </BaseButton>
    </div>
  </BaseCard>
</template>
