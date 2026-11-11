import { defineStore } from "pinia";
import type { DemoOrder } from "#shared/types/storefront";
import { MAX_CART_LINES, MAX_LINE_QUANTITY } from "#shared/utils/limits";
import { parseStoredCart, type CartItem } from "~/utils/cart";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
    lastOrderItems: [] as CartItem[],
    // True right after a checkout until something new is added.
    justCheckedOut: false,
    loading: false,
    checkoutGeneration: 0,
    // False on the server and during hydration; set once localStorage has been read.
    restored: false,
  }),
  getters: {
    total: (state) => state.items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0) / 100,
    count: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
  },
  actions: {
    /** Merge the stored cart with anything added before it was read, keeping the limits. */
    restore(value: string | null) {
      const items = parseStoredCart(value);
      for (const item of this.items) {
        if (items.length >= MAX_CART_LINES) break;
        if (!items.some((stored) => stored.id === item.id)) items.push(item);
      }
      this.items = items;
    },
    /** Returns whether the item was added, hit the line or quantity limit, or a checkout is pending. */
    addItem(product: Omit<CartItem, "quantity">): "added" | "limit" | "busy" {
      if (this.loading) return "busy";
      const existing = this.items.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= MAX_LINE_QUANTITY) return "limit";
        existing.quantity++;
      } else {
        if (this.items.length >= MAX_CART_LINES) return "limit";
        this.items.push({ ...product, quantity: 1 });
      }
      this.justCheckedOut = false;
      return "added";
    },
    removeItem(id: number) {
      if (!this.loading) this.items = this.items.filter((item) => item.id !== id);
    },
    increment(id: number) {
      if (this.loading) return;
      const item = this.items.find((item) => item.id === id);
      if (item) item.quantity = Math.min(MAX_LINE_QUANTITY, item.quantity + 1);
    },
    decrement(id: number) {
      if (this.loading) return;
      const item = this.items.find((item) => item.id === id);
      if (item && item.quantity > 1) item.quantity--;
      else this.removeItem(id);
    },
    /** Empty the cart; the last order stays available on the account page. */
    clear() {
      if (!this.loading) this.items = [];
    },
    /** Forget everything for this visitor (logout) and drop pending checkout responses. */
    reset() {
      this.checkoutGeneration++;
      this.items = [];
      this.lastOrderItems = [];
      this.justCheckedOut = false;
      this.loading = false;
    },
    async checkout() {
      if (this.loading || !this.items.length) return null;
      const generation = this.checkoutGeneration;
      this.loading = true;
      try {
        const snapshot = this.items.map((item) => ({ ...item }));
        const order = await $fetch<DemoOrder>("/api/demo/orders", {
          method: "POST",
          body: { lines: snapshot.map((item) => ({ productId: item.id, quantity: item.quantity })) },
        });
        if (generation !== this.checkoutGeneration) return null;
        this.lastOrderItems = snapshot;
        this.justCheckedOut = true;
        this.items = [];
        return order;
      } catch (error) {
        if (generation !== this.checkoutGeneration) return null;
        throw error;
      } finally {
        if (generation === this.checkoutGeneration) this.loading = false;
      }
    },
  },
});
