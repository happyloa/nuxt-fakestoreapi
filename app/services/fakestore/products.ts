import type {
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from '#shared/types/fakestore'
import { createQueryString, fakestoreClient, type UpdateMethod } from './client'

/** 查詢商品，可依分類篩選並限制筆數與排序 */
export const queryProducts = (options: {
  limit?: number
  sort?: 'asc' | 'desc'
  category?: string
}) => {
  let url = '/products'
  if (options.category && options.category !== 'all') {
    url += `/category/${encodeURIComponent(options.category)}`
  }
  const query = createQueryString({ limit: options.limit, sort: options.sort })
  return fakestoreClient<Product[]>(query ? `${url}?${query}` : url)
}

/** 透過本站有快取的 BFF 取得單一商品（已整理過的資料） */
export const getProductById = (id: number) =>
  $fetch<Product>(`/api/products/${id}`)

export const getProductCategories = () =>
  fakestoreClient<string[]>('/products/categories')

export const createProduct = (payload: CreateProductPayload) =>
  fakestoreClient<Product>('/products', { method: 'POST', body: payload })

/** PUT 取代整筆資料，PATCH 只更新部分欄位 */
export const updateProduct = (
  id: number,
  payload: UpdateProductPayload,
  method: UpdateMethod = 'PUT',
) => fakestoreClient<Product>(`/products/${id}`, { method, body: payload })

export const deleteProduct = (id: number) =>
  fakestoreClient<Product>(`/products/${id}`, { method: 'DELETE' })
