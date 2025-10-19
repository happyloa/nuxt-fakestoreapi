import type {
  Cart,
  CartProductPayload,
  NewProductPayload,
  Product,
  User,
} from '~/types/fakestore'

const BASE_URL = 'https://fakestoreapi.com'

const withDelay = async <T>(promise: Promise<T>) => {
  try {
    return await promise
  } catch (error) {
    console.error('Fake Store API error:', error)
    throw error
  }
}

export const useFakeStoreClient = () => {
  const listProducts = (params?: { limit?: number; sort?: 'asc' | 'desc'; category?: string }) => {
    const query = new URLSearchParams()
    if (params?.limit) query.set('limit', String(params.limit))
    if (params?.sort) query.set('sort', params.sort)

    const basePath = params?.category ? `/products/category/${params.category}` : '/products'
    const path = query.toString() ? `${basePath}?${query.toString()}` : basePath
    return withDelay($fetch<Product[]>(`${BASE_URL}${path}`))
  }

  const getProduct = (id: number | string) => withDelay($fetch<Product>(`${BASE_URL}/products/${id}`))

  const getCategories = () => withDelay($fetch<string[]>(`${BASE_URL}/products/categories`))

  const createProduct = (payload: NewProductPayload) =>
    withDelay(
      $fetch<Product>(`${BASE_URL}/products`, {
        method: 'POST',
        body: payload,
      }),
    )

  const createCart = (payload: { userId: number; date: string; products: CartProductPayload[] }) =>
    withDelay(
      $fetch<Cart>(`${BASE_URL}/carts`, {
        method: 'POST',
        body: payload,
      }),
    )

  const listCartsByUser = (userId: number) => withDelay($fetch<Cart[]>(`${BASE_URL}/carts/user/${userId}`))

  const listUsers = () => withDelay($fetch<User[]>(`${BASE_URL}/users`))

  const getUser = (id: number | string) => withDelay($fetch<User>(`${BASE_URL}/users/${id}`))

  const login = (username: string, password: string) =>
    withDelay(
      $fetch<{ token: string }>(`${BASE_URL}/auth/login`, {
        method: 'POST',
        body: { username, password },
      }),
    )

  return {
    listProducts,
    getProduct,
    getCategories,
    createProduct,
    createCart,
    listCartsByUser,
    listUsers,
    getUser,
    login,
  }
}
