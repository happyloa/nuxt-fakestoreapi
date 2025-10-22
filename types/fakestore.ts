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

export interface CreateProductPayload {
  title: string
  price: number
  description: string
  image: string
  category: string
}

export interface CartProductItem {
  productId: number
  quantity: number
}

export interface Cart {
  id: number
  userId: number
  date: string
  products: CartProductItem[]
}

export interface UserName {
  firstname: string
  lastname: string
}

export interface UserAddress {
  city: string
  street: string
  number: number
  zipcode: string
  geolocation: {
    lat: string
    long: string
  }
}

export interface User {
  id: number
  email: string
  username: string
  password: string
  name: UserName
  address: UserAddress
  phone: string
}

export interface LoginResponse {
  token: string
}
