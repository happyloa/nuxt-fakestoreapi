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
    items: [] as CartItem[]
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
    addItem(product: {id:number,title:string,price:number,image:string}) {
      const existing = this.items.find(i => i.id === product.id)
      if (existing) {
        existing.quantity++
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
    },
    removeItem(id: number) {
      this.items = this.items.filter(i => i.id !== id)
    },
    clear() {
      this.items = []
    }
  }
})
