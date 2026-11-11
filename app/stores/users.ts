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
} from '#shared/types/fakestore'

interface State {
  users: User[]
  loading: boolean
  error: string
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
  }),
  actions: {
    /**
     * 取得所有使用者列表；已有資料時沿用 store 內容
     */
    async fetchUsers() {
      if (this.users.length) {
        return
      }
      this.loading = true
      this.error = ''
      try {
        this.users = await getUsersApi()
      } catch (error) {
        this.error = localizedError("load")
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
        const exists = this.users.find((entry) => entry.id === user.id)
        if (!exists) {
          this.users.push(user)
        }
        return user
      } catch (error) {
        this.error = localizedError("load")
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
        this.error = localizedError("save")
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
        return updated
      } catch (error) {
        this.error = localizedError("save")
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
      } catch (error) {
        this.error = localizedError("delete")
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
        return updated
      } catch (error) {
        this.error = localizedError("save")
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
