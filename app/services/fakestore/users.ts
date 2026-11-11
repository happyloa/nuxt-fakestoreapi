import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from '#shared/types/fakestore'
import { createQueryString, fakestoreClient, type UpdateMethod } from './client'

/** 查詢會員，可限制筆數與排序 */
export const getUsers = (options: {
  limit?: number
  sort?: 'asc' | 'desc'
} = {}) => {
  const query = createQueryString(options)
  return fakestoreClient<User[]>(query ? `/users?${query}` : '/users')
}

export const getUserById = (id: number) =>
  fakestoreClient<User>(`/users/${id}`)

export const createUser = (payload: CreateUserPayload) =>
  fakestoreClient<User>('/users', { method: 'POST', body: payload })

/** PUT 取代整筆資料，PATCH 只更新部分欄位 */
export const updateUser = (
  id: number,
  payload: UpdateUserPayload,
  method: UpdateMethod = 'PUT',
) => fakestoreClient<User>(`/users/${id}`, { method, body: payload })

export const deleteUser = (id: number) =>
  fakestoreClient<User>(`/users/${id}`, { method: 'DELETE' })
