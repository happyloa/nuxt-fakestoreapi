export default defineNuxtPlugin(() => {
  const cart = useCartStore();
  const key = "storefront-cart-v1";
  // Async page hydration can outlive app:mounted. Restore browser-only state
  // once the entire Nuxt app is ready so SSR markup and accessible labels agree.
  onNuxtReady(() => {
    try {
      cart.restore(localStorage.getItem(key));
    } catch {
      /* Storage may be disabled. */
    }
    cart.$subscribe(
      (_mutation, state) => {
        try {
          localStorage.setItem(key, JSON.stringify(state.items));
        } catch {
          /* Keep the in-memory cart usable. */
        }
      },
      { detached: true, flush: "sync" },
    );
  });
});
