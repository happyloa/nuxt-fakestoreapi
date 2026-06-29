import { defineStore } from "pinia";
import {
  createCart as createCartApi,
  deleteCart as deleteCartApi,
  getCartById as getRemoteCartById,
  getCarts as getRemoteCarts,
  getCartsByUser as getRemoteCartsByUser,
  patchCart as patchCartApi,
  updateCart as updateCartApi,
} from "~/services/fakestore/carts";
import type {
  Cart,
  CreateCartPayload,
  UpdateCartPayload,
} from "~/types/fakestore";

/**
 * 管理員購物車 Store（API 操作台使用）。
 * 與「使用者自己的購物車」(useCartStore) 分離，這樣使用者加減商品的同步
 * 不會污染這份管理員列表 (carts)。
 */
export const useAdminCartsStore = defineStore("adminCarts", {
  state: () => ({
    carts: [] as Cart[],
    lastFetchedCart: null as Cart | null,
    error: "",
  }),
  actions: {
    /**
     * 取得所有購物車列表
     */
    async fetchAllCarts(
      options: {
        startDate?: string;
        endDate?: string;
        sort?: "asc" | "desc";
        limit?: number;
      } = {},
    ) {
      try {
        const carts = await getRemoteCarts({
          limit: options.limit,
          sort: options.sort,
          startDate: options.startDate,
          endDate: options.endDate,
        });
        this.carts = carts;
        return carts;
      } catch (error) {
        this.error = localizedError("load");
        throw error;
      }
    },
    /**
     * 取得單一購物車
     */
    async fetchCartById(id: number) {
      try {
        const cart = await getRemoteCartById(id);
        this.lastFetchedCart = cart;
        return cart;
      } catch (error) {
        this.error = localizedError("load");
        throw error;
      }
    },
    /**
     * 取得特定使用者的所有購物車
     */
    async fetchCartsByUser(userId: number) {
      try {
        const carts = await getRemoteCartsByUser(userId);
        this.carts = carts;
        return carts;
      } catch (error) {
        this.error = localizedError("load");
        throw error;
      }
    },
    /**
     * 建立遠端購物車
     */
    async createRemoteCart(payload: CreateCartPayload) {
      const created = await createCartApi(payload);
      this.carts = [created, ...this.carts];
      return created;
    },
    /**
     * 更新遠端購物車 (PUT)
     */
    async updateRemoteCart(id: number, payload: UpdateCartPayload) {
      const updated = await updateCartApi(id, payload);
      this.carts = this.carts.map((cart) => (cart.id === id ? updated : cart));
      if (this.lastFetchedCart?.id === id) {
        this.lastFetchedCart = updated;
      }
      return updated;
    },
    /**
     * 刪除遠端購物車
     */
    async deleteRemoteCart(id: number) {
      await deleteCartApi(id);
      this.carts = this.carts.filter((cart) => cart.id !== id);
      if (this.lastFetchedCart?.id === id) {
        this.lastFetchedCart = null;
      }
    },
    /**
     * 部分更新遠端購物車 (PATCH)
     */
    async patchRemoteCart(id: number, payload: UpdateCartPayload) {
      const updated = await patchCartApi(id, payload);
      this.carts = this.carts.map((cart) => (cart.id === id ? updated : cart));
      if (this.lastFetchedCart?.id === id) {
        this.lastFetchedCart = updated;
      }
      return updated;
    },
  },
});
