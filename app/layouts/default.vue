<script setup lang="ts">
// 使用 i18n Head 設定，自動產生 html lang 屬性與 SEO 連結
const head = useLocaleHead({
  // addDirAttribute: true,
  // identifierAttribute: 'id',
  // addSeoAttributes: true,
})
</script>

<template>
  <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
    <Head>
      <!-- 注入 i18n 相關的 link 與 meta 標籤 -->
      <template v-for="link in head.link" :key="link.id">
        <Link :id="link.id" :rel="link.rel" :href="link.href" :hreflang="link.hreflang" />
      </template>
      <template v-for="meta in head.meta" :key="meta.id">
        <Meta :id="meta.id" :property="meta.property" :content="meta.content" />
      </template>
    </Head>
    <Body>
      <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <!-- 網站頁首 -->
        <SiteHeader />
        <!-- 主要內容區域 -->
        <main class="container mx-auto px-4 py-8">
          <slot />
        </main>
        <!-- 網站頁尾 -->
        <SiteFooter />
        <ClientOnly>
          <Teleport to="body">
            <div class="fixed bottom-6 right-6 z-[60]">
              <ThemeToggle variant="floating" />
            </div>
          </Teleport>
        </ClientOnly>
      </div>
    </Body>
  </Html>
</template>
