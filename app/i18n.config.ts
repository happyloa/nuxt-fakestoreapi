export default defineI18nConfig(() => ({
  legacy: false,
  locale: "zh",
  fallbackLocale: "en",
  availableLocales: ["zh", "en"],
  numberFormats: {
    zh: {
      currency: {
        style: "currency",
        currency: "USD",
        currencyDisplay: "symbol",
      },
    },
    en: {
      currency: {
        style: "currency",
        currency: "USD",
      },
    },
  },
}))
