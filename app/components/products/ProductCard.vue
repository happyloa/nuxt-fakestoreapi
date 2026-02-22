<script setup lang="ts">
import type { Product } from "~/types/fakestore";

const emit = defineEmits<{
  (e: "add-to-cart", product: Product): void;
}>();

const props = defineProps<{ product: Product }>();

const product = computed(() => props.product);

/**
 * 單一商品卡片，負責呈現封面、分類與價格資訊。
 * 加入 group hover 效果：圖片放大、標題變色。
 */
const handleAddToCart = () => emit("add-to-cart", product.value);
</script>

<template>
  <BaseCard class="group flex h-full flex-col space-y-4">
    <NuxtLink :to="`/product/${product.id}`" class="flex flex-col space-y-3">
      <figure
        class="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50">
        <NuxtImg
          :src="product.image"
          :alt="product.title"
          class="mx-auto h-48 w-auto object-contain p-4 transition-transform duration-500 group-hover:scale-110" />
      </figure>
      <div>
        <p
          class="inline-flex items-center rounded-full bg-brand/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand dark:bg-brand/10 dark:text-brand-light">
          {{ product.category }}
        </p>
        <h3
          class="mt-2 line-clamp-2 text-lg font-semibold text-slate-900 transition-colors duration-200 group-hover:text-brand dark:text-white dark:group-hover:text-brand-light">
          {{ product.title }}
        </h3>
      </div>
    </NuxtLink>
    <footer
      class="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
      <BaseBadge variant="brand"
        >${{ Number(product.price).toFixed(2) }}</BaseBadge
      >
      <div class="flex items-center gap-1 text-xs font-medium">
        <svg
          class="h-4 w-4 text-amber-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true">
          <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
        <span
          >{{ product.rating?.rate ?? 0 }} ({{
            product.rating?.count ?? 0
          }})</span
        >
      </div>
    </footer>
    <BaseButton class="mt-auto" block @click="handleAddToCart">
      {{ $t("products.actions.addToCart") }}
    </BaseButton>
  </BaseCard>
</template>
