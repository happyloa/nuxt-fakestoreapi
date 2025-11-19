import { defineStore } from 'pinia'
import { login } from '~/services/fakestore/auth'

/**
 * 認證狀態管理 Store
 * 負責處理登入、登出以及 JWT Token 的保存
 */
export const useAuthStore = defineStore('auth', () => {
  // 使用 useCookie 來持久化保存 token，設定過期時間為 7 天
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7,
  })

  // 登入狀態：只要有 token 就視為已登入
  const isAuthenticated = computed(() => !!token.value)

  /**
   * 登入函式
   * @param username 使用者名稱
   * @param password 密碼
   */
  const loginUser = async (username: string, password: string) => {
    try {
      const { token: jwt } = await login(username, password)
      token.value = jwt
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  /**
   * 登出函式
   * 清除 token 並導回首頁
   */
  const logoutUser = () => {
    token.value = null
    navigateTo('/')
  }

  return {
    token,
    isAuthenticated,
    loginUser,
    logoutUser,
  }
})
