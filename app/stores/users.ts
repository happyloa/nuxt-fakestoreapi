import { defineStore } from 'pinia'
import {
  createUser as createUserApi,
  deleteUser as deleteUserApi,
  getUserById as getUserByIdApi,
  getUsers as getUsersApi,
  patchUser as patchUserApi,
  updateUser as updateUserApi,
} from '~/services/fakestore/users'
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

/**
 * 使用者資料維護的 Store。
 * 將所有 Fake Store API 的互動封裝起來，保持元件的簡潔度。
 */
export const useUsersStore = defineStore('users', {
  state: (): State => ({
    users: [],
    loading: false,
    error: '',
    selectedUser: null as User | null,
  }),
  actions: {
    /**
     * 取得所有使用者列表
     * @param force 是否強制重新抓取
     */
    async fetchUsers(options: { limit?: number; sort?: 'asc' | 'desc'; force?: boolean } = {}) {
      if (this.users.length && !options.force && !options.limit && !options.sort) {
        return
      }
      this.loading = true
      this.error = ''
      try {
        const users = await getUsersApi({
          limit: options.limit,
          sort: options.sort
        })
        if (!options.limit && !options.sort) {
          this.users = users
        }
        return users
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load users.'
      } finally {
        this.loading = false
      }
    },
    /**
     * 專門用於 API 操作區的查詢
     */
    async queryUsers(options: { limit?: number; sort?: 'asc' | 'desc' }) {
      return await getUsersApi(options)
    },
    /**
     * 取得單一使用者詳細資料
     * @param id 使用者 ID
     */
    async fetchUserById(id: number) {
      this.loading = true
      this.error = ''
      try {
        const user = await getUserByIdApi(id)
        this.selectedUser = user
        const exists = this.users.find((entry) => entry.id === user.id)
        if (!exists) {
          this.users.push(user)
        }
        return user
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load user.'
        throw error
      } finally {
        this.loading = false
      }
    },
    /**
     * 建立新使用者
     * @param payload 使用者資料
     */
    async createUser(payload: CreateUserPayload) {
      this.loading = true
      this.error = ''
      try {
        const created = await createUserApi(payload)
        this.users.push(created)
        return created
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create user.'
        throw error
      } finally {
        this.loading = false
      }
    },
    /**
     * 更新使用者資訊
     * @param id 使用者 ID
     * @param payload 更新內容
     */
    async updateUser(id: number, payload: UpdateUserPayload) {
      this.loading = true
      this.error = ''
      try {
        const updated = await updateUserApi(id, payload)
        this.users = this.users.map((user) =>
          user.id === id ? { ...user, ...updated } : user,
        )
        this.selectedUser = updated
        return updated
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update user.'
        throw error
      } finally {
        this.loading = false
      }
    },
    /**
     * 刪除使用者
     * @param id 使用者 ID
     */
    async deleteUser(id: number) {
      this.loading = true
      this.error = ''
      try {
        await deleteUserApi(id)
        this.users = this.users.filter((user) => user.id !== id)
        if (this.selectedUser?.id === id) {
          this.selectedUser = null
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete user.'
        throw error
      } finally {
        this.loading = false
      }
    },
    /**
     * 部分更新使用者資訊 (PATCH)
     * @param id 使用者 ID
     * @param payload 更新內容
     */
    async patchUser(id: number, payload: UpdateUserPayload) {
      this.loading = true
      this.error = ''
      try {
        const updated = await patchUserApi(id, payload)
        this.users = this.users.map((user) =>
          user.id === id ? { ...user, ...updated } : user,
        )
        this.selectedUser = updated
        return updated
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to patch user.'
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
