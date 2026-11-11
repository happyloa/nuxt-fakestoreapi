/**
 * window 事件監聽器：掛載時綁定、卸載前移除（這兩個 hook 只在瀏覽器執行）。
 */
export function useWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions,
) {
  onMounted(() => window.addEventListener(type, handler, options));
  onBeforeUnmount(() => window.removeEventListener(type, handler, options));
}
