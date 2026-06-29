import { defineStore } from "pinia";
import { login } from "~/services/fakestore/auth";
import { getUserById } from "~/services/fakestore/users";
import type { User } from "~/types/fakestore";
import { useCartStore } from "~/stores/cart";

/**
 * 認證狀態管理 Store
 * 負責處理登入、登出以及 JWT Token 的保存
 */
export const useAuthStore = defineStore("auth", () => {
  // 使用 useCookie 來持久化保存 token，設定過期時間為 7 天
  // 註：因 client 需讀取 token 解析 userId，故無法設 httpOnly；
  //     徹底解法需改由 server route 代理登入並以 httpOnly cookie 保存。
  const token = useCookie<string | null>("auth_token", {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: !import.meta.dev,
  });

  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 登入狀態：只要有 token 就視為已登入
  const isAuthenticated = computed(() => !!token.value);

  /**
   * 解析 JWT Token 取得 User ID
   * @param token JWT Token
   */
  const getUserIdFromToken = (token: string): number | null => {
    try {
      const parts = token.split(".");
      if (parts.length < 2 || !parts[1]) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload.sub || null;
    } catch (e) {
      console.error("Failed to parse token:", e);
      return null;
    }
  };

  /**
   * 根據 Token 抓取使用者資料
   */
  const fetchUser = async () => {
    if (!token.value) return;

    const userId = getUserIdFromToken(token.value);
    if (!userId) return;

    loading.value = true;
    error.value = null;
    try {
      user.value = await getUserById(userId);
    } catch (e) {
      console.error("Failed to fetch user:", e);
      error.value = "Failed to fetch user profile";
      // 如果抓不到使用者，可能 Token 失效，考慮登出
      // token.value = null
    } finally {
      loading.value = false;
    }
  };

  /**
   * 登入函式
   * @param username 使用者名稱
   * @param password 密碼
   */
  const loginUser = async (username: string, password: string) => {
    loading.value = true;
    error.value = null;
    try {
      const { token: jwt } = await login(username, password);
      token.value = jwt;
      await fetchUser();
      return true;
    } catch (e) {
      console.error("Login failed:", e);
      error.value = e instanceof Error ? e.message : "Login failed";
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * 登出函式
   * 僅清除 token / user 與購物車；導向交由呼叫端負責，
   * 以便使用 localePath 維持當前語系（見 account.vue）。
   */
  const logoutUser = () => {
    token.value = null;
    user.value = null;
    // 清空購物車，避免登出後殘留數量
    const cartStore = useCartStore();
    cartStore.clear();
  };

  // 初始化：如果有 Token 但沒 User，嘗試抓取
  if (token.value && !user.value) {
    fetchUser();
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    loginUser,
    logoutUser,
    fetchUser,
  };
});
