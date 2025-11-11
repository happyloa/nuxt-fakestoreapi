import type {
  Cart,
  CreateCartPayload,
  UpdateCartPayload,
} from '~/types/fakestore'
import { createQueryString, fakestoreClient } from './client'

/**
 * 取得伺服器端的購物車集合。
 */
export const getCarts = (options: {
  startDate?: string
  endDate?: string
  sort?: 'asc' | 'desc'
  limit?: number
} = {}) => {
  const query = createQueryString({
    startdate: options.startDate,
    enddate: options.endDate,
    sort: options.sort,
    limit: options.limit,
  })
  const url = query ? `/carts?${query}` : '/carts'
  return fakestoreClient<Cart[]>(url)
}

/**
 * 取得單一購物車資訊。
 */
export const getCartById = (id: number) =>
  fakestoreClient<Cart>(`/carts/${id}`)

/**
 * 取得指定使用者的所有購物車紀錄。
 */
export const getCartsByUser = (userId: number) =>
  fakestoreClient<Cart[]>(`/carts/user/${userId}`)

/**
 * 建立遠端購物車。
 */
export const createCart = (payload: CreateCartPayload) =>
  fakestoreClient<Cart>('/carts', {
    method: 'POST',
    body: payload,
  })

/**
 * 更新遠端購物車。
 */
export const updateCart = (id: number, payload: UpdateCartPayload) =>
  fakestoreClient<Cart>(`/carts/${id}`, {
    method: 'PUT',
    body: payload,
  })

/**
 * 刪除遠端購物車紀錄。
 */
export const deleteCart = (id: number) =>
  fakestoreClient(`/carts/${id}`, {
    method: 'DELETE',
  })
