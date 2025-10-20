import { defineStore } from 'pinia'
import { useFakeStoreApi } from '~/composables/useFakeStoreApi'
import type { CartItem } from '~/types/fakestore'

const api = useFakeStoreApi()

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    userId: null as number | null,
    loading: false,
    error: '',
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
        const carts = await api.listCartsForUser(userId)
        if (!carts.length) {
          this.items = []
          return
        }

        const latest = carts.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        )[carts.length - 1]

        const items = await Promise.all(
          latest.products.map(async (line) => {
            const product = await api.getProduct(line.productId)
            return {
              id: product.id,
              title: product.title,
              price: product.price,
              image: product.image,
              quantity: line.quantity,
            }
          }),
        )

        this.items = items
      } catch (error: any) {
        this.error = error?.message || 'Failed to load cart'
      } finally {
        this.loading = false
      }
    },
    async syncCart() {
      if (!this.userId || !this.items.length) {
        return
      }

      try {
        await api.createCart({
          userId: this.userId,
          date: new Date().toISOString(),
          products: this.items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        })
      } catch (error) {
        console.warn('Failed to sync cart', error)
      }
    },
    addItem(product: { id: number; title: string; price: number; image: string }) {
      const existing = this.items.find((item) => item.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        this.items.push({ ...product, quantity: 1 })
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
      this.userId = null
    },
  },
})
