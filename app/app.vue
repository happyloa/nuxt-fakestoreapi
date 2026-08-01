<script setup lang="ts">
const { t } = useI18n()

useHead({
  titleTemplate: (title) =>
    title ? `${title} · ${t("site.name")}` : t("site.name"),
  meta: [
    {
      name: "theme-color",
      content: "#2563eb",
    },
  ],
})

useSeoMeta({
  description: () => t("site.description"),
  ogSiteName: () => t("site.name"),
  ogType: "website",
  twitterCard: "summary_large_image",
})
</script>

<template>
  <NuxtLoadingIndicator color="#2563eb" :height="3" />
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
