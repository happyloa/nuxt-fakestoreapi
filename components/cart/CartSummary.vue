<script setup lang="ts">
const props = defineProps<{
  total: number;
  count: number;
}>();
</script>

<template>
  <section class="card-surface space-y-4 p-6">
    <h2 class="text-xl font-semibold text-white">
      {{ $t("cart.summary.title") }}
    </h2>
    <div class="flex items-center justify-between text-sm text-slate-300">
      <span>{{ $t("cart.summary.items") }}</span>
      <span>{{ props.count }}</span>
    </div>
    <div class="flex items-center justify-between text-sm text-slate-300">
      <span>{{ $t("cart.summary.total") }}</span>
      <span class="text-lg font-semibold text-brand-light">${{ props.total.toFixed(2) }}</span>
    </div>
    <button
      type="button"
      class="w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-light"
      :disabled="props.count === 0"
    >
      {{ $t("cart.summary.checkout") }}
    </button>
  </section>
</template>
