import { defineStore } from 'pinia'
import { useFakeStoreClient } from '~/composables/useFakeStoreClient'
import type { Cart, Product } from '~/types/fakestore'

export interface CartItem {
  id: number
  title: string
  price: number
  image: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  userId: number | null
  loading: boolean
  error: string
  lastSyncedCart: Cart | null
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    userId: null,
    loading: false,
    error: '',
    lastSyncedCart: null,
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
      const client = useFakeStoreClient()
      this.loading = true
      this.error = ''
      this.userId = userId
      try {
        const carts = await client.listCartsByUser(userId)
        if (!carts.length) {
          this.items = []
          this.lastSyncedCart = null
          return
        }
        const latest = carts.at(-1)!
        const products = await Promise.all(
          latest.products.map(async (product) => {
            const detail = await client.getProduct(product.productId)
            return {
              id: detail.id,
              title: detail.title,
              price: detail.price,
              image: detail.image,
              quantity: product.quantity,
            }
          }),
        )
        this.items = products
        this.lastSyncedCart = latest
      } catch (error: any) {
        this.error = error?.message || 'Failed to load cart'
      } finally {
        this.loading = false
      }
    },
    async syncCart() {
      if (!this.userId) return
      const client = useFakeStoreClient()
      try {
        const payload = {
          userId: this.userId,
          date: new Date().toISOString(),
          products: this.items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }
        const response = await client.createCart(payload)
        this.lastSyncedCart = response
      } catch (error: any) {
        console.warn('Cart sync failed', error)
      }
    },
    addItem(product: Product) {
      const existing = this.items.find((item) => item.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        this.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        })
      }
      this.syncCart()
    },
    updateQuantity(id: number, quantity: number) {
      const item = this.items.find((entry) => entry.id === id)
      if (!item) return
      item.quantity = Math.max(1, quantity)
      this.syncCart()
    },
    removeItem(id: number) {
      this.items = this.items.filter((item) => item.id !== id)
      this.syncCart()
    },
    clear() {
      this.items = []
      this.lastSyncedCart = null
      this.syncCart()
      this.userId = null
    },
  },
})
