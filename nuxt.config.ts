// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },

  // 設定兼容性日期，這將影響 Nuxt 在此日期之後可用的功能。
  compatibilityDate: "2024-04-03",

  // 開啟開發工具（devtools），便於在開發過程中除錯和查看應用的狀態。
  devtools: { enabled: true },

  // 加入 @nuxtjs/google-fonts 模組，便於從 Google Fonts 取得字型。
  modules: ["@nuxtjs/google-fonts", "@nuxtjs/i18n"],

  // Google Fonts 的相關配置
  googleFonts: {
    families: {
      // 定義要使用的字型 'Noto Sans TC'，包含不同的字重（100, 300, 400, 500, 700, 900）。
      "Noto+Sans+TC": [100, 300, 400, 500, 700, 900],
    },
    // 啟用字型下載功能，將 Google Fonts 的字型下載到本地，減少依賴 Google 服務，提升載入速度。
    download: true,
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
    langDir: "locales/", // 語言文件的存放資料夾
    strategy: "prefix_except_default", // URL 前綴策略
    vueI18n: "./i18n.config.ts",
  },

  // 引入自定義的 CSS 檔案，用於設定字型的樣式與重置 CSS。
  css: ["~/assets/css/reset.css", "~/assets/css/fonts.css"],
});
