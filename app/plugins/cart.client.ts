export default defineNuxtPlugin((nuxtApp) => {
  const cart = useCartStore();
  const key = "storefront-cart-v1";

  // Read browser-only state right after hydration so SSR markup and the first
  // client render agree, without the idle delay of onNuxtReady (items added in
  // that gap would otherwise be overwritten by the stored cart).
  const restore = () => {
    try {
      cart.restore(localStorage.getItem(key));
    } catch {
      /* Storage may be disabled. */
    } finally {
      cart.restored = true;
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
  };

  if (nuxtApp.isHydrating) nuxtApp.hooks.hookOnce("app:suspense:resolve", restore);
  else restore();
});
