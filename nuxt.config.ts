// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxtjs/google-fonts"],
  googleFonts: {
    families: {
      "Noto+Sans+TC": [100, 300, 400, 500, 700, 900],
    },
    download: true,
    inject: true,
    display: "swap",
  },
  css: ["~/assets/css/fonts.css"],
});
