<script setup lang="ts">
// 使用 i18n Head 設定，自動產生 html lang 屬性與 SEO 連結
const head = useLocaleHead({
  // addDirAttribute: true,
  // identifierAttribute: 'id',
  // addSeoAttributes: true,
});
</script>

<template>
  <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
    <Head>
      <!-- 注入 i18n 相關的 link 與 meta 標籤 -->
      <template v-for="link in head.link" :key="link.id">
        <Link
          :id="link.id"
          :rel="link.rel"
          :href="link.href"
          :hreflang="link.hreflang" />
      </template>
      <template v-for="meta in head.meta" :key="meta.id">
        <Meta :id="meta.id" :property="meta.property" :content="meta.content" />
      </template>
    </Head>
    <Body>
      <div
        class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <!-- 跳過導覽，直達主要內容 (WCAG 2.4.1) -->
        <a
          href="#main-content"
          class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
          {{ $t("ui.skipToContent") }}
        </a>
        <!-- 網站頁首 -->
        <SiteHeader />
        <!-- 主要內容區域 -->
        <main
          id="main-content"
          tabindex="-1"
          class="container mx-auto px-4 py-8 focus:outline-none">
          <NuxtPage
            :transition="{
              name: 'page',
              mode: 'out-in',
            }" />
        </main>
        <!-- 網站頁尾 -->
        <SiteFooter />
        <ClientOnly>
          <Teleport to="body">
            <div class="fixed bottom-6 right-6 z-[60] flex flex-col gap-3">
              <BackToTop />
              <ThemeToggle variant="floating" />
            </div>
          </Teleport>
        </ClientOnly>
      </div>
    </Body>
  </Html>
</template>

<style>
/* 頁面過渡動畫 */
.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    filter 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
  filter: blur(4px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.98);
  filter: blur(4px);
}
</style>
