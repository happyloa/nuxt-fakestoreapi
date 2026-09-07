export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

/** Local storage is untrusted: only restore bounded, valid product snapshots. */
export function parseStoredCart(value: string | null): CartItem[] {
  if (!value || value.length > 200_000) return [];
  try {
    const data: unknown = JSON.parse(value);
    if (!Array.isArray(data) || data.length > 50) return [];
    const ids = new Set<number>();
    return data.filter((item): item is CartItem => {
      if (!item || typeof item !== "object" || !Number.isSafeInteger(item.id) || item.id < 1 || item.id > 1_000_000
        || typeof item.title !== "string" || !item.title.trim() || item.title.length > 500
        || typeof item.price !== "number" || !Number.isFinite(item.price) || item.price < 0 || item.price > 1_000_000
        || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 99
        || typeof item.image !== "string" || item.image.length > 2000 || !/^https?:\/\//.test(item.image)
        || ids.has(item.id)) return false;
      ids.add(item.id);
      return true;
    }).map(({ id, title, price, image, quantity }) => ({ id, title, price, image, quantity }));
  } catch { return []; }
}
