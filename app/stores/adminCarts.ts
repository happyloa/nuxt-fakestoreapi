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
  CreateCartPayload,
  UpdateCartPayload,
} from "~/types/fakestore";

/**
 * 管理員購物車 Store（API 操作台使用）。
 * 與「使用者自己的購物車」(useCartStore) 分離，這樣使用者加減商品的同步
 * 不會污染這份管理員列表 (carts)。
 */
export const useAdminCartsStore = defineStore("adminCarts", {
  actions: {
    async fetchAllCarts(
      options: {
        startDate?: string;
        endDate?: string;
        sort?: "asc" | "desc";
        limit?: number;
      } = {},
    ) {
      return getRemoteCarts({
        limit: options.limit,
        sort: options.sort,
        startDate: options.startDate,
        endDate: options.endDate,
      });
    },
    async fetchCartById(id: number) {
      return getRemoteCartById(id);
    },
    async fetchCartsByUser(userId: number) {
      return getRemoteCartsByUser(userId);
    },
    async createRemoteCart(payload: CreateCartPayload) {
      return await createCartApi(payload);
    },
    async updateRemoteCart(id: number, payload: UpdateCartPayload) {
      return await updateCartApi(id, payload);
    },
    async deleteRemoteCart(id: number) {
      await deleteCartApi(id);
    },
    async patchRemoteCart(id: number, payload: UpdateCartPayload) {
      return await patchCartApi(id, payload);
    },
  },
});
