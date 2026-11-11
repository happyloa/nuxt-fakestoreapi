<script setup lang="ts">
import { MAX_LINE_QUANTITY } from "#shared/utils/limits";
import type { CartItem } from "~/utils/cart";

defineEmits<{
  (e: "increment", id: number): void;
  (e: "decrement", id: number): void;
  (e: "remove", id: number): void;
}>();

withDefaults(
  defineProps<{
    items?: CartItem[];
    loading?: boolean;
  }>(),
  {
    items: () => [],
    loading: false,
  },
);

const stepClass =
  "flex h-10 w-10 items-center justify-center text-base transition-colors hover:bg-slate-900 hover:text-paper disabled:pointer-events-none disabled:opacity-30 dark:hover:bg-paper dark:hover:text-slate-950";
</script>

<template>
  <section>
    <ul
      v-if="loading"
      class="divide-y divide-rule border-y border-rule dark:divide-rule-dark dark:border-rule-dark"
      aria-busy="true"
    >
      <li
        v-for="index in 3"
        :key="`cart-skeleton-${index}`"
        class="flex items-center gap-4 py-5"
      >
        <BaseSkeleton width="5rem" height="5rem" />
        <div class="flex-1 space-y-2">
          <BaseSkeleton width="60%" />
          <BaseSkeleton width="25%" height="0.75rem" />
        </div>
      </li>
    </ul>
    <ul
      v-else-if="items.length"
      role="list"
      class="divide-y divide-rule border-y border-rule dark:divide-rule-dark dark:border-rule-dark"
    >
      <li
        v-for="item in items"
        :key="item.id"
        class="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 gap-y-4 py-5 sm:grid-cols-[5.5rem_minmax(0,1fr)_auto] sm:items-center"
      >
        <span
          class="flex aspect-square items-center justify-center bg-plate p-2"
          ><img
            :src="item.image"
            alt=""
            width="88"
            height="88"
            loading="lazy"
            class="max-h-full object-contain mix-blend-multiply"
        /></span>
        <div class="min-w-0">
          <p class="meta text-slate-500 dark:text-slate-400">
            {{ catalogNumber(item.id) }}
          </p>
          <h3 lang="en" class="mt-1 text-sm font-semibold leading-5 sm:text-[15px]">
            {{ item.title }}
          </h3>
          <p class="mt-1 text-sm tabular-nums text-slate-500 dark:text-slate-400">
            {{ $n(Number(item.price), "currency") }}
          </p>
        </div>
        <div
          class="col-start-2 flex items-center justify-between gap-5 sm:col-start-auto sm:justify-end"
        >
          <div
            class="flex items-center border border-slate-900 dark:border-paper/70"
          >
            <button
              type="button"
              :class="stepClass"
              :aria-label="
                item.quantity === 1
                  ? $t('cart.a11y.removeItem', { title: item.title })
                  : $t('cart.a11y.decreaseQty', { title: item.title })
              "
              @click="
                item.quantity === 1
                  ? $emit('remove', item.id)
                  : $emit('decrement', item.id)
              "
            >
              −
            </button>
            <span class="w-8 text-center text-sm font-semibold tabular-nums">{{
              item.quantity
            }}</span>
            <button
              type="button"
              :class="stepClass"
              :disabled="item.quantity >= MAX_LINE_QUANTITY"
              :aria-label="$t('cart.a11y.increaseQty', { title: item.title })"
              @click="$emit('increment', item.id)"
            >
              +
            </button>
          </div>
          <div class="text-right">
            <p class="text-sm font-bold tabular-nums">
              {{ $n(item.price * item.quantity, "currency") }}
            </p>
            <button
              type="button"
              class="min-h-6 py-1 text-xs text-slate-500 underline underline-offset-4 hover:text-slate-900 dark:text-slate-400 dark:hover:text-paper"
              @click="$emit('remove', item.id)"
            >
              {{ $t("cart.remove") }}
            </button>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>
