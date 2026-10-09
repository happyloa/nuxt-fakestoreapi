<script setup lang="ts">
withDefaults(defineProps<{ variant?: "inline" | "floating" }>(), {
  variant: "inline",
});
const theme = useThemeStore();
const { t } = useI18n();
const isDark = computed(() => theme.resolved === "dark");
</script>
<template>
  <ClientOnly>
    <button
      type="button"
      class="flex h-11 w-11 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
      :aria-pressed="isDark"
      :aria-label="t('header.theme.toggleLabel')"
      :title="t(isDark ? 'header.theme.light' : 'header.theme.dark')"
      @click="theme.toggle()"
    >
      <SiteIcon :name="isDark ? 'sun' : 'moon'" class="h-5 w-5" />
    </button>
    <template #fallback
      ><span class="block h-11 w-11" aria-hidden="true"
    /></template>
  </ClientOnly>
</template>
