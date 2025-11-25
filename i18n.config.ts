/**
 * I18n 核心設定：
 * - 根據瀏覽器偏好自動切換語系
 * - 非中文環境預設使用英文，確保內容可讀性
 */
export default defineI18nConfig(() => ({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  availableLocales: ["en", "zh"],
}));
