// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-12-18",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/google-fonts",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
  ],
  css: ["~/assets/css/main.css"],
  googleFonts: {
    families: {
      "Noto+Sans+TC": [100, 300, 400, 500, 700, 900],
      "Inter": [400, 500, 600, 700],
    },
    download: false,
    inject: true,
    display: "swap",
  },
  tailwindcss: {
    viewer: false,
  },
  i18n: {
    locales: [
      { code: "zh", name: "中文", iso: "zh-TW", file: "zh.json" },
      { code: "en", name: "English", iso: "en-US", file: "en.json" },
    ],
    defaultLocale: "zh",
    lazy: true,
    langDir: "locales",
    strategy: "prefix_except_default",
    vueI18n: "./i18n.config.ts",
  },
});
