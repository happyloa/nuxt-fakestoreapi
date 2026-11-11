<script setup lang="ts">
import manropeUrl from '~/assets/fonts/manrope-latin.woff2?url'

const SITE_NAME = 'Storefront Lab'

// 站台名稱後綴；描述與分享圖由各頁的 usePageSeo 設定。
// 字型在 HTML 解析時就開始下載，不必等到樣式套用後才被發現。
useHead({
  titleTemplate: (title) => (title ? `${title}｜${SITE_NAME}` : SITE_NAME),
  link: [{ rel: 'preload', as: 'font', type: 'font/woff2', href: manropeUrl, crossorigin: '' }],
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
