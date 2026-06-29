<script setup lang="ts">
// 品牌主色：須與 app/assets/css/tailwind.css 的 --color-brand 保持同步
const BRAND_COLOR = '#2563eb'

// 站台級 SEO 預設：標題後綴模板 + 預設描述/OG（供未呼叫 usePageSeo 的頁面後備，如 error.vue）
useHead({
  titleTemplate: (title) => (title ? `${title}｜Fake Store` : 'Fake Store'),
})
useSeoMeta({
  description: 'Nuxt 4 與 Tailwind CSS v4 打造的 Fake Store API 電商示範專案。',
  ogSiteName: 'Fake Store',
  ogImage: '/og-image.webp',
})
</script>

<template>
  <div>
    <!-- Nuxt 載入進度條 -->
    <NuxtLoadingIndicator :color="BRAND_COLOR" :height="3" />
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
