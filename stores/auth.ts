import { defineStore } from 'pinia'
import { useFakeStoreClient } from '~/composables/useFakeStoreClient'
import { useCartStore } from './cart'

export interface SessionUser {
  id: number
  username: string
  token: string
}

interface AuthState {
  user: SessionUser | null
  loading: boolean
  error: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    error: '',
  }),
  actions: {
    async login(username: string, password: string) {
      const client = useFakeStoreClient()
      this.loading = true
      this.error = ''
      try {
        const [{ token }, users] = await Promise.all([
          client.login(username, password),
          client.listUsers(),
        ])
        const found = users.find((user) => user.username === username)
        this.user = {
          id: found?.id ?? 1,
          username,
          token,
        }
        if (this.user) {
          const cart = useCartStore()
          await cart.fetchCart(this.user.id)
        }
      } catch (error: any) {
        this.error = error?.message || 'Login failed'
        this.user = null
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.user = null
      const cart = useCartStore()
      cart.clear()
    },
  },
})
