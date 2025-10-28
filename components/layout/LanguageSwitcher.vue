<script setup lang="ts">
import { computed } from 'vue'
import { navigateTo, useSwitchLocalePath } from '#imports'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const flags: Record<string, { emoji: string; label: string }> = {
  zh: { emoji: '🇹🇼', label: '繁體中文' },
  en: { emoji: '🇺🇸', label: 'English' },
}

const nextLocale = computed(() => (locale.value === 'zh' ? 'en' : 'zh'))

const handleToggle = async () => {
  const target = nextLocale.value
  const path = switchLocalePath(target)
  if (path) {
    await navigateTo(path)
  }
}
</script>

<template>
  <button
    type="button"
    class="flex items-center gap-2 rounded-full border border-slate-300/60 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-white dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-700"
    :title="t('header.language.toggleLabel', { next: flags[nextLocale].label })"
    @click="handleToggle"
  >
    <span class="sr-only">{{ t('header.language.toggleLabel', { next: flags[nextLocale].label }) }}</span>
    <span class="text-base" aria-hidden="true">{{ flags[locale].emoji }}</span>
    <span class="hidden sm:inline">{{ flags[locale].label }}</span>
  </button>
</template>
