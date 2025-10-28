import { defineStore } from 'pinia'
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

export const useProductsStore = defineStore('products', {
  state: (): State => ({
    products: [],
    categories: [],
    loading: false,
    error: '',
  }),
  getters: {
    total: (state) => state.products.length,
    averagePrice: (state) => {
      if (!state.products.length) {
        return 0
      }
      const sum = state.products.reduce((acc, product) => acc + product.price, 0)
      return sum / state.products.length
    },
  },
  actions: {
    async fetchProducts(force = false) {
      if (this.products.length && !force) {
        return
      }
      this.loading = true
      this.error = ''
      try {
        const products = await $fetch<Product[]>('https://fakestoreapi.com/products')
        this.products = products
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load products.'
      } finally {
        this.loading = false
      }
    },
    async fetchCategories(force = false) {
      if (this.categories.length && !force) {
        return
      }
      try {
        const categories = await $fetch<string[]>(
          'https://fakestoreapi.com/products/categories',
        )
        this.categories = categories
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load categories.'
      }
    },
    async fetchProductById(id: number) {
      const existing = this.products.find((product) => product.id === id)
      if (existing) {
        return existing
      }
      try {
        const product = await $fetch<Product>(`https://fakestoreapi.com/products/${id}`)
        this.products.push(product)
        return product
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load product.'
        throw error
      }
    },
    async createProduct(payload: CreateProductPayload) {
      this.loading = true
      this.error = ''
      try {
        const created = await $fetch<Product>('https://fakestoreapi.com/products', {
          method: 'POST',
          body: payload,
        })
        this.products = [created, ...this.products]
        if (!this.categories.includes(created.category)) {
          this.categories.push(created.category)
        }
        return created
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to create product.'
        throw error
      } finally {
        this.loading = false
      }
    },
    async updateProduct(id: number, payload: UpdateProductPayload) {
      this.loading = true
      this.error = ''
      try {
        const updated = await $fetch<Product>(`https://fakestoreapi.com/products/${id}`, {
          method: 'PUT',
          body: payload,
        })
        this.products = this.products.map((product) =>
          product.id === id ? { ...product, ...updated } : product,
        )
        return updated
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to update product.'
        throw error
      } finally {
        this.loading = false
      }
    },
    async deleteProduct(id: number) {
      this.loading = true
      this.error = ''
      try {
        await $fetch(`https://fakestoreapi.com/products/${id}`, {
          method: 'DELETE',
        })
        this.products = this.products.filter((product) => product.id !== id)
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to delete product.'
        throw error
      } finally {
        this.loading = false
      }
    },
    async queryProducts(options: {
      limit?: number
      sort?: 'asc' | 'desc'
      category?: string
    }) {
      const query = new URLSearchParams()
      if (options.limit) {
        query.set('limit', String(options.limit))
      }
      if (options.sort) {
        query.set('sort', options.sort)
      }
      const baseUrl = options.category && options.category !== 'all'
        ? `https://fakestoreapi.com/products/category/${encodeURIComponent(options.category)}`
        : 'https://fakestoreapi.com/products'
      const url = query.toString() ? `${baseUrl}?${query.toString()}` : baseUrl
      return await $fetch<Product[]>(url)
    },
  },
})
