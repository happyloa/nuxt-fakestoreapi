/**
 * 取得在地化的通用錯誤訊息，供 store 在 API 失敗時設定使用者可見的訊息。
 * 顯示通用錯誤文案，不記錄可能包含敏感欄位的原始回應。
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
