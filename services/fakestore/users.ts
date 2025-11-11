import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from '~/types/fakestore'
import { fakestoreClient } from './client'

/**
 * 取得所有使用者資料。
 */
export const getUsers = () =>
  fakestoreClient<User[]>('/users')

/**
 * 取得單一使用者詳細資料。
 */
export const getUserById = (id: number) =>
  fakestoreClient<User>(`/users/${id}`)

/**
 * 建立新的使用者。
 */
export const createUser = (payload: CreateUserPayload) =>
  fakestoreClient<User>('/users', {
    method: 'POST',
    body: payload,
  })

/**
 * 更新使用者資訊。
 */
export const updateUser = (id: number, payload: UpdateUserPayload) =>
  fakestoreClient<User>(`/users/${id}`, {
    method: 'PUT',
    body: payload,
  })

/**
 * 刪除使用者。
 */
export const deleteUser = (id: number) =>
  fakestoreClient(`/users/${id}`, {
    method: 'DELETE',
  })
