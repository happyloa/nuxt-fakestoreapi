import type {
  Cart,
  CreateCartPayload,
  UpdateCartPayload,
} from '#shared/types/fakestore'
import { createQueryString, fakestoreClient, type UpdateMethod } from './client'

/** 查詢購物車，可限制筆數、排序與日期範圍 */
export const getCarts = (options: {
  limit?: number
  sort?: 'asc' | 'desc'
  startDate?: string
  endDate?: string
} = {}) => {
  const query = createQueryString(options)
  return fakestoreClient<Cart[]>(query ? `/carts?${query}` : '/carts')
}

export const getCartById = (id: number) =>
  fakestoreClient<Cart>(`/carts/${id}`)

export const getCartsByUser = (userId: number) =>
  fakestoreClient<Cart[]>(`/carts/user/${userId}`)

export const createCart = (payload: CreateCartPayload) =>
  fakestoreClient<Cart>('/carts', { method: 'POST', body: payload })

/** PUT 取代整筆資料，PATCH 只更新部分欄位 */
export const updateCart = (
  id: number,
  payload: UpdateCartPayload,
  method: UpdateMethod = 'PUT',
) => fakestoreClient<Cart>(`/carts/${id}`, { method, body: payload })

export const deleteCart = (id: number) =>
  fakestoreClient<Cart>(`/carts/${id}`, { method: 'DELETE' })
