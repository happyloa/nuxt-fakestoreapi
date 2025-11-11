import { defineStore } from 'pinia'
import {
  createCart as createCartApi,
  deleteCart as deleteCartApi,
  getCartById as getRemoteCartById,
  getCarts as getRemoteCarts,
  getCartsByUser as getRemoteCartsByUser,
  updateCart as updateCartApi,
} from '~/services/fakestore/carts'
import { getProductById } from '~/services/fakestore/products'
import type {
  Cart,
  CartProductItem,
  CreateCartPayload,
  UpdateCartPayload,
} from '~/types/fakestore'

export interface CartItem {
  id: number
  title: string
  price: number
  image: string
  quantity: number
}

/**
 * 處理購物車與 Fake Store API 互動的 Store。
 * 將遠端資料轉換為本地可以直接使用的結構，並維持登入使用者的購物車同步。
 */
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    userId: null as number | null,
    loading: false,
    error: '',
    carts: [] as Cart[],
    lastFetchedCart: null as Cart | null,
  }),
  getters: {
    total(state) {
      return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    count(state) {
      return state.items.reduce((sum, item) => sum + item.quantity, 0)
    },
  },
  actions: {
    async fetchCart(userId: number) {
      this.loading = true
      this.error = ''
      this.userId = userId
      try {
        const carts = await getRemoteCartsByUser(userId)
        if (carts.length) {
          const latest = carts[carts.length - 1]
          const items = await this.enrichCartItems(latest.products)
          this.items = items
          this.lastFetchedCart = latest
        } else {
          this.items = []
          this.lastFetchedCart = null
        }
      } catch (e: any) {
        this.error = e?.message || 'Failed to load cart'
      } finally {
        this.loading = false
      }
    },
    async syncCart() {
      if (!this.userId) return
      try {
        await this.createRemoteCart({
          userId: this.userId,
          date: new Date().toISOString(),
          products: this.items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        })
      } catch {
        // ignore sync errors
      }
    },
    addItem(product: { id: number; title: string; price: number; image: string }) {
      const existing = this.items.find((i) => i.id === product.id)
      if (existing) {
        existing.quantity++
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
      this.syncCart()
    },
    removeItem(id: number) {
      this.items = this.items.filter((i) => i.id !== id)
      this.syncCart()
    },
    increment(id: number) {
      const item = this.items.find((i) => i.id === id)
      if (item) {
        item.quantity += 1
        this.syncCart()
      }
    },
    decrement(id: number) {
      const item = this.items.find((i) => i.id === id)
      if (!item) {
        return
      }
      if (item.quantity > 1) {
        item.quantity -= 1
      } else {
        this.items = this.items.filter((i) => i.id !== id)
      }
      this.syncCart()
    },
    clear({ preserveUser = false }: { preserveUser?: boolean } = {}) {
      this.items = []
      this.syncCart()
      if (!preserveUser) {
        this.userId = null
      }
    },
    async checkout() {
      if (!this.userId) {
        throw new Error('User not authenticated')
      }
      if (!this.items.length) {
        return null
      }
      const order = await this.createRemoteCart({
        userId: this.userId,
        date: new Date().toISOString(),
        products: this.items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      })
      this.lastFetchedCart = order
      this.items = []
      return order
    },
    async fetchAllCarts(options: {
      startDate?: string
      endDate?: string
      sort?: 'asc' | 'desc'
      limit?: number
    } = {}) {
      try {
        const carts = await getRemoteCarts({
          limit: options.limit,
          sort: options.sort,
          startDate: options.startDate,
          endDate: options.endDate,
        })
        this.carts = carts
        return carts
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load carts.'
        throw error
      }
    },
    async fetchCartById(id: number) {
      try {
        const cart = await getRemoteCartById(id)
        this.lastFetchedCart = cart
        return cart
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load cart.'
        throw error
      }
    },
    async fetchCartsByUser(userId: number) {
      try {
        const carts = await getRemoteCartsByUser(userId)
        this.carts = carts
        return carts
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load user carts.'
        throw error
      }
    },
    async createRemoteCart(payload: CreateCartPayload) {
      const created = await createCartApi(payload)
      this.carts = [created, ...this.carts]
      return created
    },
    async updateRemoteCart(id: number, payload: UpdateCartPayload) {
      const updated = await updateCartApi(id, payload)
      this.carts = this.carts.map((cart) => (cart.id === id ? updated : cart))
      if (this.lastFetchedCart?.id === id) {
        this.lastFetchedCart = updated
      }
      return updated
    },
    async deleteRemoteCart(id: number) {
      await deleteCartApi(id)
      this.carts = this.carts.filter((cart) => cart.id !== id)
      if (this.lastFetchedCart?.id === id) {
        this.lastFetchedCart = null
      }
    },
    /**
     * 將購物車項目補齊詳細商品資料。
     */
    async enrichCartItems(products: CartProductItem[]): Promise<CartItem[]> {
      const items = await Promise.all(
        products.map(async (product) => {
          const detail = await getProductById(product.productId)
          return {
            id: detail.id,
            title: detail.title,
            price: detail.price,
            image: detail.image,
            quantity: product.quantity,
          }
        }),
      )
      return items
    },
  }
})
