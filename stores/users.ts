import { defineStore } from 'pinia'
import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from '~/types/fakestore'

interface State {
  users: User[]
  loading: boolean
  error: string
  selectedUser: User | null
}

export const useUsersStore = defineStore('users', {
  state: (): State => ({
    users: [],
    loading: false,
    error: '',
    selectedUser: null as User | null,
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
    async fetchUserById(id: number) {
      this.loading = true
      this.error = ''
      try {
        const user = await $fetch<User>(`https://fakestoreapi.com/users/${id}`)
        this.selectedUser = user
        const exists = this.users.find((entry) => entry.id === user.id)
        if (!exists) {
          this.users.push(user)
        }
        return user
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load user.'
        throw error
      } finally {
        this.loading = false
      }
    },
    async createUser(payload: CreateUserPayload) {
      this.loading = true
      this.error = ''
      try {
        const created = await $fetch<User>('https://fakestoreapi.com/users', {
          method: 'POST',
          body: payload,
        })
        this.users.push(created)
        return created
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to create user.'
        throw error
      } finally {
        this.loading = false
      }
    },
    async updateUser(id: number, payload: UpdateUserPayload) {
      this.loading = true
      this.error = ''
      try {
        const updated = await $fetch<User>(`https://fakestoreapi.com/users/${id}`, {
          method: 'PUT',
          body: payload,
        })
        this.users = this.users.map((user) =>
          user.id === id ? { ...user, ...updated } : user,
        )
        this.selectedUser = updated
        return updated
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to update user.'
        throw error
      } finally {
        this.loading = false
      }
    },
    async deleteUser(id: number) {
      this.loading = true
      this.error = ''
      try {
        await $fetch(`https://fakestoreapi.com/users/${id}`, {
          method: 'DELETE',
        })
        this.users = this.users.filter((user) => user.id !== id)
        if (this.selectedUser?.id === id) {
          this.selectedUser = null
        }
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to delete user.'
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
