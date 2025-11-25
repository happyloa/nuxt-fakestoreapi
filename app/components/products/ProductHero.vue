<template>
  <section
    id="dashboard-hero"
    class="overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-brand/18 via-white/90 to-slate-100/80 p-8 shadow-card backdrop-blur transition-colors duration-200 sm:p-12 dark:border-slate-800/70 dark:from-brand/28 dark:via-slate-900/80 dark:to-slate-950/90"
  >
    <!-- 首屏 Hero 區塊：採用新版高對比漸層，凸顯品牌色 -->
    <div class="grid gap-8 md:grid-cols-2 md:items-center">
      <div class="space-y-6">
        <p class="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-brand shadow-sm dark:bg-slate-800/80 dark:text-brand-light">
          {{ $t('products.hero.badge') }}
        </p>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {{ $t('products.hero.title') }}
        </h1>
        <p class="text-base text-slate-600 sm:text-lg dark:text-slate-300">
          {{ $t('products.hero.subtitle') }}
        </p>
        <div class="flex flex-col gap-3 sm:flex-row">
          <BaseButton to="/products/new" as="NuxtLink" class="w-full sm:w-auto">
            {{ $t('products.hero.ctaPrimary') }}
          </BaseButton>
          <BaseButton as="NuxtLink" to="/users" variant="outline" class="w-full sm:w-auto">
            {{ $t('products.hero.ctaSecondary') }}
          </BaseButton>
        </div>
      </div>
      <div class="relative">
        <div class="absolute -left-12 -top-12 hidden h-24 w-24 rounded-full border border-brand/30 md:block"></div>
        <div class="absolute -right-10 bottom-10 hidden h-24 w-24 rounded-full border border-accent/30 md:block"></div>
        <img
          src="/hero-products.svg"
          alt="Product illustration"
          class="relative z-10 mx-auto h-48 w-auto drop-shadow-xl"
        />
      </div>
    </div>
  </section>
</template>
