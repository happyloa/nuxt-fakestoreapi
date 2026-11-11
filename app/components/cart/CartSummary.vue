<script setup lang="ts">
defineEmits<{
  (e: "clear"): void;
  (e: "checkout"): void;
}>();

withDefaults(
  defineProps<{
    total?: number;
    itemCount?: number;
    loading?: boolean;
  }>(),
  {
    total: 0,
    itemCount: 0,
    loading: false,
  },
);
</script>

<template>
  <!-- 收據式摘要：上方粗線、品項與總額以細線分隔。 -->
  <section
    class="border-t-2 border-slate-900 pt-5 lg:sticky lg:top-24 dark:border-paper"
    aria-labelledby="cart-summary-heading"
  >
    <h2 id="cart-summary-heading" class="meta text-slate-500 dark:text-slate-400">
      {{ $t("cart.summary.title") }}
    </h2>
    <p
      class="mt-5 flex justify-between border-b border-rule pb-3 text-sm dark:border-rule-dark"
    >
      {{ $t("cart.summary.items", { count: itemCount }) }}
    </p>
    <p
      class="mt-4 text-3xl font-extrabold tabular-nums tracking-heading"
    >
      {{ $t("cart.summary.total", { total: $n(total, "currency") }) }}
    </p>
    <div class="mt-6 space-y-2">
      <BaseButton
        :loading="loading"
        :disabled="!itemCount"
        block
        size="lg"
        @click="$emit('checkout')"
        >{{ $t("cart.summary.checkout")
        }}<SiteIcon name="arrow" class="h-4 w-4"
      /></BaseButton>
      <BaseButton
        variant="ghost"
        :disabled="!itemCount || loading"
        block
        @click="$emit('clear')"
        >{{ $t("cart.summary.clear") }}</BaseButton
      >
    </div>
    <p class="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
      {{ $t("cart.demoNotice") }}
    </p>
  </section>
</template>
