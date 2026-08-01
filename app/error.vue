<script setup lang="ts">
import type { NuxtError } from "#app"

const props = defineProps<{ error: NuxtError }>()
const { t } = useI18n()
const localePath = useLocalePath()

const isMissing = computed(() => props.error.statusCode === 404)

useSeoMeta({ robots: "noindex, nofollow" })
</script>

<template>
  <main class="grid min-h-screen place-items-center bg-stone-50 px-6 dark:bg-slate-950">
    <section class="max-w-lg text-center">
      <p class="text-sm font-semibold tracking-[0.18em] text-blue-600 dark:text-blue-400">
        {{ error.statusCode }}
      </p>
      <h1 class="mt-4 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
        {{ isMissing ? t("errors.notFound.title") : t("errors.generic.title") }}
      </h1>
      <p class="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">
        {{ isMissing ? t("errors.notFound.description") : t("errors.generic.description") }}
      </p>
      <NuxtLink :to="localePath('/')" class="btn-primary mt-8 inline-flex">
        {{ t("common.backToStore") }}
      </NuxtLink>
    </section>
  </main>
</template>
