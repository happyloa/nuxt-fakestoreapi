<script setup lang="ts">
/**
 * 當商品列表為空時的友善提示元件。
 * 透過集中管理文案與 CTA，讓頁面維持整潔。
 */
</script>

<template>
  <article
    class="rounded-2xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900"
    aria-live="polite"
  >
    <h3 class="text-lg font-semibold text-slate-800 dark:text-white">
      {{ $t('products.empty.title') }}
    </h3>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
      {{ $t('products.empty.description') }}
    </p>
    <BaseButton as="NuxtLink" to="/products/new" class="mt-6">
      {{ $t('products.empty.cta') }}
    </BaseButton>
  </article>
</template>
