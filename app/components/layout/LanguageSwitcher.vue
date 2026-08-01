<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { locale, setLocale, t } = useI18n();

const flags: Record<string, { emoji: string; label: string }> = {
  zh: { emoji: "🇹🇼", label: "繁體中文" },
  en: { emoji: "🇺🇸", label: "English" },
};

const nextLocale = computed(() => (locale.value === "zh" ? "en" : "zh"));
const isSwitching = ref(false);

const handleToggle = async () => {
  if (isSwitching.value) return;
  isSwitching.value = true;
  const target = nextLocale.value;
  try {
    await setLocale(target);
  } finally {
    setTimeout(() => {
      isSwitching.value = false;
    }, 300);
  }
};
</script>

<template>
  <ClientOnly>
    <button
      type="button"
      class="group relative cursor-pointer flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-brand/30 hover:bg-white hover:shadow-md dark:border-slate-600/60 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:border-brand-light/30 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
      :title="
        t('header.language.toggleLabel', { next: flags[nextLocale]?.label })
      "
      :disabled="isSwitching"
      @click="handleToggle">
      <span class="sr-only">{{
        t("header.language.toggleLabel", { next: flags[nextLocale]?.label })
      }}</span>
      <!-- Loading spinner -->
      <Transition name="fade" mode="out-in">
        <svg
          v-if="isSwitching"
          class="h-4 w-4 animate-spin text-brand dark:text-brand-light"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4" />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <span
          v-else
          class="text-base transition-transform duration-300 group-hover:scale-110"
          aria-hidden="true"
          >{{ flags[locale]?.emoji }}</span
        >
      </Transition>
      <Transition name="fade" mode="out-in">
        <span :key="locale" class="hidden sm:inline">{{
          flags[locale]?.label
        }}</span>
      </Transition>
    </button>
  </ClientOnly>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
