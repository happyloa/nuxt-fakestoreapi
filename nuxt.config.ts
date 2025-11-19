// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 設定兼容性日期，這將影響 Nuxt 在此日期之後可用的功能。
  compatibilityDate: "2024-04-03",

  // 開啟開發工具（devtools），便於在開發過程中除錯和查看應用的狀態。
  devtools: { enabled: true },

  // 加入所需的模組
  // @nuxtjs/google-fonts: 處理 Google Fonts 字型
  // @nuxtjs/i18n: 處理多語系
  // @pinia/nuxt: 狀態管理
  // @nuxtjs/tailwindcss: CSS 框架
  modules: [
    "@nuxtjs/google-fonts",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
  ],

  // 自動載入 components 資料夾下的元件，並移除資料夾前綴
  // 例如 components/api/ProductsSection.vue 可以直接使用 <ProductsSection />
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  // Google Fonts 的相關配置
  googleFonts: {
    families: {
      // 定義要使用的字型 'Noto Sans TC'，包含不同的字重
      "Noto+Sans+TC": [100, 300, 400, 500, 700, 900],
    },
    // 關閉下載功能，直接使用 CDN
    download: false,
    // 自動注入 CSS
    inject: true,
    // 使用 swap 策略，避免文字隱形
    display: "swap",
  },

  // i18n 多語言設定
  i18n: {
    // 設定基礎 URL，用於 SEO 標籤
    baseUrl: 'http://localhost:3000',
    // 定義支援的語系
    locales: [
      { code: "zh", name: "中文", language: "zh-TW", file: "zh.json" },
      { code: "en", name: "English", language: "en-US", file: "en.json" },
    ],
    defaultLocale: "zh", // 預設語言
    // lazy: true, // 按需加載語言文件 (目前註解掉)
    langDir: "locales", // 語言文件的存放資料夾
    strategy: "prefix_except_default", // URL 前綴策略 (預設語言不加前綴)
    // 瀏覽器語言偵測設定
    detectBrowserLanguage: {
      useCookie: true, // 使用 Cookie 紀錄使用者選擇
      cookieKey: 'i18n_redirected', // Cookie 名稱
      redirectOn: 'root', // 僅在根路徑進行重定向
    },
    vueI18n: "./i18n.config.ts", // Vue I18n 詳細設定檔
  },

  // 引入全域 CSS 檔案
  css: ["~/assets/css/tailwind.css"],

  // Nitro 伺服器設定 (安全性標頭)
  nitro: {
    routeRules: {
      "/**": {
        headers: {
          // 設定 Content-Security-Policy 防止 XSS 等攻擊
          "Content-Security-Policy": [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com data:",
            "img-src 'self' data: https:",
            "frame-src 'self' https://vercel.live",
            "connect-src 'self' https://fakestoreapi.com https://fonts.googleapis.com https://fonts.gstatic.com",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
            "object-src 'none'",
            "upgrade-insecure-requests",
          ].join("; "),
          "Cross-Origin-Opener-Policy": "same-origin",
          "Cross-Origin-Resource-Policy": "cross-origin",
          "Permissions-Policy": [
            "camera=()",
            "microphone=()",
            "geolocation=()",
            "fullscreen=()",
            "payment=()",
          ].join(", "),
          "Referrer-Policy": "strict-origin-when-cross-origin",
          "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "X-XSS-Protection": "1; mode=block",
        },
      },
    },
  },
});
