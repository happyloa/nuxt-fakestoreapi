/**
 * I18n 核心設定：
 * - 根據瀏覽器偏好自動切換語系
 * - 預設為繁體中文介面，不額外加上 /zh 前綴；只有英文頁面使用 /en
 */
export default defineI18nConfig(() => ({
  legacy: false,
  locale: "zh",
  fallbackLocale: "en",
  availableLocales: ["zh", "en"],
  // 貨幣格式：FakeStore 商品價格皆為 USD，統一以 $n(value, 'currency') 在地化呈現
  numberFormats: {
    zh: {
      currency: { style: "currency", currency: "USD" },
    },
    en: {
      currency: { style: "currency", currency: "USD" },
    },
  },
}));
