import { defineStore } from 'pinia'
import { login } from '~/services/fakestore/auth'
import { getUserById } from '~/services/fakestore/users'
import type { User } from '~/types/fakestore'

/**
 * 認證狀態管理 Store
 * 負責處理登入、登出以及 JWT Token 的保存
 */
export const useAuthStore = defineStore('auth', () => {
  // 使用 useCookie 來持久化保存 token，設定過期時間為 7 天
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7,
  })

  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 登入狀態：只要有 token 就視為已登入
  const isAuthenticated = computed(() => !!token.value)

  /**
   * 解析 JWT Token 取得 User ID
   * @param token JWT Token
   */
  const getUserIdFromToken = (token: string): number | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.sub || null
    } catch (e) {
      console.error('Failed to parse token:', e)
      return null
    }
  }

  /**
   * 根據 Token 抓取使用者資料
   */
  const fetchUser = async () => {
    if (!token.value) return

    const userId = getUserIdFromToken(token.value)
    if (!userId) return

    loading.value = true
    error.value = null
    try {
      user.value = await getUserById(userId)
    } catch (e) {
      console.error('Failed to fetch user:', e)
      error.value = 'Failed to fetch user profile'
      // 如果抓不到使用者，可能 Token 失效，考慮登出
      // token.value = null
    } finally {
      loading.value = false
    }
  }

  /**
   * 登入函式
   * @param username 使用者名稱
   * @param password 密碼
   */
  const loginUser = async (username: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const { token: jwt } = await login(username, password)
      token.value = jwt
      await fetchUser()
      return true
    } catch (e: any) {
      console.error('Login failed:', e)
      error.value = e.message || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 登出函式
   * 清除 token 並導回首頁
   */
  const logoutUser = () => {
    token.value = null
    user.value = null
    navigateTo('/')
  }

  // 初始化：如果有 Token 但沒 User，嘗試抓取
  if (token.value && !user.value) {
    fetchUser()
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
  }
})
