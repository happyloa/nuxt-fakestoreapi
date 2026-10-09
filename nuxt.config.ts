import tailwindcss from "@tailwindcss/vite";

const siteUrl =
  process.env.NUXT_PUBLIC_SITE_URL ||
  "https://nuxt-fakestoreapi.worksbyaaron.com";

const isCloudflarePages =
  process.env.NITRO_PRESET === "cloudflare_pages" || process.env.CF_PAGES === "1";

export default defineNuxtConfig({
  compatibilityDate: "2026-08-01",
  devtools: { enabled: process.env.NODE_ENV !== "production" },

  modules: ["@nuxt/image", "@nuxtjs/i18n", "@pinia/nuxt", "@nuxtjs/sitemap"],

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
    // IPX uses native Sharp binaries. Pages serves the original images instead.
    provider: isCloudflarePages ? "none" : "ipx",
    domains: ["fakestoreapi.com"],
  },

  // Bundle the small Vue helper instead of asking Nitro to resolve its package
  // directory; Node deprecates the trailing-slash export lookup (DEP0155).
  nitro: {
    cloudflare: {
      nodeCompat: true,
      // Keep the existing Pages settings managed through the cf CLI.
      deployConfig: false,
    },
    externals: {
      // Nuxt 4.6 renderer paths need separator-independent matching on Windows.
      inline: [
        "@vue/shared",
        // Vite emits both absolute and bare Pinia imports on Windows. Bundle
        // both paths so the Nuxt plugin and stores use the same instance.
        "pinia",
        /[\\/]node_modules[\\/]nuxt[\\/]dist[\\/]/,
      ],
    },
  },

  sitemap: {
    sources: ["/api/__sitemap__/urls"],
    exclude: [
      "/cart",
      "/account",
      "/login",
      "/api",
      "/users",
      "/products/new",
      "/en/cart",
      "/en/account",
      "/en/login",
      "/en/api",
      "/en/users",
      "/en/products/new",
    ],
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
    optimizeDeps: { exclude: ["@nuxtjs/i18n"] },
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
