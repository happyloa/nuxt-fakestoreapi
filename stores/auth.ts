import { defineStore } from 'pinia'

export interface User {
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
        this.user = { username, token: (res as any).token }
      } catch (e: any) {
        this.error = e?.message || 'Login failed'
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.user = null
    }
  }
})
