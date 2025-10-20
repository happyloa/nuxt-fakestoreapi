<template>
  <section class="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 p-10 shadow-glow">
    <div class="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
      <div class="space-y-6">
        <span class="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-light">
          {{ $t("home.hero.badge") }}
        </span>
        <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {{ $t("home.hero.title") }}
        </h1>
        <p class="text-base text-slate-300 sm:text-lg">
          {{ $t("home.hero.subtitle") }}
        </p>
        <div class="flex flex-wrap gap-3">
          <NuxtLink
            to="/products"
            class="inline-flex items-center rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-brand/20 transition hover:bg-brand-light"
          >
            {{ $t("home.hero.ctaPrimary") }}
          </NuxtLink>
          <NuxtLink
            to="/products/new"
            class="inline-flex items-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand hover:text-white"
          >
            {{ $t("home.hero.ctaSecondary") }}
          </NuxtLink>
        </div>
      </div>

      <div class="relative hidden h-full w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-6 lg:block">
        <div class="space-y-4">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-brand-light">
            {{ $t("home.hero.metricsTitle") }}
          </p>
          <div class="grid gap-4">
            <div class="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p class="text-xs text-slate-400">{{ $t("home.hero.products") }}</p>
              <p class="mt-2 text-2xl font-semibold text-white">+20</p>
            </div>
            <div class="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p class="text-xs text-slate-400">{{ $t("home.hero.users") }}</p>
              <p class="mt-2 text-2xl font-semibold text-white">+10K</p>
            </div>
          </div>
        </div>
        <div class="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-brand/20 blur-3xl"></div>
      </div>
    </div>
  </section>
</template>
