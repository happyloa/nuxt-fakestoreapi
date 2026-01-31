<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useThemeStore } from "~/stores/theme";

const props = withDefaults(defineProps<{ variant?: "inline" | "floating" }>(), {
  variant: "inline",
});

const themeStore = useThemeStore();
const { t } = useI18n();

const isDark = computed(() => themeStore.resolved === "dark");

const toggleTheme = () => {
  themeStore.toggle();
};

const buttonClasses = computed(() =>
  props.variant === "floating"
    ? "inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-300/60 bg-white/80 text-slate-700 shadow-lg shadow-slate-900/10 ring-1 ring-slate-900/5 transition hover:bg-white dark:border-slate-600 dark:bg-slate-800/90 dark:text-slate-100 dark:shadow-black/20 dark:hover:bg-slate-700"
    : "flex items-center gap-2 rounded-full border border-slate-300/60 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-white dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-700",
);
</script>

<template>
  <ClientOnly>
    <button
      type="button"
      class="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
      :class="buttonClasses"
      :aria-pressed="isDark"
      :aria-label="t('header.theme.toggleLabel')"
      :title="isDark ? t('header.theme.light') : t('header.theme.dark')"
      @click="toggleTheme">
      <span class="sr-only">{{ t("header.theme.toggleLabel") }}</span>
      <svg
        v-if="isDark"
        class="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true">
        <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
      </svg>
      <svg
        v-else
        class="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path
          d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M8.05 15.95l-1.414 1.414m0-11.314l1.414 1.414m10.607 10.607l-1.414-1.414" />
      </svg>
      <span v-if="props.variant === 'inline'" class="hidden sm:inline">{{
        isDark ? t("header.theme.light") : t("header.theme.dark")
      }}</span>
    </button>
  </ClientOnly>
</template>
