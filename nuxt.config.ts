import tailwindcss from "@tailwindcss/vite"

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000"

export default defineNuxtConfig({
  srcDir: "app",
  compatibilityDate: "2026-08-01",
  devtools: { enabled: process.env.NODE_ENV !== "production" },

  modules: [
    "@nuxt/image",
    "@nuxtjs/google-fonts",
    "@nuxtjs/i18n",
    "@nuxtjs/sitemap",
  ],

  runtimeConfig: {
    fakeStoreApiBase:
      process.env.NUXT_FAKESTORE_API_BASE || "https://fakestoreapi.com",
    public: {
      siteUrl,
    },
  },

  site: {
    url: siteUrl,
    name: "Storefront Lab",
  },

  image: {
    domains: ["fakestoreapi.com"],
  },

  sitemap: {
    zeroRuntime: true,
  },

  googleFonts: {
    families: {
      "Noto+Sans+TC": [400, 500, 600, 700],
    },
    display: "swap",
    download: false,
  },

  i18n: {
    baseUrl: siteUrl,
    locales: [
      { code: "zh", name: "繁體中文", language: "zh-TW", file: "zh.json" },
      { code: "en", name: "English", language: "en-US", file: "en.json" },
    ],
    defaultLocale: "zh",
    langDir: "../app/i18n/locales",
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "storefront_locale",
      redirectOn: "root",
      fallbackLocale: "en",
    },
    vueI18n: "~/i18n.config.ts",
  },

  vite: {
    plugins: [tailwindcss()],
  },

  css: ["~/assets/styles/main.css"],

  routeRules: {
    "/api/catalog": { swr: 300 },
    "/api/products/**": { swr: 300 },
    "/**": {
      headers: {
        "Content-Security-Policy": [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' data: https://fonts.gstatic.com",
          "img-src 'self' data: https:",
          "connect-src 'self'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          "object-src 'none'",
        ].join("; "),
        "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      },
    },
  },
})
