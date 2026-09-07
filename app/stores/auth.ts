import { defineStore } from "pinia";
import type { PublicUser, SessionResponse } from "#shared/types/storefront";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<PublicUser | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const initialized = ref(false);
  const isAuthenticated = computed(() => user.value !== null);
  const requestFetch = useRequestFetch();
  const fetchUser = async () => {
    try {
      const session = await requestFetch<SessionResponse>("/api/auth/me");
      user.value = session.authenticated ? session.user : null;
      initialized.value = true;
    } catch {
      user.value = null;
      error.value = localizedError("profile");
    }
  };
  const loginUser = async (username: string, password: string) => {
    if (loading.value) return false;
    loading.value = true;
    error.value = null;
    try {
      const session = await $fetch<SessionResponse>("/api/auth/session", {
        method: "POST", body: { username, password },
      });
      user.value = session.authenticated ? session.user : null;
      initialized.value = true;
      return isAuthenticated.value;
    } catch {
      error.value = localizedError("login");
      return false;
    } finally { loading.value = false; }
  };
  const logoutUser = async () => {
    await $fetch("/api/auth/session", { method: "DELETE" });
    user.value = null;
    useCartStore().clear();
  };
  return { user, loading, error, initialized, isAuthenticated, fetchUser, loginUser, logoutUser };
});
