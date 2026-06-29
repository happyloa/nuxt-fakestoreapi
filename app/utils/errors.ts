/**
 * 從未知型別的 catch 錯誤中安全取出可顯示訊息。
 * 集中處理「error instanceof Error ? error.message : fallback」這段在各 store
 * 與 composable 重複出現的樣板，日後若要改為辨識 ApiError、加上 i18n 對應或
 * 上報，只需修改此處一個地方。
 *
 * 由 Nuxt 自動匯入（app/utils/），使用時無需 import。
 */
export function toErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
