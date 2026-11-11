import { defineStore } from "pinia";
import {
  createProduct as createProductApi,
  deleteProduct as deleteProductApi,
  getProductById,
  getProductCategories,
  queryProducts as queryProductsApi,
  patchProduct as patchProductApi,
  updateProduct as updateProductApi,
} from "~/services/fakestore/products";
import type {
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from "#shared/types/fakestore";
import type { CatalogPayload } from "#shared/types/storefront";

interface State {
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string;
}

/**
 * 商品資料的集中管理 Store。
 * 透過結合 services 層的 API 呼叫，讓元件只需要關注狀態與畫面呈現，
 * 也方便在未來接軌快取或離線體驗。
 */
export const useProductsStore = defineStore("products", {
  state: (): State => ({
    products: [],
    categories: [],
    loading: false,
    error: "",
  }),
  getters: {
    // 計算商品總數
    total: (state) => state.products.length,
    // 計算商品平均價格
    averagePrice: (state) => {
      if (!state.products.length) {
        return 0;
      }
      const sum = state.products.reduce(
        (acc, product) => acc + product.price,
        0,
      );
      return sum / state.products.length;
    },
  },
  actions: {
    /**
     * 取得商品分類列表
     * 一般情況讀取有快取的 /api/catalog（只保留分類，避免頁面 payload 夾帶整份商品）；
     * force 時改走 API 操作台 proxy，直接向上游重新查詢。
     * @param force 是否強制重新抓取
     */
    async fetchCategories(force = false) {
      if (this.categories.length && !force) {
        return;
      }
      try {
        this.categories = force
          ? await getProductCategories()
          : (await $fetch<CatalogPayload>("/api/catalog")).categories;
      } catch (error) {
        this.error =
          localizedError("load");
      }
    },
    /**
     * 取得單一商品詳細資料
     * 如果本地已有資料則直接回傳，否則發送 API 請求
     * @param id 商品 ID
     */
    async fetchProductById(id: number) {
      const existing = this.products.find((product) => product.id === id);
      if (existing) {
        return existing;
      }
      try {
        const product = await getProductById(id);
        return product;
      } catch (error) {
        this.error =
          localizedError("load");
        throw error;
      }
    },
    /**
     * 建立新商品
     * 成功後會自動更新本地商品列表與分類
     * @param payload 商品資料
     */
    async createProduct(payload: CreateProductPayload) {
      this.loading = true;
      this.error = "";
      try {
        const raw = await createProductApi(payload);
        // Fake Store API 回傳的新商品可能缺少 rating，price 也可能是字串
        const created: Product = {
          ...raw,
          price: Number(raw.price) || 0,
          rating: raw.rating ?? { rate: 0, count: 0 },
        };
        this.products = [created, ...this.products];
        if (!this.categories.includes(created.category)) {
          this.categories.push(created.category);
        }
        return created;
      } catch (error) {
        this.error =
          localizedError("save");
        throw error;
      } finally {
        this.loading = false;
      }
    },
    /**
     * 更新商品資訊
     * @param id 商品 ID
     * @param payload 更新內容
     */
    async updateProduct(id: number, payload: UpdateProductPayload) {
      this.loading = true;
      this.error = "";
      try {
        const updated = await updateProductApi(id, payload);
        this.products = this.products.map((product) =>
          product.id === id ? { ...product, ...updated } : product,
        );
        return updated;
      } catch (error) {
        this.error =
          localizedError("save");
        throw error;
      } finally {
        this.loading = false;
      }
    },
    /**
     * 刪除商品
     * @param id 商品 ID
     */
    async deleteProduct(id: number) {
      this.loading = true;
      this.error = "";
      try {
        await deleteProductApi(id);
        this.products = this.products.filter((product) => product.id !== id);
      } catch (error) {
        this.error =
          localizedError("delete");
        throw error;
      } finally {
        this.loading = false;
      }
    },
    /**
     * 部分更新商品資訊 (PATCH)
     * @param id 商品 ID
     * @param payload 更新內容
     */
    async patchProduct(id: number, payload: UpdateProductPayload) {
      this.loading = true;
      this.error = "";
      try {
        const updated = await patchProductApi(id, payload);
        this.products = this.products.map((product) =>
          product.id === id ? { ...product, ...updated } : product,
        );
        return updated;
      } catch (error) {
        this.error =
          localizedError("save");
        throw error;
      } finally {
        this.loading = false;
      }
    },
    /**
     * 根據條件查詢商品
     * @param options 查詢選項 (limit, sort, category)
     */
    async queryProducts(options: {
      limit?: number;
      sort?: "asc" | "desc";
      category?: string;
    }) {
      return await queryProductsApi({
        limit: options.limit,
        sort: options.sort,
        category: options.category,
      });
    },
  },
});
