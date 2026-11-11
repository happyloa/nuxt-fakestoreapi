import { defineStore } from "pinia";
import type { DemoOrder } from "#shared/types/storefront";
import { parseStoredCart, type CartItem } from "~/utils/cart";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
    lastOrderItems: [] as CartItem[],
    loading: false,
    error: "",
    checkoutGeneration: 0,
    // False on the server and during hydration; set once localStorage has been read.
    restored: false,
  }),
  getters: {
    total: (state) => state.items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0) / 100,
    count: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
  },
  actions: {
    restore(value: string | null) { this.items = parseStoredCart(value); },
    /** Returns whether the item was added, hit the 50-line / 99-quantity limit, or a checkout is pending. */
    addItem(product: Omit<CartItem, "quantity">): "added" | "limit" | "busy" {
      if (this.loading) return "busy";
      const existing = this.items.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= 99) return "limit";
        existing.quantity++;
        return "added";
      }
      if (this.items.length >= 50) return "limit";
      this.items.push({ ...product, quantity: 1 });
      return "added";
    },
    removeItem(id: number) {
      if (!this.loading) this.items = this.items.filter((item) => item.id !== id);
    },
    increment(id: number) {
      if (this.loading) return;
      const item = this.items.find((item) => item.id === id);
      if (item) item.quantity = Math.min(99, item.quantity + 1);
    },
    decrement(id: number) {
      if (this.loading) return;
      const item = this.items.find((item) => item.id === id);
      if (item && item.quantity > 1) item.quantity--;
      else this.removeItem(id);
    },
    clear() {
      if (this.loading) return;
      this.reset();
    },
    reset() {
      // Invalidate pending checkout responses when the session is cleared.
      this.checkoutGeneration++;
      this.items = [];
      this.lastOrderItems = [];
      this.loading = false;
      this.error = "";
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
