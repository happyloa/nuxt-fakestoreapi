<script setup lang="ts">
const { locale, setLocale, t } = useI18n();
const nextLocale = computed(() => (locale.value === "zh" ? "en" : "zh"));
// 可見文字必須包含在無障礙名稱裡（語音控制以畫面上的字點選）。
const visibleLabel = computed(() => (nextLocale.value === "en" ? "EN" : "繁中"));
const accessibleLabel = computed(
  () =>
    `${visibleLabel.value} – ${t("header.language.toggleLabel", {
      next: nextLocale.value === "en" ? "English" : "繁體中文",
    })}`,
);
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
    :aria-label="accessibleLabel"
    :disabled="isSwitching"
    @click="toggle"
  >
    <span :lang="nextLocale === 'en' ? 'en' : 'zh-TW'">{{ visibleLabel }}</span>
  </button>
</template>
