<script setup>
useSeoMeta({
  ogImage: "/og-image.webp",
});
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <AppHeader />
    <NuxtPage />
    <LanguageSwitcher />
    <AppFooter />
  </div>
</template>
