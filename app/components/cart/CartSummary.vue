<script setup lang="ts">
defineEmits<{
  (e: "clear"): void;
  (e: "checkout"): void;
}>();

interface Props {
  total?: number;
  itemCount?: number;
  checkoutLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  total: 0,
  itemCount: 0,
  checkoutLoading: false,
});
</script>

<template>
  <BaseCard
    as="section"
    class="space-y-6 lg:sticky lg:top-28"
    aria-labelledby="cart-summary-heading"
    background="bg-slate-100 dark:bg-slate-900"
  >
    <h2 id="cart-summary-heading" class="text-xl font-extrabold">
      {{ $t("cart.summary.title") }}
    </h2>
    <p class="text-sm text-slate-600 dark:text-slate-400">
      {{ $t("cart.summary.items", { count: itemCount }) }}
    </p>
    <div class="border-y border-slate-200 py-5 dark:border-slate-700">
      <p class="text-2xl font-extrabold tracking-tight">
        {{ $t("cart.summary.total", { total: $n(total, "currency") }) }}
      </p>
    </div>
    <BaseButton
      :loading="checkoutLoading"
      :disabled="!itemCount"
      block
      @click="$emit('checkout')"
      >{{ $t("cart.summary.checkout") }}<SiteIcon name="arrow" class="h-4 w-4"
    /></BaseButton>
    <BaseButton
      variant="ghost"
      :disabled="!itemCount || checkoutLoading"
      block
      @click="$emit('clear')"
      >{{ $t("cart.summary.clear") }}</BaseButton
    >
    <p class="text-xs leading-5 text-slate-500 dark:text-slate-400">
      {{ $t("cart.demoNotice") }}
    </p>
  </BaseCard>
</template>
