import { defineStore } from "pinia";

export type ThemePreference = "light" | "dark" | "system";
export type ThemeResolved = "light" | "dark";

const STORAGE_KEY = "fakestore-theme";

/**
 * 取得瀏覽器偏好
 */
const getSystemTheme = (): ThemeResolved => {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

/**
 * 解析主題偏好為實際顯示的主題
 */
const resolveTheme = (preference: ThemePreference): ThemeResolved => {
  if (preference === "system") {
    return getSystemTheme();
  }
  return preference;
};

export const useThemeStore = defineStore("theme", {
  state: () => ({
    preference: "system" as ThemePreference,
    resolved: "dark" as ThemeResolved,
    hydrated: false,
  }),
  actions: {
    setTheme(theme: ThemePreference) {
      this.preference = theme;
      this.resolved = resolveTheme(theme);
      this.applyTheme();
      this.persist();
    },
    toggle() {
      // 在 light/dark 之間切換，不包含 system
      const next = this.resolved === "dark" ? "light" : "dark";
      this.setTheme(next);
    },
    applyTheme() {
      if (typeof document === "undefined") return;
      document.documentElement.classList.toggle(
        "dark",
        this.resolved === "dark",
      );
      document.documentElement.setAttribute("data-theme", this.resolved);
    },
    hydrate() {
      if (this.hydrated) return;

      if (typeof window === "undefined") {
        this.hydrated = true;
        return;
      }

      // 讀取 localStorage
      try {
        const stored = localStorage.getItem(
          STORAGE_KEY,
        ) as ThemePreference | null;
        if (stored === "light" || stored === "dark" || stored === "system") {
          this.preference = stored;
        } else {
          this.preference = "system";
        }
      } catch {
        this.preference = "system";
      }

      this.resolved = resolveTheme(this.preference);
      this.applyTheme();
      this.hydrated = true;

      // 監聽系統主題變更
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          if (this.preference === "system") {
            this.resolved = e.matches ? "dark" : "light";
            this.applyTheme();
          }
        });
    },
    persist() {
      if (typeof localStorage === "undefined") return;
      try {
        localStorage.setItem(STORAGE_KEY, this.preference);
      } catch {
        // 忽略 localStorage 錯誤
      }
    },
  },
});
