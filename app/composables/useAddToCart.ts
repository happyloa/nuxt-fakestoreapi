import type { Product } from "#shared/types/fakestore";

/**
 * 將商品加入購物車，並依實際結果顯示提示：
 * 成功、已達數量上限，或結帳處理中暫時無法加入。
 */
export function useAddToCart() {
  const cartStore = useCartStore();
  const notifications = useNotificationsStore();
  const { t } = useI18n();

  return (product: Product) => {
    const result = cartStore.addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    });
    if (result === "added") {
      notifications.success(t("notifications.cartAdded", { title: product.title }));
    } else if (result === "limit") {
      notifications.info(t("notifications.cartLimit"));
    } else {
      notifications.info(t("notifications.checkoutPending"));
    }
  };
}
