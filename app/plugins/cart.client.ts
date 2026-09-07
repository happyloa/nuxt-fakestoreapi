export default defineNuxtPlugin((nuxtApp) => {
  const cart = useCartStore();
  const key = "storefront-cart-v1";
  nuxtApp.hook("app:mounted", () => {
    try { cart.restore(localStorage.getItem(key)); } catch { /* Storage may be disabled. */ }
    cart.$subscribe((_mutation, state) => {
      try { localStorage.setItem(key, JSON.stringify(state.items)); } catch { /* Keep the in-memory cart usable. */ }
    }, { detached: true, flush: "sync" });
  });
});
