import type { CartItem, DemoOrder, Product } from "~/types/storefront"

const cartStorageKey = "storefront-lab:cart"
const receiptStorageKey = "storefront-lab:last-order"

export interface CartReceipt {
  id: string
  createdAt: string
  itemCount: number
  lines: CartItem[]
  total: number
}

const isCartItem = (value: unknown): value is CartItem => {
  if (!value || typeof value !== "object") return false

  const line = value as Partial<CartItem>
  return (
    typeof line.quantity === "number" &&
    Number.isInteger(line.quantity) &&
    line.quantity > 0 &&
    !!line.product &&
    typeof line.product.id === "number" &&
    typeof line.product.title === "string" &&
    typeof line.product.price === "number" &&
    typeof line.product.image === "string"
  )
}

const readStoredValue = <T>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export const useCart = () => {
  const lines = useState<CartItem[]>("storefront-cart-lines", () => [])
  const lastOrder = useState<CartReceipt | null>(
    "storefront-cart-last-order",
    () => null,
  )
  const isHydrated = useState("storefront-cart-hydrated", () => false)
  const isCheckingOut = useState("storefront-cart-checking-out", () => false)

  const itemCount = computed(() =>
    lines.value.reduce((total, line) => total + line.quantity, 0),
  )
  const subtotal = computed(() =>
    lines.value.reduce(
      (total, line) => total + line.product.price * line.quantity,
      0,
    ),
  )

  const persist = () => {
    if (!import.meta.client || !isHydrated.value) return
    window.localStorage.setItem(cartStorageKey, JSON.stringify(lines.value))
    window.localStorage.setItem(receiptStorageKey, JSON.stringify(lastOrder.value))
  }

  if (import.meta.client) {
    onMounted(() => {
      if (isHydrated.value) return

      const storedLines = readStoredValue<unknown[]>(cartStorageKey, [])
      lines.value = storedLines.filter(isCartItem)

      const storedReceipt = readStoredValue<CartReceipt | null>(
        receiptStorageKey,
        null,
      )
      lastOrder.value = storedReceipt
      isHydrated.value = true

      watch([lines, lastOrder], persist, { deep: true })
    })
  }

  const add = (product: Product, quantity = 1) => {
    const existing = lines.value.find((line) => line.product.id === product.id)
    if (existing) {
      existing.quantity += quantity
      return
    }

    lines.value.push({
      product: {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      },
      quantity,
    })
  }

  const setQuantity = (productId: number, quantity: number) => {
    const line = lines.value.find((item) => item.product.id === productId)
    if (!line) return

    if (quantity < 1) {
      lines.value = lines.value.filter((item) => item.product.id !== productId)
      return
    }

    line.quantity = Math.min(Math.floor(quantity), 99)
  }

  const remove = (productId: number) => {
    lines.value = lines.value.filter((line) => line.product.id !== productId)
  }

  const clear = () => {
    lines.value = []
  }

  const checkout = async () => {
    if (!lines.value.length || isCheckingOut.value) return null

    isCheckingOut.value = true
    const orderLines = lines.value.map((line) => ({
      productId: line.product.id,
      quantity: line.quantity,
    }))
    const snapshot = lines.value.map((line) => ({
      product: { ...line.product },
      quantity: line.quantity,
    }))
    const total = subtotal.value

    try {
      const order = await $fetch<DemoOrder>("/api/demo/orders", {
        method: "POST",
        body: { lines: orderLines },
      })
      lastOrder.value = {
        id: order.id,
        createdAt: order.createdAt,
        itemCount: order.itemCount,
        lines: snapshot,
        total,
      }
      lines.value = []
      return lastOrder.value
    } finally {
      isCheckingOut.value = false
    }
  }

  return {
    lines,
    lastOrder,
    itemCount,
    subtotal,
    isHydrated,
    isCheckingOut,
    add,
    setQuantity,
    remove,
    clear,
    checkout,
  }
}
