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

const DEFAULT_OG_IMAGE = "/og-image.jpg";
const DEFAULT_OG_IMAGE_SIZE = { width: 1200, height: 630 };
const NOINDEX_PATH = /\/(cart|account|login|api|users|products\/new)$/;

/**
 * 統一頁面 SEO 設定：title、description、Open Graph、Twitter card 與 robots。
 * canonical、hreflang 與 og:url 由 layouts/default.vue 的 useLocaleHead 依 i18n baseUrl 產生，
 * 這裡的分享圖也使用同一個 baseUrl，部署網址只需設定一處。
 *
 * 傳入 getter 以保持 i18n 響應式——切換語系時 title/description 會即時更新。
 */
export function usePageSeo(seo: () => PageSeoInput) {
  const route = useRoute();
  const config = useRuntimeConfig();
  const socialImage = () =>
    new URL(seo().image ?? DEFAULT_OG_IMAGE, config.public.i18n.baseUrl).href;

  useSeoMeta({
    title: () => seo().title,
    description: () => seo().description,
    ogTitle: () => seo().title,
    ogDescription: () => seo().description,
    // The legacy product page uses the Open Graph "product" value, which is
    // valid at runtime but not included in Nuxt's narrowed literal union.
    ogType: () => (seo().type ?? "website") as "website",
    ogImage: socialImage,
    // 只有站台預設圖的尺寸已知；商品圖來自上游，不宣告尺寸。
    ogImageWidth: () => (seo().image ? undefined : DEFAULT_OG_IMAGE_SIZE.width),
    ogImageHeight: () => (seo().image ? undefined : DEFAULT_OG_IMAGE_SIZE.height),
    twitterCard: "summary_large_image",
    twitterTitle: () => seo().title,
    twitterDescription: () => seo().description,
    twitterImage: socialImage,
    robots: () => (NOINDEX_PATH.test(route.path) ? "noindex, follow" : "index, follow"),
  });
}
