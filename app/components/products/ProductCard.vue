<script setup lang="ts">
import type { Product } from "#shared/types/fakestore";
defineProps<{ product: Product }>();
defineEmits<{ (e: "add-to-cart", product: Product): void }>();
const localePath = useLocalePath();
const categoryLabel = useCategoryLabel();
</script>
<template>
  <article
    class="group relative flex h-full flex-col p-3 transition-colors hover:bg-white/60 sm:p-5 dark:hover:bg-white/[0.03]"
  >
    <p
      class="meta flex justify-between gap-3 text-slate-500 dark:text-slate-400"
    >
      <span class="shrink-0">{{ catalogNumber(product.id) }}</span
      ><span class="truncate">{{ categoryLabel(product.category) }}</span>
    </p>
    <!-- 整張卡片可點擊：連結以 ::after 蓋住卡片，加入按鈕再疊在上層。 -->
    <NuxtLink
      :to="localePath('/product/' + product.id)"
      class="mt-3 block after:absolute after:inset-0"
    >
      <span
        class="flex aspect-4/5 items-center justify-center overflow-hidden bg-plate p-5 sm:p-8"
      >
        <!-- 同一連結內已有商品標題，圖片設為裝飾性以免連結名稱重複朗讀。 -->
        <img
          :src="product.image"
          alt=""
          width="360"
          height="450"
          loading="lazy"
          class="max-h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </span>
      <h3
        lang="en"
        class="mt-4 line-clamp-2 min-h-10 text-sm font-semibold leading-5 sm:text-[15px]"
      >
        {{ product.title }}
      </h3>
    </NuxtLink>
    <p class="mt-1.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
      <span aria-hidden="true"
        >★ {{ product.rating.rate }} ({{ product.rating.count }})</span
      ><span class="sr-only">{{
        $t("products.ratingSummary", {
          rate: product.rating.rate,
          count: product.rating.count,
        })
      }}</span>
    </p>
    <!-- 窄螢幕（320px）時價格與按鈕可換行，避免按鈕跨出格線。 -->
    <div class="mt-auto flex flex-wrap items-end justify-between gap-2 pt-5">
      <span class="text-base font-bold tabular-nums sm:text-lg">{{
        $n(product.price, "currency")
      }}</span
      ><button
        type="button"
        :aria-label="
          $t('products.actions.addNamedToCart', { title: product.title })
        "
        class="relative z-10 inline-flex min-h-10 items-center gap-1 border border-slate-900 px-3 text-xs font-bold transition-colors hover:bg-slate-900 hover:text-paper dark:border-paper/70 dark:hover:bg-paper dark:hover:text-slate-950"
        @click="$emit('add-to-cart', product)"
      >
        <SiteIcon name="plus" class="h-3.5 w-3.5" />{{
          $t("products.actions.add")
        }}
      </button>
    </div>
  </article>
</template>
