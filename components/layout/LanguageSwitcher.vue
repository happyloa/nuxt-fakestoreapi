<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { navigateTo, useSwitchLocalePath } from '#imports'

const { locale, availableLocales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const options = computed(() =>
  availableLocales.map((code) => ({
    code,
    label: code === 'zh' ? '中文' : 'English',
  })),
)

const handleChange = (code: string) => {
  const path = switchLocalePath(code)
  if (path) {
    navigateTo(path)
  }
}
</script>

<template>
  <div class="relative">
    <select
      :value="locale"
      class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
      @change="handleChange(($event.target as HTMLSelectElement).value)"
    >
      <option v-for="option in options" :key="option.code" :value="option.code">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
