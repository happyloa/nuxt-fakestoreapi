<script setup lang="ts">
const store = useProductsStore();
const localePath = useLocalePath();
const featured = computed(() =>
  store.products.find((product) => product.id === 1),
);
</script>
<template>
  <section
    id="dashboard-hero"
    class="grid overflow-hidden rounded-[1.75rem] bg-[#eef0e7] dark:bg-[#2c3326] lg:grid-cols-[1.05fr_1fr]"
    aria-labelledby="hero-title"
  >
    <div
      class="flex flex-col items-start px-7 py-10 sm:px-12 sm:py-14 lg:py-16"
    >
      <p
        class="mb-5 flex items-center gap-2 text-sm font-semibold text-accent dark:text-accent-light"
      >
        <span
          class="h-2 w-2 rounded-full bg-accent dark:bg-accent-light"
          aria-hidden="true"
        />{{ $t("products.hero.badge") }}
      </p>
      <h1
        id="hero-title"
        class="max-w-lg whitespace-pre-line text-[2.6rem] font-extrabold leading-[1.2] tracking-[-0.04em] sm:text-6xl lg:text-[4.25rem]"
      >
        {{ $t("products.hero.title") }}
      </h1>
      <p
        class="mt-6 max-w-sm text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300"
      >
        {{ $t("products.hero.subtitle") }}
      </p>
      <BaseButton href="#catalog" size="lg" class="mt-8"
        >{{ $t("products.hero.ctaPrimary")
        }}<SiteIcon name="arrow" class="h-4 w-4"
      /></BaseButton>
      <p class="mt-6 text-xs leading-5 text-slate-500 dark:text-slate-300">
        {{ $t("products.hero.demoNotice") }}
      </p>
    </div>
    <div
      class="relative flex min-h-80 items-center justify-center overflow-hidden px-8 pb-10 pt-4 sm:min-h-96 lg:py-12"
    >
      <div
        class="absolute h-64 w-64 rounded-full border-[36px] border-[#e0e5d5] sm:h-80 sm:w-80 dark:border-[#3a4431]"
        aria-hidden="true"
      />
      <NuxtLink
        v-if="featured"
        :to="localePath('/product/' + featured.id)"
        :aria-label="featured.title"
        class="group relative z-10 flex h-full w-full items-center justify-center pb-20 lg:pb-14"
      >
        <img
          src="/images/featured-backpack.png"
          :alt="featured.title"
          width="640"
          height="640"
          fetchpriority="high"
          class="h-64 w-64 object-contain drop-shadow-2xl transition-transform duration-300 group-hover:-rotate-3 sm:h-80 sm:w-80 lg:h-96 lg:w-96"
        />
      </NuxtLink>
      <img
        v-else
        src="/images/featured-backpack.png"
        :alt="$t('products.hero.illustrationAlt')"
        width="640"
        height="640"
        fetchpriority="high"
        class="relative h-64 w-64 object-contain drop-shadow-xl sm:h-80 sm:w-80"
      />
      <NuxtLink
        v-if="featured"
        :to="localePath('/product/' + featured.id)"
        class="absolute inset-x-6 bottom-6 z-20 flex items-center gap-4 rounded-xl bg-white/95 p-4 shadow-card sm:inset-x-12 dark:bg-slate-900/95"
      >
        <div class="min-w-0 flex-1">
          <p class="mb-1 text-xs text-slate-500 dark:text-slate-400">
            {{ $t("products.hero.featured") }}
          </p>
          <p class="truncate text-sm font-bold">{{ featured.title }}</p>
        </div>
        <span class="shrink-0 text-sm font-bold">{{
          $n(featured.price, "currency")
        }}</span
        ><SiteIcon name="arrow" class="h-4 w-4 shrink-0" />
      </NuxtLink>
    </div>
  </section>
</template>
