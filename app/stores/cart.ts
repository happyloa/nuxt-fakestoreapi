import { defineStore } from "pinia";
import type { DemoOrder } from "#shared/types/storefront";
import { parseStoredCart, type CartItem } from "~/utils/cart";

export const useCartStore = defineStore("cart", {
  state: () => ({ items: [] as CartItem[], lastOrderItems: [] as CartItem[], loading: false, error: "" }),
  getters: {
    total: (state) => state.items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0) / 100,
    count: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
  },
  actions: {
    restore(value: string | null) { this.items = parseStoredCart(value); },
    addItem(product: Omit<CartItem, "quantity">) {
      if (this.loading) return;
      const existing = this.items.find((item) => item.id === product.id);
      if (existing) existing.quantity = Math.min(99, existing.quantity + 1);
      else if (this.items.length < 50) this.items.push({ ...product, quantity: 1 });
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
      this.items = [];
      this.lastOrderItems = [];
    },
    async checkout() {
      if (this.loading || !this.items.length) return null;
      this.loading = true;
      try {
        const snapshot = this.items.map((item) => ({ ...item }));
        const order = await $fetch<DemoOrder>("/api/demo/orders", {
          method: "POST",
          body: { lines: snapshot.map((item) => ({ productId: item.id, quantity: item.quantity })) },
        });
        this.lastOrderItems = snapshot;
        this.items = [];
        return order;
      } finally { this.loading = false; }
    },
  },
});
