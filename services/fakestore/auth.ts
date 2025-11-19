import type { LoginResponse, User } from '~/types/fakestore'
import { fakestoreClient } from './client'

/**
 * 執行 Fake Store API 的登入流程
 * @param username 使用者名稱
 * @param password 密碼
 * @returns 包含 JWT Token 的回應
 */
export const login = (username: string, password: string) =>
  fakestoreClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { username, password },
  })

/**
 * 根據使用者名稱尋找使用者
 * 注意：Fake Store API 沒有提供單一路徑查詢使用者帳號，
 * 因此這裡用前端篩選的方式找出對應的使用者資料。
 * @param username 使用者名稱
 * @returns 使用者資料或 null
 */
export const findUserByUsername = async (username: string) => {
  const users = await fakestoreClient<User[]>('/users')
  return users.find((user) => user.username === username) ?? null
}
