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

/**
 * 取得在地化的通用錯誤訊息，供 store 在 API 失敗時設定使用者可見的訊息。
 * 原始錯誤已由 services 層攔截器 (client.ts) console.error，此處只負責顯示文案。
 * 由 Nuxt 自動匯入，使用時無需 import。
 */
const ERROR_FALLBACK: Record<string, string> = {
  load: "Failed to load data. Please try again.",
  save: "Failed to save. Please try again.",
  delete: "Failed to delete. Please try again.",
  login: "Login failed. Please check your username and password.",
  profile: "Failed to load your profile.",
};

export function localizedError(
  kind: "load" | "save" | "delete" | "login" | "profile",
): string {
  try {
    return useNuxtApp().$i18n.t(`errors.${kind}`);
  } catch {
    // 極少數情況下取不到 Nuxt context（脫離 setup 的非同步流程）時的英文後備
    return ERROR_FALLBACK[kind] ?? ERROR_FALLBACK.load!;
  }
}
