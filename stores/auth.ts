import { defineStore } from 'pinia'
import { useCartStore } from './cart'

export interface User {
  id: number
  username: string
  token: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
    error: ''
  }),
  actions: {
    async login(username: string, password: string) {
      this.loading = true
      this.error = ''
      try {
        const res = await $fetch('https://fakestoreapi.com/auth/login', {
          method: 'POST',
          body: { username, password }
        })
        const users: any[] = await $fetch('https://fakestoreapi.com/users')
        const found = users.find((u) => u.username === username)
        this.user = {
          id: found?.id ?? 1,
          username,
          token: (res as any).token
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
    }
  }
})
