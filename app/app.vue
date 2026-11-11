<script setup lang="ts">
const SITE_NAME = 'Storefront Lab'

// 站台名稱後綴；首頁標題已含站名時不重複附加。
// 描述與分享圖由各頁的 usePageSeo 設定。
useHead({
  titleTemplate: (title) => {
    if (!title) return SITE_NAME
    return title.includes(SITE_NAME) ? title : `${title}｜${SITE_NAME}`
  },
})
useSeoMeta({
  ogSiteName: SITE_NAME,
})
</script>

<template>
  <div>
    <!-- Nuxt 載入進度條，顏色沿用 tailwind.css 的品牌色 -->
    <NuxtLoadingIndicator color="var(--color-brand)" :height="3" />
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
