<script setup lang="ts">
useSeoMeta({
  titleTemplate: (titleChunk) =>
    titleChunk ? `${titleChunk} · Fake Store Experience` : 'Fake Store Experience',
  ogImage: '/og-image.webp',
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator color="#2680c2" :height="3" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
