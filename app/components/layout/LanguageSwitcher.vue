<script setup lang="ts">
const { locale, setLocale, t } = useI18n();
const nextLocale = computed(() => (locale.value === "zh" ? "en" : "zh"));
const isSwitching = ref(false);
const toggle = async () => {
  if (isSwitching.value) return;
  isSwitching.value = true;
  try {
    await setLocale(nextLocale.value);
  } finally {
    isSwitching.value = false;
  }
};
</script>
<template>
  <button
    type="button"
    class="flex h-11 min-w-11 items-center justify-center px-2 text-[13px] font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-50 dark:text-slate-300 dark:hover:text-paper"
    :aria-label="
      t('header.language.toggleLabel', {
        next: nextLocale === 'en' ? 'English' : '繁體中文',
      })
    "
    :disabled="isSwitching"
    @click="toggle"
  >
    {{ nextLocale === "en" ? "EN" : "繁中" }}
  </button>
</template>
