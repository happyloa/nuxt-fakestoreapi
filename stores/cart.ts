import { defineStore } from 'pinia'

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
    error: ''
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
        } else {
          this.items = []
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
        await $fetch('https://fakestoreapi.com/carts', {
          method: 'POST',
          body: {
            userId: this.userId,
            date: new Date().toISOString(),
            products: this.items.map((i) => ({ productId: i.id, quantity: i.quantity })),
          },
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
  }
})
