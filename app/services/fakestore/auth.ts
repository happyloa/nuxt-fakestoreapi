import type { LoginResponse } from "~/types/fakestore";
import { fakestoreClient } from "./client";

/**
 * 執行 Fake Store API 的登入流程
 * @param username 使用者名稱
 * @param password 密碼
 * @returns 包含 JWT Token 的回應
 */
export const login = (username: string, password: string) =>
  fakestoreClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: { username, password },
  });
