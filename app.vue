<script setup lang="ts">
useSeoMeta({
  ogImage: "/og-image.webp",
});
</script>

<template>
  <div class="relative min-h-screen bg-slate-950 text-slate-100">
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.08),_transparent_55%)]"></div>
    <NuxtRouteAnnouncer />
    <AppHeader />
    <main class="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 lg:px-8">
      <NuxtPage />
    </main>
    <LanguageSwitcher />
    <AppFooter />
  </div>
</template>
