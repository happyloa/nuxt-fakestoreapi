<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-primary-50 via-slate-50 to-white">
    <div
      class="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"
    >
      <div class="max-w-2xl space-y-6">
        <p class="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1 text-sm font-semibold text-primary-700">
          {{ t('home.badge') }}
        </p>
        <h1 class="text-4xl font-bold text-slate-900 sm:text-5xl">
          {{ t('home.title') }}
        </h1>
        <p class="text-lg text-slate-600">
          {{ t('home.subtitle') }}
        </p>
        <div class="flex flex-wrap gap-3">
          <NuxtLink to="/products" class="link-button text-base">
            {{ t('home.actions.browseProducts') }}
          </NuxtLink>
          <NuxtLink
            to="/products/new"
            class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-base font-semibold text-slate-700 transition hover:border-primary-200 hover:bg-primary-50"
          >
            {{ t('home.actions.createProduct') }}
          </NuxtLink>
        </div>
        <dl class="grid gap-6 sm:grid-cols-3">
          <div class="rounded-2xl bg-white/80 p-5 shadow-sm backdrop-blur">
            <dt class="text-sm font-medium text-slate-500">{{ t('home.stats.catalogue') }}</dt>
            <dd class="mt-2 text-3xl font-semibold text-primary-700">20+</dd>
          </div>
          <div class="rounded-2xl bg-white/80 p-5 shadow-sm backdrop-blur">
            <dt class="text-sm font-medium text-slate-500">{{ t('home.stats.apiCoverage') }}</dt>
            <dd class="mt-2 text-3xl font-semibold text-primary-700">100%</dd>
          </div>
          <div class="rounded-2xl bg-white/80 p-5 shadow-sm backdrop-blur">
            <dt class="text-sm font-medium text-slate-500">{{ t('home.stats.responseTime') }}</dt>
            <dd class="mt-2 text-3xl font-semibold text-primary-700">~120ms</dd>
          </div>
        </dl>
      </div>

      <div class="relative w-full max-w-xl self-center rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-slate-800">{{ t('home.previewTitle') }}</h2>
          <NuxtLink to="/cart" class="text-sm font-semibold text-primary-600 hover:text-primary-700">
            {{ t('home.previewAction') }}
          </NuxtLink>
        </div>
        <div class="space-y-4">
          <div class="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/90 px-4 py-3">
            <div>
              <p class="text-sm font-semibold text-slate-700">{{ t('home.previewCartTitle') }}</p>
              <p class="text-xs text-slate-400">{{ t('home.previewCartSubtitle') }}</p>
            </div>
            <span class="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
              {{ t('home.previewCartStatus') }}
            </span>
          </div>
          <div class="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-slate-500">
            <p class="font-semibold text-slate-700">{{ t('home.previewHintTitle') }}</p>
            <p class="mt-1 leading-relaxed">{{ t('home.previewHintDescription') }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
