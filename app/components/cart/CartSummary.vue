<script setup lang="ts">
defineEmits<{
  (e: "clear"): void;
  (e: "checkout"): void;
}>();

interface Props {
  total?: number;
  itemCount?: number;
  loading?: boolean;
  checkoutLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  total: 0,
  itemCount: 0,
  loading: false,
  checkoutLoading: false,
});
</script>

<template>
  <BaseCard as="aside" class="space-y-4" aria-labelledby="cart-summary-heading">
    <BaseSectionHeading
      id="cart-summary-heading"
      :title="$t('cart.summary.title')"
      :description="$t('cart.summary.description')" />
    <div class="space-y-2 text-sm text-slate-600 dark:text-slate-300">
      <p>{{ $t("cart.summary.items", { count: itemCount }) }}</p>
      <p class="text-lg font-semibold text-slate-900 dark:text-white">
        {{ $t("cart.summary.total", { total: total.toFixed(2) }) }}
      </p>
    </div>
    <div class="space-y-2">
      <BaseButton
        :loading="checkoutLoading"
        :disabled="!itemCount"
        block
        @click="$emit('checkout')">
        {{ $t("cart.summary.checkout") }}
      </BaseButton>
      <BaseButton variant="outline" block @click="$emit('clear')">
        {{ $t("cart.summary.clear") }}
      </BaseButton>
    </div>
  </BaseCard>
</template>
