/**
 * vue-i18n 執行期設定。
 * 語系清單、預設語系與網址策略在 nuxt.config.ts 的 i18n 區塊設定。
 * zh 與 en 的 key 集合由 tests/i18n.test.mjs 保持一致，因此不需要 fallback 語系；
 * 伺服器回傳語系訊息時也不會再夾帶另一個語系。
 */
export default defineI18nConfig(() => ({
  legacy: false,
  fallbackLocale: false,
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
