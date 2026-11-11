<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{
  error: NuxtError;
}>();

const { t } = useI18n();
const localeHead = useLocaleHead();
const localePath = useLocalePath();
const errorTitle = computed(() =>
  props.error.statusCode === 404
    ? t("error.title404")
    : t("error.titleGeneric"),
);

const handleError = () => {
  clearError({ redirect: localePath("/") });
};

useSeoMeta({
  title: () => `${errorTitle.value}｜Storefront Lab`,
  robots: "noindex, nofollow",
});
// error.vue 不經過 layout，語系屬性要自行設定。
useHead(() => ({ htmlAttrs: { lang: localeHead.value.htmlAttrs.lang } }));
</script>

<template>
  <div
    class="flex min-h-screen items-center bg-paper px-5 text-slate-900 sm:px-8 lg:px-10 dark:bg-slate-950 dark:text-paper"
  >
    <main class="mx-auto w-full max-w-7xl space-y-6 py-16">
      <p
        class="meta border-b border-rule pb-3 text-slate-500 dark:border-rule-dark dark:text-slate-400"
      >
        Storefront Lab
      </p>
      <p
        class="text-[clamp(6rem,24vw,18rem)] font-extrabold leading-[0.8] tracking-[-0.07em] tabular-nums"
        aria-hidden="true"
      >
        {{ error.statusCode }}
      </p>
      <h1 class="text-3xl font-extrabold tracking-heading sm:text-4xl">
        {{ errorTitle }}
      </h1>
      <p class="max-w-md text-sm leading-7 text-slate-600 dark:text-slate-400">
        {{
          error.statusCode === 404 ? t("error.desc404") : t("error.descGeneric")
        }}
      </p>
      <BaseButton size="lg" @click="handleError"
        >{{ t("error.backToHome") }}<SiteIcon name="arrow" class="h-4 w-4"
      /></BaseButton>
    </main>
  </div>
</template>
