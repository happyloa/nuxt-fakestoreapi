import type { LoginResponse, User } from '~/types/fakestore'
import { fakestoreClient } from './client'

/**
 * 執行 Fake Store API 的登入流程，回傳 JWT。
 */
export const login = (username: string, password: string) =>
  fakestoreClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { username, password },
  })

/**
 * Fake Store API 沒有提供單一路徑查詢使用者帳號，
 * 因此這裡用前端篩選的方式找出對應的使用者資料。
 */
export const findUserByUsername = async (username: string) => {
  const users = await fakestoreClient<User[]>('/users')
  return users.find((user) => user.username === username) ?? null
}
