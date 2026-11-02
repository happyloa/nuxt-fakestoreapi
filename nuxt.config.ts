import tailwindcss from "@tailwindcss/vite";

const siteUrl = "https://nuxt-fakestoreapi.worksbyaaron.com";

export default defineNuxtConfig({
  compatibilityDate: "2026-08-01",
  devtools: { enabled: process.env.NODE_ENV !== "production" },

  modules: ["@nuxtjs/i18n", "@pinia/nuxt"],

  app: {
    head: {
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          sizes: "16x16 32x32 48x48 64x64",
          href: "/favicon.ico?v=storefront-lab",
        },
        { rel: "icon", type: "image/svg+xml", sizes: "any", href: "/favicon.svg" },
      ],
    },
  },

  // The restored interface uses unprefixed component names such as
  // <SiteHeader>, <ProductGrid>, and the Base* UI kit.
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  runtimeConfig: {
    fakeStoreApiBase: "https://fakestoreapi.com",
    public: {
      siteUrl,
      i18n: {
        baseUrl: siteUrl,
      },
    },
  },

  nitro: {
    cloudflare: {
      nodeCompat: true,
      // Keep the existing Pages settings managed through the cf CLI.
      deployConfig: false,
    },
    externals: {
      // Bundle Pinia so the Nuxt plugin and stores share one instance in SSR.
      inline: ["pinia"],
    },
  },

  i18n: {
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
          "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
          "style-src 'self' 'unsafe-inline'",
          "font-src 'self' data:",
          "img-src 'self' data: https:",
          "connect-src 'self'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          "object-src 'none'",
        ].join("; "),
        "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Strict-Transport-Security":
          "max-age=63072000; includeSubDomains; preload",
        "Cross-Origin-Opener-Policy": "same-origin",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      },
    },
  },
});
