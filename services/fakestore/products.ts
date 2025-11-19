import type {
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from '~/types/fakestore'
import { createQueryString, fakestoreClient } from './client'

/**
 * 取得所有產品列表
 * @param options 篩選與排序選項
 */
export const getAllProducts = (options: {
  limit?: number
  sort?: 'asc' | 'desc'
} = {}) => {
  const query = createQueryString(options)
  const url = query ? `/products?${query}` : '/products'
  return fakestoreClient<Product[]>(url)
}

/**
 * 查詢產品 (支援分類與排序)
 * @param options 查詢選項
 */
export const queryProducts = (options: {
  limit?: number
  sort?: 'asc' | 'desc'
  category?: string
}) => {
  let url = '/products'
  if (options.category && options.category !== 'all') {
    url += `/category/${options.category}`
  }
  const query = createQueryString({ limit: options.limit, sort: options.sort })
  if (query) {
    url += `?${query}`
  }
  return fakestoreClient<Product[]>(url)
}

/**
 * 取得單一產品詳細資料
 * @param id 產品 ID
 */
export const getProductById = (id: number) =>
  fakestoreClient<Product>(`/products/${id}`)

/**
 * 取得所有產品分類
 */
export const getProductCategories = () =>
  fakestoreClient<string[]>('/products/categories')

/**
 * 建立新產品
 * @param payload 產品資料
 */
export const createProduct = (payload: CreateProductPayload) =>
  fakestoreClient<Product>('/products', {
    method: 'POST',
    body: payload,
  })

/**
 * 更新產品資訊
 * @param id 產品 ID
 * @param payload 更新內容
 */
export const updateProduct = (id: number, payload: UpdateProductPayload) =>
  fakestoreClient<Product>(`/products/${id}`, {
    method: 'PUT',
    body: payload,
  })

/**
 * 刪除產品
 * @param id 產品 ID
 */
export const deleteProduct = (id: number) =>
  fakestoreClient<Product>(`/products/${id}`, {
    method: 'DELETE',
  })
