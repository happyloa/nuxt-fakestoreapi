import tailwindcss from "@tailwindcss/vite"

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || "https://nuxt-fakestoreapi.worksbyaaron.com"

export default defineNuxtConfig({
  compatibilityDate: "2026-08-01",
  devtools: { enabled: process.env.NODE_ENV !== "production" },

  modules: [
    "@nuxt/image",
    "@nuxtjs/google-fonts",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@nuxtjs/sitemap",
  ],

  // The restored interface uses unprefixed component names such as
  // <SiteHeader>, <ProductGrid>, and the Base* UI kit.
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  runtimeConfig: {
    fakeStoreApiBase:
      process.env.NUXT_FAKE_STORE_API_BASE || "https://fakestoreapi.com",
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

  // Bundle the small Vue helper instead of asking Nitro to resolve its package
  // directory; Node deprecates the trailing-slash export lookup (DEP0155).
  nitro: {
    externals: { inline: ["@vue/shared"] },
  },

  sitemap: {
    sources: ["/api/__sitemap__/urls"],
    exclude: ["/cart", "/account", "/login", "/api", "/users", "/products/new", "/en/cart", "/en/account", "/en/login", "/en/api", "/en/users", "/en/products/new"],
  },

  googleFonts: {
    families: {
      "Noto+Sans+TC": [400, 500, 700, 900],
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
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
      fallbackLocale: "en",
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  css: ["~/assets/css/tailwind.css"],

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
          "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
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
