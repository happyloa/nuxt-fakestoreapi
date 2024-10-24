<script setup>
useSeoMeta({
  ogImage: "/og-image.webp",
});
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <LanguageSwitcher />
    <AppFooter />
  </div>
</template>
