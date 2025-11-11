import { defineStore } from 'pinia'
import { findUserByUsername, login as loginApi } from '~/services/fakestore/auth'
import { useCartStore } from './cart'

export interface User {
  id: number
  username: string
  token: string
}

/**
 * 管理 Fake Store API 登入狀態的 Store。
 * 由於官方 API 沒有完整的登入流程，這裡會先取得 token 再補齊使用者資料。
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
    error: '',
  }),
  actions: {
    async login(username: string, password: string) {
      this.loading = true
      this.error = ''
      try {
        const response = await loginApi(username, password)
        const found = await findUserByUsername(username)
        this.user = {
          id: found?.id ?? 1,
          username,
          token: response.token,
        }
      } catch (e: any) {
        this.error = e?.message || 'Login failed'
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.user = null
      const cart = useCartStore()
      cart.clear()
    },
  }
})
