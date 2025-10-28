import { defineStore } from 'pinia'
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
    }
  },
  actions: {
    async fetchCart(userId: number) {
      this.loading = true
      this.error = ''
      this.userId = userId
      try {
        const res: any[] = await $fetch(`https://fakestoreapi.com/carts/user/${userId}`)
        if (res.length) {
          const latest = res[res.length - 1]
          const items = await Promise.all(
            latest.products.map(async (p: any) => {
              const prod: any = await $fetch(
                `https://fakestoreapi.com/products/${p.productId}`,
              )
              return {
                id: prod.id,
                title: prod.title,
                price: prod.price,
                image: prod.image,
                quantity: p.quantity,
              }
            }),
          )
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
      const query = new URLSearchParams()
      if (options.startDate) {
        query.set('startdate', options.startDate)
      }
      if (options.endDate) {
        query.set('enddate', options.endDate)
      }
      if (options.sort) {
        query.set('sort', options.sort)
      }
      if (options.limit) {
        query.set('limit', String(options.limit))
      }
      const url = query.toString()
        ? `https://fakestoreapi.com/carts?${query.toString()}`
        : 'https://fakestoreapi.com/carts'
      try {
        const carts = await $fetch<Cart[]>(url)
        this.carts = carts
        return carts
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load carts.'
        throw error
      }
    },
    async fetchCartById(id: number) {
      try {
        const cart = await $fetch<Cart>(`https://fakestoreapi.com/carts/${id}`)
        this.lastFetchedCart = cart
        return cart
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load cart.'
        throw error
      }
    },
    async fetchCartsByUser(userId: number) {
      try {
        const carts = await $fetch<Cart[]>(`https://fakestoreapi.com/carts/user/${userId}`)
        this.carts = carts
        return carts
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load user carts.'
        throw error
      }
    },
    async createRemoteCart(payload: CreateCartPayload) {
      const created = await $fetch<Cart>('https://fakestoreapi.com/carts', {
        method: 'POST',
        body: payload,
      })
      this.carts = [created, ...this.carts]
      return created
    },
    async updateRemoteCart(id: number, payload: UpdateCartPayload) {
      const updated = await $fetch<Cart>(`https://fakestoreapi.com/carts/${id}`, {
        method: 'PUT',
        body: payload,
      })
      this.carts = this.carts.map((cart) => (cart.id === id ? updated : cart))
      if (this.lastFetchedCart?.id === id) {
        this.lastFetchedCart = updated
      }
      return updated
    },
    async deleteRemoteCart(id: number) {
      await $fetch(`https://fakestoreapi.com/carts/${id}`, {
        method: 'DELETE',
      })
      this.carts = this.carts.filter((cart) => cart.id !== id)
      if (this.lastFetchedCart?.id === id) {
        this.lastFetchedCart = null
      }
    },
  }
})
