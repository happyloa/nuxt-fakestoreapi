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
    class="flex h-11 min-w-11 items-center justify-center rounded-full px-2 text-xs font-bold hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
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
