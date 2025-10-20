export interface ProductRating {
  rate: number
  count: number
}

export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: ProductRating
}

export interface ProductPayload extends Omit<Product, 'id' | 'rating'> {
  rating?: ProductRating
}

export interface CartProductLine {
  productId: number
  quantity: number
}

export interface CartSnapshot {
  id: number
  userId: number
  date: string
  products: CartProductLine[]
}

export interface CartItem {
  id: number
  title: string
  price: number
  image: string
  quantity: number
}

export interface FakeStoreAddress {
  city: string
  street: string
  number: number
  zipcode: string
  geolocation: {
    lat: string
    long: string
  }
}

export interface FakeStoreName {
  firstname: string
  lastname: string
}

export interface FakeStoreUser {
  id: number
  email: string
  username: string
  password: string
  name: FakeStoreName
  address: FakeStoreAddress
  phone: string
}
