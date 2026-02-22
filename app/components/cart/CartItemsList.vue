<script setup lang="ts">
import type { CartItem } from "~/stores/cart";

defineEmits<{
  (e: "increment", id: number): void;
  (e: "decrement", id: number): void;
  (e: "remove", id: number): void;
}>();

interface Props {
  items?: CartItem[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  loading: false,
});
</script>

<template>
  <section class="space-y-4" aria-live="polite">
    <template v-if="loading">
      <ul class="space-y-4">
        <li v-for="index in 3" :key="`cart-skeleton-${index}`">
          <BaseCard
            class="flex animate-pulse flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-4">
              <div
                class="h-20 w-20 shrink-0 rounded-xl bg-slate-200 dark:bg-slate-700" />
              <div class="space-y-2">
                <div
                  class="h-4 w-32 rounded bg-slate-200 sm:w-40 dark:bg-slate-700" />
                <div
                  class="h-3 w-20 rounded bg-slate-100 sm:w-24 dark:bg-slate-700" />
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-700" />
              <div class="h-4 w-6 rounded bg-slate-200 dark:bg-slate-700" />
              <div class="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-700" />
              <div
                class="h-9 w-16 rounded-lg bg-slate-100 sm:w-20 dark:bg-slate-700" />
            </div>
          </BaseCard>
        </li>
      </ul>
    </template>
    <template v-else>
      <ul class="space-y-4">
        <li v-for="item in items" :key="item.id">
          <BaseCard
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-4">
              <img
                :src="item.image"
                :alt="item.title"
                class="h-20 w-20 p-1 shrink-0 rounded-xl border border-slate-100 bg-white object-contain dark:border-slate-700 dark:bg-slate-800" />
              <div>
                <h3
                  class="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
                  {{ item.title }}
                </h3>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
                  {{
                    $t("cart.itemPrice", {
                      price: Number(item.price).toFixed(2),
                    })
                  }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <BaseButton
                variant="outline"
                size="sm"
                class="w-8 h-8 !p-0 shrink-0"
                @click="
                  item.quantity === 1
                    ? $emit('remove', item.id)
                    : $emit('decrement', item.id)
                ">
                <svg
                  v-if="item.quantity === 1"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-red-500 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span v-else>-</span>
              </BaseButton>
              <span
                class="w-8 text-center text-sm font-semibold text-slate-700 dark:text-slate-200"
                >{{ item.quantity }}</span
              >
              <BaseButton
                variant="outline"
                size="sm"
                class="w-8 h-8 !p-0 shrink-0"
                @click="$emit('increment', item.id)"
                >+</BaseButton
              >
              <BaseButton
                variant="ghost"
                size="sm"
                @click="$emit('remove', item.id)">
                {{ $t("cart.remove") }}
              </BaseButton>
            </div>
          </BaseCard>
        </li>
      </ul>
    </template>
  </section>
</template>
