/**
 * Browser-safe contracts for the Storefront BFF.
 *
 * These types intentionally exclude upstream credentials, JWTs, passwords,
 * geolocation, and any other data the browser does not need.
 */
import type { Product } from "./fakestore";

export interface CatalogPayload {
  products: Product[];
  categories: string[];
}

export interface CartLine {
  productId: number;
  quantity: number;
}


export interface LoginInput {
  username: string;
  password: string;
}

export interface DemoOrder {
  id: string;
  userId: number;
  createdAt: string;
  lines: CartLine[];
  itemCount: number;
}

export interface PublicUser {
  id: number;
  username: string;
  email: string;
  name: {
    firstName: string;
    lastName: string;
  };
  address: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
  };
  phone: string;
}

export interface SessionResponse {
  authenticated: boolean;
  user: PublicUser | null;
}
