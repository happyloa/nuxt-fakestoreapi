import type {
  CartSnapshot,
  FakeStoreUser,
  Product,
  ProductPayload,
} from '~/types/fakestore'

const API_BASE = 'https://fakestoreapi.com'

type FetchOptions<T> = Parameters<typeof $fetch<T>>[1]

const withBase = (path: string) => `${API_BASE}${path}`

export const useFakeStoreApi = () => {
  const request = async <T>(path: string, options?: FetchOptions<T>) =>
    await $fetch<T>(withBase(path), {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    })

  return {
    listProducts: (query?: Record<string, string | number>) =>
      request<Product[]>('/products', { query }),
    getProduct: (id: string | number) => request<Product>(`/products/${id}`),
    createProduct: (payload: ProductPayload) =>
      request<Product>('/products', {
        method: 'POST',
        body: payload,
      }),
    listCategories: () => request<string[]>('/products/categories'),
    listUsers: () => request<FakeStoreUser[]>('/users'),
    getUser: (id: string | number) => request<FakeStoreUser>(`/users/${id}`),
    listCartsForUser: (userId: number) => request<CartSnapshot[]>(`/carts/user/${userId}`),
    createCart: (payload: Omit<CartSnapshot, 'id'>) =>
      request<CartSnapshot>('/carts', {
        method: 'POST',
        body: payload,
      }),
  }
}
