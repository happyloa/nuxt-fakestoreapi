/**
 * 在 onMounted 綁定、onBeforeUnmount 自動移除的 window 事件監聽器。
 * 收斂各元件重複的「addEventListener / removeEventListener + client 守衛」樣板。
 */
export function useWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions,
) {
  onMounted(() => {
    if (!import.meta.client) return;
    window.addEventListener(type, handler, options);
  });
  onBeforeUnmount(() => {
    if (!import.meta.client) return;
    window.removeEventListener(type, handler, options);
  });
}
