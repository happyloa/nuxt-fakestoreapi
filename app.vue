<script setup lang="ts">
useSeoMeta({
  ogImage: '/og-image.webp',
})

useHead({
  htmlAttrs: {
    class: 'dark',
    'data-theme': 'dark',
  },
})
</script>

<template>
  <div class="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
    <NuxtLoadingIndicator color="#2563eb" :height="3" />
    <NuxtRouteAnnouncer />
    <SiteHeader />
    <main class="flex-1">
      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 xl:px-10">
        <NuxtPage />
      </div>
    </main>
    <SiteFooter />
    <ToastContainer />
  </div>
</template>
