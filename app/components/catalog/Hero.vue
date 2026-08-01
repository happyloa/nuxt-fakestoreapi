<script setup lang="ts">
// Keep primary actions close to the catalog context.
const localePath = useLocalePath()
</script>

<template>
  <section class="grid gap-8 border-b border-slate-200 pb-10 dark:border-slate-800 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] lg:items-end">
    <div>
      <p class="eyebrow">{{ $t("home.eyebrow") }}</p>
      <h1 class="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
        {{ $t("home.title") }}
      </h1>
      <p class="mt-5 max-w-2xl text-pretty text-base leading-8 text-slate-600 dark:text-slate-300">
        {{ $t("home.description") }}
      </p>
      <div class="mt-7 flex flex-wrap gap-3">
        <a class="btn-primary" href="#catalog">
          {{ $t("home.browse") }}
        </a>
        <NuxtLink class="btn-secondary" :to="localePath('/cart')">
          {{ $t("home.cartCta") }}
        </NuxtLink>
      </div>
    </div>

    <dl class="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
      <div class="info-card">
        <dt>{{ $t("home.promiseOneTitle") }}</dt>
        <dd>{{ $t("home.promiseOneText") }}</dd>
      </div>
      <div class="info-card">
        <dt>{{ $t("home.promiseTwoTitle") }}</dt>
        <dd>{{ $t("home.promiseTwoText") }}</dd>
      </div>
      <div class="info-card">
        <dt>{{ $t("home.promiseThreeTitle") }}</dt>
        <dd>{{ $t("home.promiseThreeText") }}</dd>
      </div>
    </dl>
  </section>
</template>
