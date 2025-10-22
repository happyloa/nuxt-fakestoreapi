<script setup lang="ts">
import type { CartItem } from '~/stores/cart'

defineEmits<{
  (e: 'increment', id: number): void
  (e: 'decrement', id: number): void
  (e: 'remove', id: number): void
}>()

defineProps({
  items: {
    type: Array as () => CartItem[],
    default: () => [],
  },
})
</script>

<template>
  <div class="space-y-4">
    <BaseCard
      v-for="item in items"
      :key="item.id"
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex items-center gap-4">
        <img :src="item.image" :alt="item.title" class="h-20 w-20 rounded-xl border border-slate-100 bg-white object-contain" />
        <div>
          <h3 class="text-sm font-semibold text-slate-900 sm:text-base">
            {{ item.title }}
          </h3>
          <p class="mt-1 text-sm text-slate-500">
            {{ $t('cart.itemPrice', { price: item.price.toFixed(2) }) }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <BaseButton variant="outline" size="sm" @click="$emit('decrement', item.id)">-</BaseButton>
        <span class="w-8 text-center text-sm font-semibold text-slate-700">{{ item.quantity }}</span>
        <BaseButton variant="outline" size="sm" @click="$emit('increment', item.id)">+</BaseButton>
        <BaseButton variant="ghost" size="sm" @click="$emit('remove', item.id)">
          {{ $t('cart.remove') }}
        </BaseButton>
      </div>
    </BaseCard>
  </div>
</template>
