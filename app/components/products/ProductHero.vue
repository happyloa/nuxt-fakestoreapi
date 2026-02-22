<template>
  <section
    id="dashboard-hero"
    class="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-gradient-to-br from-brand/10 via-white to-accent/10 p-8 transition-colors duration-300 sm:p-12 dark:border-slate-800/60 dark:from-brand/20 dark:via-slate-900 dark:to-slate-950"
    data-aos="fade-up"
    data-aos-duration="800">
    <!-- 背景裝飾 -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand/5 blur-3xl dark:bg-brand/10" />
      <div
        class="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent/5 blur-3xl dark:bg-accent/10" />
    </div>
    <div class="relative grid gap-8 md:grid-cols-2 md:items-center">
      <div class="space-y-6">
        <p
          class="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand shadow-sm backdrop-blur-sm dark:bg-slate-800/80 dark:text-brand-light"
          data-aos="fade-right"
          data-aos-delay="200">
          {{ $t("products.hero.badge") }}
        </p>
        <h1
          class="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl"
          data-aos="fade-right"
          data-aos-delay="300">
          {{ $t("products.hero.title") }}
        </h1>
        <p
          class="text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300"
          data-aos="fade-right"
          data-aos-delay="400">
          {{ $t("products.hero.subtitle") }}
        </p>
        <div
          class="flex flex-col gap-3 sm:flex-row"
          data-aos="fade-right"
          data-aos-delay="500">
          <BaseButton to="/products/new" as="NuxtLink" class="w-full sm:w-auto">
            {{ $t("products.hero.ctaPrimary") }}
          </BaseButton>
          <BaseButton
            as="NuxtLink"
            to="/users"
            variant="outline"
            class="w-full sm:w-auto">
            {{ $t("products.hero.ctaSecondary") }}
          </BaseButton>
        </div>
      </div>
      <div class="relative">
        <div
          class="absolute -left-12 -top-12 hidden h-24 w-24 animate-float rounded-full border-2 border-brand/20 md:block" />
        <div
          class="absolute -right-10 bottom-10 hidden h-20 w-20 animate-float rounded-full border-2 border-accent/20 md:block"
          style="animation-delay: -3s" />
        <div
          class="absolute right-4 top-4 hidden h-12 w-12 animate-float rounded-full bg-brand/5 blur-sm md:block"
          style="animation-delay: -1.5s" />
        <NuxtImg
          src="/hero-products.svg"
          alt="Product illustration"
          class="relative z-10 mx-auto h-48 w-auto drop-shadow-2xl transition-transform duration-500 hover:scale-105 sm:h-56"
          data-aos="zoom-in"
          data-aos-delay="400" />
      </div>
    </div>
  </section>
</template>
