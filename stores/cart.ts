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
    // 計算購物車總金額
    total(state) {
      return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    // 計算購物車商品總數量
    count(state) {
      return state.items.reduce((sum, item) => sum + item.quantity, 0)
    },
  },
  actions: {
    /**
     * 取得特定使用者的購物車資料
     * 會自動抓取最新的購物車紀錄並轉換為本地 items 格式
     * @param userId 使用者 ID
     */
    async fetchCart(userId: number) {
      this.loading = true
      this.error = ''
      this.userId = userId
      try {
        const carts = await getRemoteCartsByUser(userId)
        if (carts.length) {
          const latest = carts[carts.length - 1]!
          const items = await this.enrichCartItems(latest.products)
          this.items = items
          this.lastFetchedCart = latest
        } else {
          this.items = []
          this.lastFetchedCart = null
        }
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Failed to load cart'
      } finally {
        this.loading = false
      }
    },
    /**
     * 同步本地購物車到遠端伺服器
     * 每次變更購物車內容時呼叫
     */
    async syncCart() {
      if (!this.userId) return
      try {
        await this.createRemoteCart({
          userId: this.userId,
          date: new Date().toISOString(),
          products: this.items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        })
      } catch {
        // 忽略同步錯誤，避免影響使用者操作體驗
      }
    },
    /**
     * 加入商品到購物車
     * 如果商品已存在則增加數量
     */
    addItem(product: { id: number; title: string; price: number; image: string }) {
      const existing = this.items.find((i) => i.id === product.id)
      if (existing) {
        existing.quantity++
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
      this.syncCart()
    },
    /**
     * 從購物車移除商品
     * @param id 商品 ID
     */
    removeItem(id: number) {
      this.items = this.items.filter((i) => i.id !== id)
      this.syncCart()
    },
    /**
     * 增加商品數量 (+1)
     * @param id 商品 ID
     */
    increment(id: number) {
      const item = this.items.find((i) => i.id === id)
      if (item) {
        item.quantity += 1
        this.syncCart()
      }
    },
    /**
     * 減少商品數量 (-1)
     * 如果數量歸零則移除商品
     * @param id 商品 ID
     */
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
    /**
     * 清空購物車
     * @param preserveUser 是否保留使用者 ID (預設不保留)
     */
    clear({ preserveUser = false }: { preserveUser?: boolean } = {}) {
      this.items = []
      this.syncCart()
      if (!preserveUser) {
        this.userId = null
      }
    },
    /**
     * 結帳
     * 建立一筆新的訂單 (模擬) 並清空購物車
     */
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
    /**
     * 管理員功能：取得所有購物車列表
     */
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
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load carts.'
        throw error
      }
    },
    /**
     * 管理員功能：取得單一購物車
     */
    async fetchCartById(id: number) {
      try {
        const cart = await getRemoteCartById(id)
        this.lastFetchedCart = cart
        return cart
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load cart.'
        throw error
      }
    },
    /**
     * 管理員功能：取得特定使用者的所有購物車
     */
    async fetchCartsByUser(userId: number) {
      try {
        const carts = await getRemoteCartsByUser(userId)
        this.carts = carts
        return carts
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load user carts.'
        throw error
      }
    },
    /**
     * 管理員功能：建立遠端購物車
     */
    async createRemoteCart(payload: CreateCartPayload) {
      const created = await createCartApi(payload)
      this.carts = [created, ...this.carts]
      return created
    },
    /**
     * 管理員功能：更新遠端購物車
     */
    async updateRemoteCart(id: number, payload: UpdateCartPayload) {
      const updated = await updateCartApi(id, payload)
      this.carts = this.carts.map((cart) => (cart.id === id ? updated : cart))
      if (this.lastFetchedCart?.id === id) {
        this.lastFetchedCart = updated
      }
      return updated
    },
    /**
     * 管理員功能：刪除遠端購物車
     */
    async deleteRemoteCart(id: number) {
      await deleteCartApi(id)
      this.carts = this.carts.filter((cart) => cart.id !== id)
      if (this.lastFetchedCart?.id === id) {
        this.lastFetchedCart = null
      }
    },
    /**
     * 輔助函式：將購物車項目補齊詳細商品資料
     * 因為 API 回傳的購物車只有 productId，需要額外查詢商品詳情
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
