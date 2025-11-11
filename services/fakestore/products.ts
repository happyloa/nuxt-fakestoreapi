import type {
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from '~/types/fakestore'
import { createQueryString, fakestoreClient } from './client'

/**
 * 取得全部商品列表。
 */
export const getAllProducts = () =>
  fakestoreClient<Product[]>('/products')

/**
 * 取得所有商品分類。
 */
export const getProductCategories = () =>
  fakestoreClient<string[]>('/products/categories')

/**
 * 透過商品編號取得單一商品資訊。
 */
export const getProductById = (id: number) =>
  fakestoreClient<Product>(`/products/${id}`)

/**
 * 建立一筆新的商品資料。
 */
export const createProduct = (payload: CreateProductPayload) =>
  fakestoreClient<Product>('/products', {
    method: 'POST',
    body: payload,
  })

/**
 * 更新指定商品的資訊。
 */
export const updateProduct = (
  id: number,
  payload: UpdateProductPayload,
) =>
  fakestoreClient<Product>(`/products/${id}`, {
    method: 'PUT',
    body: payload,
  })

/**
 * 刪除指定的商品。
 */
export const deleteProduct = (id: number) =>
  fakestoreClient(`/products/${id}`, {
    method: 'DELETE',
  })

/**
 * 透過 Fake Store API 的查詢參數取得過濾結果。
 */
export const queryProducts = (options: {
  limit?: number
  sort?: 'asc' | 'desc'
  category?: string
}) => {
  const path =
    options.category && options.category !== 'all'
      ? `/products/category/${encodeURIComponent(options.category)}`
      : '/products'

  const query = createQueryString({
    limit: options.limit,
    sort: options.sort,
  })

  const url = query ? `${path}?${query}` : path
  return fakestoreClient<Product[]>(url)
}
