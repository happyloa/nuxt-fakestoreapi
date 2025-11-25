import { defineStore } from 'pinia'
import {
  createProduct as createProductApi,
  deleteProduct as deleteProductApi,
  getAllProducts,
  getProductById,
  getProductCategories,
  queryProducts as queryProductsApi,
  updateProduct as updateProductApi,
} from '~/services/fakestore/products'
import type {
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from '~/types/fakestore'

interface State {
  products: Product[]
  categories: string[]
  loading: boolean
  error: string
}

/**
 * 商品資料的集中管理 Store。
 * 透過結合 services 層的 API 呼叫，讓元件只需要關注狀態與畫面呈現，
 * 也方便在未來接軌快取或離線體驗。
 */
export const useProductsStore = defineStore('products', {
  state: (): State => ({
    products: [],
    categories: [],
    loading: false,
    error: '',
  }),
  getters: {
    // 計算商品總數
    total: (state) => state.products.length,
    // 計算商品平均價格
    averagePrice: (state) => {
      if (!state.products.length) {
        return 0
      }
      const sum = state.products.reduce((acc, product) => acc + product.price, 0)
      return sum / state.products.length
    },
  },
  actions: {
    /**
     * 取得所有商品列表
     * @param force 是否強制重新抓取 (忽略快取)
     */
    async fetchProducts(force = false) {
      if (this.products.length && !force) {
        return
      }
      this.loading = true
      this.error = ''
      try {
        const products = await getAllProducts()
        this.products = products
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load products.'
      } finally {
        this.loading = false
      }
    },
    /**
     * 取得商品分類列表
     * @param force 是否強制重新抓取
     */
    async fetchCategories(force = false) {
      if (this.categories.length && !force) {
        return
      }
      try {
        const categories = await getProductCategories()
        this.categories = categories
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load categories.'
      }
    },
    /**
     * 取得單一商品詳細資料
     * 如果本地已有資料則直接回傳，否則發送 API 請求
     * @param id 商品 ID
     */
    async fetchProductById(id: number) {
      const existing = this.products.find((product) => product.id === id)
      if (existing) {
        return existing
      }
      try {
        const product = await getProductById(id)
        this.products.push(product)
        return product
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load product.'
        throw error
      }
    },
    /**
     * 建立新商品
     * 成功後會自動更新本地商品列表與分類
     * @param payload 商品資料
     */
    async createProduct(payload: CreateProductPayload) {
      this.loading = true
      this.error = ''
      try {
        const created = await createProductApi(payload)
        this.products = [created, ...this.products]
        if (!this.categories.includes(created.category)) {
          this.categories.push(created.category)
        }
        return created
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create product.'
        throw error
      } finally {
        this.loading = false
      }
    },
    /**
     * 更新商品資訊
     * @param id 商品 ID
     * @param payload 更新內容
     */
    async updateProduct(id: number, payload: UpdateProductPayload) {
      this.loading = true
      this.error = ''
      try {
        const updated = await updateProductApi(id, payload)
        this.products = this.products.map((product) =>
          product.id === id ? { ...product, ...updated } : product,
        )
        return updated
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update product.'
        throw error
      } finally {
        this.loading = false
      }
    },
    /**
     * 刪除商品
     * @param id 商品 ID
     */
    async deleteProduct(id: number) {
      this.loading = true
      this.error = ''
      try {
        await deleteProductApi(id)
        this.products = this.products.filter((product) => product.id !== id)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete product.'
        throw error
      } finally {
        this.loading = false
      }
    },
    /**
     * 根據條件查詢商品
     * @param options 查詢選項 (limit, sort, category)
     */
    async queryProducts(options: {
      limit?: number
      sort?: 'asc' | 'desc'
      category?: string
    }) {
      return await queryProductsApi({
        limit: options.limit,
        sort: options.sort,
        category: options.category,
      })
    },
  },
})
