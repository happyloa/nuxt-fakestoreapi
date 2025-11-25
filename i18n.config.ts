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
}));
