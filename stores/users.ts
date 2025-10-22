import { defineStore } from 'pinia'
import type { User } from '~/types/fakestore'

interface State {
  users: User[]
  loading: boolean
  error: string
}

export const useUsersStore = defineStore('users', {
  state: (): State => ({
    users: [],
    loading: false,
    error: '',
  }),
  actions: {
    async fetchUsers(force = false) {
      if (this.users.length && !force) {
        return
      }
      this.loading = true
      this.error = ''
      try {
        const users = await $fetch<User[]>('https://fakestoreapi.com/users')
        this.users = users
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load users.'
      } finally {
        this.loading = false
      }
    },
  },
})
