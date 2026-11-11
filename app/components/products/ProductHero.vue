<script setup lang="ts">
// 由 Vite 輸出帶雜湊的 /_nuxt/ 檔名，可套用長期快取。
import featuredImage from "~/assets/images/featured-backpack.webp";
import { NuxtLink } from "#components";

const store = useProductsStore();
const localePath = useLocalePath();
const categoryLabel = useCategoryLabel();
const featured = computed(() =>
  store.products.find((product) => product.id === 1),
);

// 捲到商品目錄並把焦點移到標題，鍵盤與螢幕閱讀器使用者會從目錄繼續。
// 不在網址加 #catalog：同頁 hash 會讓之後每次篩選同步網址時都被捲回目錄。
const scrollToCatalog = () => {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("catalog-heading")?.focus({ preventScroll: true });
  document
    .getElementById("catalog")
    ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
};
</script>
<template>
  <section aria-labelledby="hero-title">
    <div
      class="meta flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-rule pb-3 text-slate-500 dark:border-rule-dark dark:text-slate-400"
    >
      <span>{{ $t("products.hero.badge") }}</span>
      <span v-if="store.total" class="tabular-nums">
        {{ store.total }} {{ $t("products.stats.totalProducts") }} /
        {{ store.categories.length }} {{ $t("products.stats.categories") }} /
        {{ $n(store.averagePrice, "currency") }}
        {{ $t("products.stats.averagePrice") }}
      </span>
    </div>
    <h1
      id="hero-title"
      class="mt-8 whitespace-pre-line text-[clamp(3rem,9.2vw,8.5rem)] font-extrabold leading-display tracking-display sm:mt-10"
    >
      {{ $t("products.hero.title") }}
    </h1>
    <div class="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-10">
      <div class="flex min-w-0 flex-col gap-10 lg:col-span-4">
        <div class="space-y-7">
          <p
            class="max-w-sm text-base leading-7 text-slate-600 dark:text-slate-300"
          >
            {{ $t("products.hero.subtitle") }}
          </p>
          <a
            href="#catalog"
            :class="UNDERLINE_LINK_CLASS"
            @click.prevent="scrollToCatalog"
            >{{ $t("products.hero.ctaPrimary")
            }}<SiteIcon
              name="arrow"
              class="h-4 w-4 rotate-90 transition-transform group-hover:translate-y-0.5"
          /></a>
        </div>
        <!-- 分類索引：連到目錄並帶入分類篩選（useProductFilters 會讀取網址參數）。 -->
        <nav
          v-if="store.categories.length"
          class="mt-auto"
          :aria-label="$t('products.hero.indexTitle')"
        >
          <p class="meta mb-3 text-slate-500 dark:text-slate-400">
            {{ $t("products.hero.indexTitle") }}
          </p>
          <ul role="list" class="border-t border-rule dark:border-rule-dark">
            <li
              v-for="category in store.categories"
              :key="category"
              class="border-b border-rule dark:border-rule-dark"
            >
              <NuxtLink
                :to="{ query: { category } }"
                class="group flex min-h-11 items-center gap-3 text-sm font-semibold hover:text-brand dark:hover:text-brand-light"
                @click="scrollToCatalog"
                ><span class="flex-1">{{ categoryLabel(category) }}</span
                ><span class="font-mono text-[11px] text-slate-500 tabular-nums dark:text-slate-400">{{
                  store.categoryCounts[category] ?? 0
                }}</span
                ><SiteIcon
                  name="arrow"
                  class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              /></NuxtLink>
            </li>
          </ul>
          <p class="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {{ $t("products.hero.demoNotice") }}
          </p>
        </nav>
      </div>
      <figure class="min-w-0 lg:col-span-8">
        <component
          :is="featured ? NuxtLink : 'div'"
          :to="featured ? localePath('/product/' + featured.id) : undefined"
          class="group flex aspect-16/11 items-center justify-center overflow-hidden bg-plate sm:aspect-16/10"
        >
          <img
            :src="featuredImage"
            :alt="featured?.title ?? $t('products.hero.illustrationAlt')"
            :lang="featured ? 'en' : undefined"
            width="418"
            height="597"
            fetchpriority="high"
            class="h-[82%] w-auto max-w-[70%] object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </component>
        <figcaption
          v-if="featured"
          class="flex items-baseline gap-4 border-b border-rule py-3 text-sm dark:border-rule-dark"
        >
          <span class="meta shrink-0 text-slate-500 dark:text-slate-400"
            >{{ $t("products.hero.featured") }} /
            {{ catalogNumber(featured.id) }}</span
          >
          <span lang="en" class="min-w-0 flex-1 truncate font-semibold">{{
            featured.title
          }}</span>
          <span class="shrink-0 font-bold tabular-nums">{{
            $n(featured.price, "currency")
          }}</span>
        </figcaption>
      </figure>
    </div>
  </section>
</template>
