<script setup lang="ts">
import type { Product } from "#shared/types/fakestore";

defineEmits<{
  (e: "add-to-cart", product: Product): void;
}>();

defineProps<{
  product: Product;
}>();

const categoryLabel = useCategoryLabel();
</script>

<template>
  <article class="grid gap-10 lg:grid-cols-12 lg:gap-14">
    <figure
      class="flex aspect-square items-center justify-center bg-plate p-10 sm:p-16 lg:col-span-7"
    >
      <img
        :src="product.image"
        :alt="product.title"
        lang="en"
        width="600"
        height="600"
        fetchpriority="high"
        class="max-h-full w-auto object-contain mix-blend-multiply"
      />
    </figure>
    <div class="flex flex-col lg:col-span-5 lg:pt-2">
      <p
        class="meta flex justify-between gap-4 border-b border-rule pb-3 text-slate-500 dark:border-rule-dark dark:text-slate-400"
      >
        <span>{{ catalogNumber(product.id) }}</span
        ><span>{{ categoryLabel(product.category) }}</span>
      </p>
      <!-- 商品資料來自英文的上游 API，標示語言讓螢幕閱讀器以英文朗讀。 -->
      <h1
        lang="en"
        class="mt-6 text-[clamp(2rem,3.6vw,3.25rem)] font-extrabold leading-[1.02] tracking-heading"
      >
        {{ product.title }}
      </h1>
      <p class="mt-6 text-3xl font-bold tabular-nums tracking-[-0.02em]">
        {{ $n(product.price, "currency") }}
      </p>
      <p
        lang="en"
        class="mt-6 text-sm leading-7 text-slate-600 dark:text-slate-300"
      >
        {{ product.description }}
      </p>
      <BaseButton
        block
        size="lg"
        class="mt-8"
        @click="$emit('add-to-cart', product)"
        ><SiteIcon name="plus" class="h-4 w-4" />{{
          $t("products.actions.addToCart")
        }}</BaseButton
      >
      <p class="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
        {{ $t("cart.demoNotice") }}
      </p>
      <dl class="mt-10 border-t border-rule text-sm dark:border-rule-dark">
        <div
          v-for="row in [
            { label: $t('products.details.specs.number'), value: catalogNumber(product.id) },
            { label: $t('products.details.specs.category'), value: categoryLabel(product.category) },
            { label: $t('products.details.specs.rating'), value: `${product.rating.rate} / 5` },
            { label: $t('products.details.specs.reviews'), value: String(product.rating.count) },
          ]"
          :key="row.label"
          class="flex justify-between gap-6 border-b border-rule py-3 dark:border-rule-dark"
        >
          <dt class="text-slate-500 dark:text-slate-400">{{ row.label }}</dt>
          <dd class="font-semibold tabular-nums">{{ row.value }}</dd>
        </div>
      </dl>
    </div>
  </article>
</template>
