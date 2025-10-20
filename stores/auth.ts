import { defineStore } from 'pinia'
import { useFakeStoreApi } from '~/composables/useFakeStoreApi'
import type { FakeStoreUser } from '~/types/fakestore'
import { useCartStore } from './cart'

interface AuthenticatedUser {
  id: number
  username: string
  token: string
}

const api = useFakeStoreApi()

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthenticatedUser | null,
    profile: null as FakeStoreUser | null,
    loading: false,
    error: '',
  }),
  actions: {
    async login(username: string, password: string) {
      this.loading = true
      this.error = ''
      try {
        const response = await $fetch<{ token: string }>('https://fakestoreapi.com/auth/login', {
          method: 'POST',
          body: { username, password },
        })
        const users = await api.listUsers()
        const found = users.find((user) => user.username === username)
        if (!found) {
          throw new Error('User not found')
        }
        this.user = {
          id: found.id,
          username: found.username,
          token: response.token,
        }
        this.profile = found
      } catch (error: any) {
        this.error = error?.message || 'Login failed'
        this.user = null
        this.profile = null
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.user = null
      this.profile = null
      const cart = useCartStore()
      cart.clear()
    },
  },
})
