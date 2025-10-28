<script setup lang="ts">
useSeoMeta({
  ogImage: '/og-image.webp',
})
</script>

<template>
  <div class="flex min-h-screen flex-col bg-slate-50">
    <NuxtLoadingIndicator color="#2563eb" :height="3" />
    <NuxtRouteAnnouncer />
    <SiteHeader />
    <main class="flex-1">
      <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <NuxtPage />
      </div>
    </main>
    <SiteFooter />
    <ToastContainer />
  </div>
</template>
