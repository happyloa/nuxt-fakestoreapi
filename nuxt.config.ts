import tailwindcss from "@tailwindcss/vite";

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
      script: [
        {
          // Apply dark mode before the first paint. Keep the storage key and
          // values in sync with app/stores/theme.ts.
          innerHTML:
            "try{var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}",
          tagPosition: "head",
          tagPriority: "critical",
        },
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
    // NUXT_SESSION_PASSWORD: at least 32 characters, shared by every instance.
    sessionPassword: "",
    public: {
      // NUXT_PUBLIC_I18N_BASE_URL: the single public origin for canonical,
      // hreflang, og:url and absolute share-image URLs.
      i18n: {
        baseUrl: "https://nuxt-fakestoreapi.worksbyaaron.com",
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
    storage: {
      // Bound every Nitro cache (API handlers and i18n messages). The default
      // in-memory driver never evicts, so unique request keys would grow it
      // without limit.
      cache: { driver: "lru-cache", max: 500 },
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
    experimental: {
      // Message URLs contain a hash of the locale files, so browsers can reuse
      // them instead of revalidating every 10 seconds.
      httpCacheDuration: 60 * 60 * 24 * 7,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  css: ["~/assets/css/tailwind.css"],

  // /api/catalog and /api/products/:id are cached in their handlers.
  // These headers are the single source: Nitro also writes them to
  // dist/_headers for static assets on Cloudflare Pages.
  routeRules: {
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
        "Permissions-Policy":
          "camera=(), geolocation=(), microphone=(), fullscreen=(), payment=()",
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
