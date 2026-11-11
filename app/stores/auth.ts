import { defineStore } from "pinia";
import type { PublicUser, SessionResponse } from "#shared/types/storefront";

type LoginError = "" | "errors.login" | "errors.loginUnavailable";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<PublicUser | null>(null);
  const loading = ref(false);
  // i18n key, translated where it is shown so it follows the current locale.
  const loginError = ref<LoginError>("");
  const initialized = ref(false);
  const isAuthenticated = computed(() => user.value !== null);
  const requestFetch = useRequestFetch();
  const fetchUser = async () => {
    try {
      const session = await requestFetch<SessionResponse>("/api/auth/me");
      user.value = session.authenticated ? session.user : null;
      initialized.value = true;
    } catch {
      // Treated as signed out; the next navigation retries.
      user.value = null;
    }
  };
  const loginUser = async (username: string, password: string) => {
    if (loading.value) return false;
    loading.value = true;
    loginError.value = "";
    try {
      const session = await $fetch<SessionResponse>("/api/auth/session", {
        method: "POST", body: { username, password },
      });
      user.value = session.authenticated ? session.user : null;
      initialized.value = true;
      return isAuthenticated.value;
    } catch (error) {
      const status = (error as { statusCode?: number } | null)?.statusCode;
      loginError.value = status === 401 ? "errors.login" : "errors.loginUnavailable";
      return false;
    } finally { loading.value = false; }
  };
  const logoutUser = async () => {
    await $fetch("/api/auth/session", { method: "DELETE" });
    user.value = null;
    useCartStore().reset();
  };
  return { user, loading, loginError, initialized, isAuthenticated, fetchUser, loginUser, logoutUser };
});
