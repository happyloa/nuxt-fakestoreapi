// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 設定兼容性日期，這將影響 Nuxt 在此日期之後可用的功能。
  compatibilityDate: "2024-04-03",

  // 開啟開發工具（devtools），便於在開發過程中除錯和查看應用的狀態。
  devtools: { enabled: true },

  // 加入 @nuxtjs/google-fonts 模組，便於從 Google Fonts 取得字型。
  modules: [
    "@nuxtjs/google-fonts",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
  ],

  // 自動載入 components 資料夾下的元件，並移除資料夾前綴，確保
  // <SiteHeader />、<ProductGrid /> 等命名在伺服器與瀏覽器兩端一致，避免水合錯誤。
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  // Google Fonts 的相關配置
  googleFonts: {
    families: {
      // 定義要使用的字型 'Noto Sans TC'，包含不同的字重（100, 300, 400, 500, 700, 900）。
      "Noto+Sans+TC": [100, 300, 400, 500, 700, 900],
    },
    // 啟用字型下載功能，將 Google Fonts 的字型下載到本地，減少依賴 Google 服務，提升載入速度。
    download: false,
    // 自動將字型注入到應用中，無需手動在頁面中引用。
    inject: true,
    // 設置字型顯示屬性為 'swap'，這樣可以在字型下載期間先顯示後備字型，提升用戶體驗。
    display: "swap",
  },

  // i18n 多語言設定
  i18n: {
    locales: [
      { code: "zh", name: "中文", iso: "zh-TW", file: "zh.json" },
      { code: "en", name: "English", iso: "en-US", file: "en.json" },
    ],
    defaultLocale: "zh", // 預設語言
    lazy: true, // 按需加載語言文件
    langDir: "locales", // 語言文件的存放資料夾（位於 i18n/locales）
    strategy: "prefix_except_default", // URL 前綴策略
    vueI18n: "./i18n.config.ts",
  },

  // 引入自定義的 CSS 檔案，用於設定字型的樣式與重置 CSS。
  css: ["~/assets/css/tailwind.css"],

  // 安全性強化：為所有路由加入常見的 HTTP 安全標頭，避免 clickjacking、MIME sniffing 等攻擊。
  nitro: {
    routeRules: {
      "/**": {
        headers: {
          "Content-Security-Policy": [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com data:",
            "img-src 'self' data: https:",
            "connect-src 'self' https://fakestoreapi.com https://fonts.googleapis.com https://fonts.gstatic.com",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
            "object-src 'none'",
            "upgrade-insecure-requests",
          ].join("; "),
          "Cross-Origin-Opener-Policy": "same-origin",
          "Cross-Origin-Resource-Policy": "cross-origin",
          "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          "Referrer-Policy": "strict-origin-when-cross-origin",
          "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
        },
      },
    },
  },
});
