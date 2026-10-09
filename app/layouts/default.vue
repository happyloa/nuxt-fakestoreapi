<script setup lang="ts">
// 使用 i18n Head 設定，自動產生 html lang 屬性與 SEO 連結
const head = useLocaleHead({ seo: true });
</script>

<template>
  <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
    <Head>
      <template v-for="link in head.link" :key="link.id"
        ><Link
          :id="link.id"
          :rel="link.rel"
          :href="link.href"
          :hreflang="'hreflang' in link ? link.hreflang : undefined"
      /></template>
      <template v-for="meta in head.meta" :key="meta.id"
        ><Meta
          :id="meta.id"
          :property="meta.property"
          :content="String(meta.content ?? '')"
      /></template>
    </Head>
    <Body>
      <div
        class="flex min-h-screen flex-col bg-paper text-slate-900 dark:bg-slate-950 dark:text-slate-100"
      >
        <a
          href="#main-content"
          class="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-3 focus:text-white"
          >{{ $t("ui.skipToContent") }}</a
        >
        <SiteHeader />
        <main
          id="main-content"
          tabindex="-1"
          class="mx-auto w-full max-w-7xl flex-1 px-5 py-8 focus:outline-none sm:px-8 sm:py-12 lg:px-10"
        >
          <slot />
        </main>
        <SiteFooter />
        <ClientOnly
          ><Teleport to="body"
            ><div class="fixed bottom-5 right-5 z-30">
              <BackToTop /></div></Teleport
        ></ClientOnly>
      </div>
    </Body>
  </Html>
</template>
