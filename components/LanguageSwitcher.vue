<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";

const { locale, setLocale } = useI18n();
const router = useRouter();
const route = useRoute();
const currentLanguage = computed(() => locale.value);

const toggleLanguage = async () => {
  const newLocale = currentLanguage.value === "en" ? "zh" : "en";
  await setLocale(newLocale);
  if (newLocale === "zh") {
    router.push({ path: route.fullPath.replace(/^\/en/, "") });
  } else if (!route.fullPath.startsWith("/en")) {
    router.push({ path: `/en${route.fullPath}` });
  }
};
</script>

<template>
  <button
    type="button"
    class="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-sm font-semibold uppercase text-slate-200 shadow-glow transition hover:border-brand hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    @click="toggleLanguage"
  >
    {{ currentLanguage === "zh" ? "中" : "EN" }}
    <span class="sr-only">{{ $t("navigation.toggleLanguage") }}</span>
  </button>
</template>
