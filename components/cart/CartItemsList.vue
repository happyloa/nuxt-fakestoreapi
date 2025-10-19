<script setup lang="ts">
import type { CartItem } from '~/stores/cart'

const props = defineProps<{
  items: CartItem[]
}>()

const emit = defineEmits<{
  (e: 'update-quantity', id: number, value: string): void
  (e: 'remove', id: number): void
}>()

const { t } = useI18n()
</script>

<template>
  <div class="space-y-4">
    <article
      v-for="item in props.items"
      :key="item.id"
      class="card flex flex-col gap-4 md:flex-row md:items-center"
    >
      <img
        :src="item.image"
        :alt="item.title"
        class="h-32 w-32 rounded-2xl border border-slate-100 bg-slate-50 object-contain"
        loading="lazy"
      />
      <div class="flex-1 space-y-2">
        <h2 class="text-lg font-semibold text-slate-900">{{ item.title }}</h2>
        <p class="text-sm text-slate-500">{{ t('cart.itemPrice', { price: item.price.toFixed(2) }) }}</p>
        <div class="flex flex-wrap items-center gap-3">
          <label class="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600">
            {{ t('cart.quantity') }}
            <input
              :value="item.quantity"
              type="number"
              min="1"
              class="w-16 rounded-xl border border-slate-200 px-2 py-1 text-center text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
              @input="emit('update-quantity', item.id, ($event.target as HTMLInputElement).value)"
            />
          </label>
          <button
            type="button"
            class="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
            @click="emit('remove', item.id)"
          >
            {{ t('cart.actions.remove') }}
          </button>
        </div>
      </div>
      <div class="text-right text-lg font-semibold text-slate-900">${{ (item.price * item.quantity).toFixed(2) }}</div>
    </article>

    <div v-if="!props.items.length" class="card text-center text-sm text-slate-500">
      {{ t('cart.empty') }}
    </div>
  </div>
</template>
