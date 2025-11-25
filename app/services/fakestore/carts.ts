import type {
  Cart,
  CreateCartPayload,
  UpdateCartPayload,
} from '~/types/fakestore'
import { createQueryString, fakestoreClient } from './client'

/**
 * 取得所有購物車列表
 * @param options 篩選與排序選項
 */
export const getCarts = (options: {
  limit?: number
  sort?: 'asc' | 'desc'
  startDate?: string
  endDate?: string
} = {}) => {
  const query = createQueryString(options)
  const url = query ? `/carts?${query}` : '/carts'
  return fakestoreClient<Cart[]>(url)
}

/**
 * 取得單一購物車詳細資料
 * @param id 購物車 ID
 */
export const getCartById = (id: number) =>
  fakestoreClient<Cart>(`/carts/${id}`)

/**
 * 取得特定使用者的購物車
 * @param userId 使用者 ID
 */
export const getCartsByUser = (userId: number) =>
  fakestoreClient<Cart[]>(`/carts/user/${userId}`)

/**
 * 建立新購物車
 * @param payload 購物車資料
 */
export const createCart = (payload: CreateCartPayload) =>
  fakestoreClient<Cart>('/carts', {
    method: 'POST',
    body: payload,
  })

/**
 * 更新購物車內容
 * @param id 購物車 ID
 * @param payload 更新內容
 */
export const updateCart = (id: number, payload: UpdateCartPayload) =>
  fakestoreClient<Cart>(`/carts/${id}`, {
    method: 'PUT',
    body: payload,
  })

/**
 * 刪除購物車
 * @param id 購物車 ID
 */
export const deleteCart = (id: number) =>
  fakestoreClient<Cart>(`/carts/${id}`, {
    method: 'DELETE',
  })
