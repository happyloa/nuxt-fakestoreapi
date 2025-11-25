import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from '~/types/fakestore'
import { createQueryString, fakestoreClient } from './client'

/**
 * 取得所有使用者列表
 * @param options 篩選與排序選項
 */
export const getUsers = (options: {
  limit?: number
  sort?: 'asc' | 'desc'
} = {}) => {
  const query = createQueryString(options)
  const url = query ? `/users?${query}` : '/users'
  return fakestoreClient<User[]>(url)
}

/**
 * 取得單一使用者詳細資料
 * @param id 使用者 ID
 */
export const getUserById = (id: number) =>
  fakestoreClient<User>(`/users/${id}`)

/**
 * 建立新使用者
 * @param payload 使用者資料
 */
export const createUser = (payload: CreateUserPayload) =>
  fakestoreClient<User>('/users', {
    method: 'POST',
    body: payload,
  })

/**
 * 更新使用者資訊
 * @param id 使用者 ID
 * @param payload 更新內容
 */
export const updateUser = (id: number, payload: UpdateUserPayload) =>
  fakestoreClient<User>(`/users/${id}`, {
    method: 'PUT',
    body: payload,
  })

/**
 * 刪除使用者
 * @param id 使用者 ID
 */
export const deleteUser = (id: number) =>
  fakestoreClient<User>(`/users/${id}`, {
    method: 'DELETE',
  })
