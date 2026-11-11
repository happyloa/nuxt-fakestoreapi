import { defineStore } from "pinia";
import type { Product } from "#shared/types/fakestore";
import type { CatalogPayload } from "#shared/types/storefront";

/**
 * 商店頁使用的商品目錄（來自有快取的 /api/catalog）。
 * API 操作台的查詢與 CRUD 直接呼叫 services，不寫入這裡，
 * 因為 Fake Store 不會保存異動，寫進目錄只會出現無法開啟的假商品。
 * 載入失敗時錯誤會拋給呼叫端，由頁面的 useAsyncData 呈現。
 */
export const useProductsStore = defineStore("products", {
  state: () => ({
    products: [] as Product[],
    categories: [] as string[],
  }),
  getters: {
    total: (state) => state.products.length,
    averagePrice: (state) =>
      state.products.length
        ? state.products.reduce((sum, product) => sum + product.price, 0) /
          state.products.length
        : 0,
  },
  actions: {
    /** 載入完整目錄；已有資料時沿用，切換頁面不會重複下載。 */
    async loadCatalog() {
      if (this.products.length) return;
      const catalog = await $fetch<CatalogPayload>("/api/catalog");
      this.products = catalog.products;
      this.categories = catalog.categories;
    },
    /** 只需要分類時使用，避免頁面 payload 夾帶整份商品。 */
    async loadCategories() {
      if (this.categories.length) return;
      this.categories = (await $fetch<CatalogPayload>("/api/catalog")).categories;
    },
  },
});
