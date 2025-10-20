<script setup lang="ts">
import { useFakeStoreApi } from "~/composables/useFakeStoreApi";
import type { Product } from "~/types/fakestore";

useSeoMeta({
  title: "Nuxt Fake Store",
  ogTitle: "Nuxt Fake Store",
  description: "Fake Store API showcase built with Nuxt 4 and Tailwind CSS.",
  ogDescription: "Fake Store API showcase built with Nuxt 4 and Tailwind CSS.",
});

const api = useFakeStoreApi();

const { data: products, pending } = await useAsyncData<Product[]>("home-products", () =>
  api.listProducts(),
);

const { data: categories } = await useAsyncData<string[]>("home-categories", () =>
  api.listCategories(),
);

const featuredProducts = computed(() => products.value?.slice(0, 6) ?? []);
</script>

<template>
  <div class="space-y-12">
    <ProductHero />

    <section class="space-y-6">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 class="section-title">
            {{ $t("home.featured.title") }}
          </h2>
          <p class="mt-2 text-sm text-slate-400">
            {{ $t("home.featured.subtitle") }}
          </p>
        </div>
        <NuxtLink to="/products" class="text-sm font-semibold text-brand-light hover:text-brand">
          {{ $t("home.featured.viewAll") }} →
        </NuxtLink>
      </div>
      <ProductGrid :products="featuredProducts" :loading="pending">
        <template #empty>
          <p class="text-center text-slate-400">
            {{ $t("products.empty") }}
          </p>
        </template>
      </ProductGrid>
    </section>

    <section class="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div class="card-surface space-y-6 p-8">
        <h2 class="text-2xl font-semibold text-white">
          {{ $t("home.categories.title") }}
        </h2>
        <p class="text-sm text-slate-400">
          {{ $t("home.categories.subtitle") }}
        </p>
        <div class="flex flex-wrap gap-3">
          <span
            v-for="category in categories ?? []"
            :key="category"
            class="rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm text-slate-200"
          >
            {{ category }}
          </span>
        </div>
      </div>
      <div class="card-surface space-y-4 p-8">
        <h2 class="text-2xl font-semibold text-white">
          {{ $t("home.quickActions.title") }}
        </h2>
        <p class="text-sm text-slate-400">
          {{ $t("home.quickActions.subtitle") }}
        </p>
        <div class="flex flex-col gap-3 text-sm">
          <NuxtLink
            to="/products/new"
            class="rounded-xl border border-slate-800 px-4 py-3 text-slate-200 transition hover:border-brand hover:text-white"
          >
            {{ $t("home.quickActions.createProduct") }}
          </NuxtLink>
          <NuxtLink
            to="/cart"
            class="rounded-xl border border-slate-800 px-4 py-3 text-slate-200 transition hover:border-brand hover:text-white"
          >
            {{ $t("home.quickActions.viewCart") }}
          </NuxtLink>
          <NuxtLink
            to="/users"
            class="rounded-xl border border-slate-800 px-4 py-3 text-slate-200 transition hover:border-brand hover:text-white"
          >
            {{ $t("home.quickActions.manageUsers") }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
