<script setup lang="ts">
import type { CartItem } from "~/types/fakestore";

const props = defineProps<{
  item: CartItem;
}>();

const emit = defineEmits<{
  (event: "update:quantity", quantity: number): void;
  (event: "remove"): void;
}>();
</script>

<template>
  <li class="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex w-full items-center gap-4 sm:w-auto">
      <img :src="item.image" :alt="item.title" class="h-20 w-20 rounded-xl border border-slate-800 bg-slate-950 object-cover" />
      <div class="space-y-1">
        <p class="text-sm font-semibold text-white">{{ item.title }}</p>
        <p class="text-xs text-slate-400">${{ item.price.toFixed(2) }}</p>
      </div>
    </div>

    <div class="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
      <div class="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1">
        <button type="button" class="text-lg text-slate-400 hover:text-white" @click="emit('update:quantity', item.quantity - 1)">
          -
        </button>
        <input
          :value="item.quantity"
          type="number"
          min="1"
          class="w-16 rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-center text-sm text-slate-100"
          @input="emit('update:quantity', Number(($event.target as HTMLInputElement).value))"
        />
        <button type="button" class="text-lg text-slate-400 hover:text-white" @click="emit('update:quantity', item.quantity + 1)">
          +
        </button>
      </div>
      <p class="text-sm font-semibold text-brand-light">
        ${{ (item.price * item.quantity).toFixed(2) }}
      </p>
      <button
        type="button"
        class="text-xs font-semibold uppercase tracking-wide text-rose-400 hover:text-rose-300"
        @click="emit('remove')"
      >
        {{ $t("cart.remove") }}
      </button>
    </div>
  </li>
</template>
