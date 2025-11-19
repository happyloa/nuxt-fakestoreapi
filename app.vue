<script setup lang="ts">
// 設定 SEO Meta 標籤
useSeoMeta({
  ogImage: '/og-image.webp',
})
</script>

<template>
  <div>
    <!-- Nuxt 載入進度條 -->
    <NuxtLoadingIndicator color="#2563eb" :height="3" />
    <!-- 路由變更通知 (無障礙功能) -->
    <NuxtRouteAnnouncer />
    <!-- 應用程式主要佈局 -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <!-- 全域 Toast 通知容器 (僅在客戶端渲染) -->
    <ClientOnly>
      <ToastContainer />
    </ClientOnly>
  </div>
</template>
