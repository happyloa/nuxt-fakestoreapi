<script setup lang="ts">
import type { NuxtError } from "#app";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  error: NuxtError;
}>();

const { t, locale } = useI18n();
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
  title: () => `${errorTitle.value} | Storefront Lab`,
  robots: "noindex, nofollow",
});
useHead(() => ({
  htmlAttrs: { lang: locale.value === "zh" ? "zh-TW" : "en-US" },
}));
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-paper px-6 text-slate-900 dark:bg-slate-950 dark:text-white"
  >
    <div class="max-w-lg space-y-6 py-16 text-center">
      <p class="text-sm font-bold text-brand dark:text-brand-light">
        Storefront Lab
      </p>
      <h1 class="text-6xl font-extrabold tracking-tight">
        {{ errorTitle }}
      </h1>
      <p class="text-sm leading-7 text-slate-600 dark:text-slate-400">
        {{
          error.statusCode === 404 ? t("error.desc404") : t("error.descGeneric")
        }}
      </p>
      <BaseButton size="lg" @click="handleError"
        >{{ t("error.backToHome") }}<SiteIcon name="arrow" class="h-4 w-4"
      /></BaseButton>
    </div>
  </div>
</template>
