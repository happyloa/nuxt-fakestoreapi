<script setup lang="ts">
const { t } = useI18n()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-slate-200 bg-white">
    <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
      <div class="text-center sm:text-left">
        <p class="font-semibold text-slate-700">{{ t('app.title') }}</p>
        <p class="mt-1">© {{ currentYear }} {{ t('footer.text') }}</p>
      </div>
      <nav class="flex items-center gap-4">
        <a
          href="https://github.com/happyloa/nuxt-fakestoreapi"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-full border border-transparent px-4 py-2 font-semibold text-primary-600 transition hover:border-primary-200 hover:bg-primary-50"
        >
          {{ t('footer.link') }}
        </a>
        <NuxtLink to="/products/new" class="rounded-full bg-primary-600 px-4 py-2 font-semibold text-white transition hover:bg-primary-700">
          {{ t('home.actions.createProduct') }}
        </NuxtLink>
      </nav>
    </div>
  </footer>
</template>
