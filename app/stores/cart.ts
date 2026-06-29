import { defineStore } from "pinia";
import {
  createCart as createCartApi,
  getCartsByUser as getRemoteCartsByUser,
} from "~/services/fakestore/carts";
import { getProductById } from "~/services/fakestore/products";
import { useProductsStore } from "~/stores/products";
import type { Cart, CartProductItem } from "~/types/fakestore";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

// syncCart 防抖：將短時間內連續的購物車變更合併成一次 POST，避免請求風暴。
// 僅在 client 端使用者操作時觸發，故以 module 層 timer 實作即可。
let syncTimer: ReturnType<typeof setTimeout> | null = null;
function cancelPendingSync() {
  if (syncTimer) {
    clearTimeout(syncTimer);
    syncTimer = null;
  }
}

/**
 * 「登入使用者自己的購物車」Store。
 * 管理員的購物車列表 CRUD（API 操作台用）已分離至 useAdminCartsStore，
 * 使用者加減商品的同步不再經過會 mutate 管理員列表的 createRemoteCart，
 * 而是直接呼叫 service，根治原本的雙語意耦合。
 */
export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
    lastOrderItems: [] as CartItem[],
    userId: null as number | null,
    loading: false,
    error: "",
    lastFetchedCart: null as Cart | null,
  }),
  getters: {
    // 計算購物車總金額
    total(state) {
      return state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
    },
    // 計算購物車商品總數量
    count(state) {
      return state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
  },
  actions: {
    /**
     * 取得特定使用者的購物車資料，並轉換為本地 items 格式
     * @param userId 使用者 ID
     */
    async fetchCart(userId: number) {
      this.loading = true;
      this.error = "";
      this.userId = userId;
      try {
        const carts = await getRemoteCartsByUser(userId);
        if (carts.length) {
          const latest = carts[carts.length - 1]!;
          const items = await this.enrichCartItems(latest.products);
          this.items = items;
          this.lastFetchedCart = latest;
        } else {
          this.items = [];
          this.lastFetchedCart = null;
        }
      } catch {
        this.error = localizedError("load");
      } finally {
        this.loading = false;
      }
    },
    /**
     * 將購物車同步排入防抖佇列（300ms 內的連續變更只送一次）
     */
    queueSync() {
      cancelPendingSync();
      syncTimer = setTimeout(() => {
        syncTimer = null;
        this.syncCart();
      }, 300);
    },
    /**
     * 同步本地購物車到遠端伺服器（直接呼叫 service，不經管理員列表）
     */
    async syncCart() {
      if (!this.userId) return;
      try {
        await createCartApi({
          userId: this.userId,
          date: new Date().toISOString(),
          products: this.items.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
          })),
        });
      } catch {
        // 忽略同步錯誤，避免影響使用者操作體驗
      }
    },
    /**
     * 加入商品到購物車（已存在則增加數量）
     */
    addItem(product: {
      id: number;
      title: string;
      price: number;
      image: string;
    }) {
      const existing = this.items.find((i) => i.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
      this.queueSync();
    },
    /**
     * 從購物車移除商品
     */
    removeItem(id: number) {
      this.items = this.items.filter((i) => i.id !== id);
      this.queueSync();
    },
    /**
     * 增加商品數量 (+1)
     */
    increment(id: number) {
      const item = this.items.find((i) => i.id === id);
      if (item) {
        item.quantity += 1;
        this.queueSync();
      }
    },
    /**
     * 減少商品數量 (-1)，歸零則移除
     */
    decrement(id: number) {
      const item = this.items.find((i) => i.id === id);
      if (!item) {
        return;
      }
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.items = this.items.filter((i) => i.id !== id);
      }
      this.queueSync();
    },
    /**
     * 清空購物車
     * @param preserveUser 是否保留使用者 ID (預設不保留)
     */
    clear({ preserveUser = false }: { preserveUser?: boolean } = {}) {
      // 清空不主動同步：FakeStore 為 mock API，POST 空車無意義
      cancelPendingSync();
      this.items = [];
      if (!preserveUser) {
        this.userId = null;
      }
    },
    /**
     * 結帳：建立一筆新訂單 (模擬) 並清空購物車
     */
    async checkout() {
      cancelPendingSync();
      if (!this.userId) {
        throw new Error("User not authenticated");
      }
      if (!this.items.length) {
        return null;
      }
      const order = await createCartApi({
        userId: this.userId,
        date: new Date().toISOString(),
        products: this.items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });
      this.lastFetchedCart = order;
      this.lastOrderItems = [...this.items];
      this.items = [];
      return order;
    },
    /**
     * 輔助函式：將購物車項目補齊詳細商品資料
     * 因為 API 回傳的購物車只有 productId，需要額外查詢商品詳情
     */
    async enrichCartItems(products: CartProductItem[]): Promise<CartItem[]> {
      const productsStore = useProductsStore();
      const items = await Promise.all(
        products.map(async (product) => {
          // 先查 products store 既有快取，命中則免發單品請求
          const cached = productsStore.products.find(
            (p) => p.id === product.productId,
          );
          const detail = cached ?? (await getProductById(product.productId));
          return {
            id: detail.id,
            title: detail.title,
            price: detail.price,
            image: detail.image,
            quantity: product.quantity,
          };
        }),
      );
      return items;
    },
  },
});
