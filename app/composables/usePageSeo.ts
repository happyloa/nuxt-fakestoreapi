interface PageSeoInput {
  /** 頁面標題（不含站名後綴，後綴由 app.vue 的 titleTemplate 補上） */
  title: string;
  /** 頁面描述 */
  description: string;
  /** 社群分享圖；省略則使用站台預設 og-image */
  image?: string;
  /** Open Graph 類型，預設 website；商品頁可傳 "product" */
  type?: string;
}

const DEFAULT_OG_IMAGE = "/og-image.webp";

/**
 * 統一頁面 SEO 設定。
 * 收斂各頁重複的 useHead（title + description + OG 三件組），並一併補上
 * Twitter card、og:type、og:image、og:url 與 canonical。
 *
 * 傳入 getter 以保持 i18n 響應式——切換語系時 title/description 會即時更新。
 * 採用 useSeoMeta 以 meta key 去重，避免與 app.vue 的站台級預設重複。
 */
export function usePageSeo(seo: () => PageSeoInput) {
  const route = useRoute();
  const config = useRuntimeConfig();
  const canonical = computed(() => new URL(route.path, config.public.siteUrl).href);
  const socialImage = () => new URL(seo().image ?? DEFAULT_OG_IMAGE, config.public.siteUrl).href;

  useSeoMeta({
    title: () => seo().title,
    description: () => seo().description,
    ogTitle: () => seo().title,
    ogDescription: () => seo().description,
    // The legacy product page uses the Open Graph "product" value, which is
    // valid at runtime but not included in Nuxt's narrowed literal union.
    ogType: () => (seo().type ?? "website") as "website",
    ogUrl: canonical,
    ogImage: socialImage,
    twitterCard: "summary_large_image",
    twitterTitle: () => seo().title,
    twitterDescription: () => seo().description,
    twitterImage: socialImage,
  });

  // Locale-aware canonical and alternate links are managed by useLocaleHead.
  useSeoMeta({ robots: () => /\/(cart|account|login|api|users|products\/new)$/.test(route.path) ? "noindex, follow" : "index, follow" });
}
