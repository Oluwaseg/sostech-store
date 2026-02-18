// cart.type.ts

import { Product } from './product';

export interface CartItem {
  _id?: string;

  product: string | Product; // Product _id or Product object
  quantity: number;

  price: number; // price at time added
  subtotal: number; // price * quantity
}

export interface Cart {
  _id: string;

  user: string; // User _id
  items: CartItem[];

  total: number;

  createdAt: string;
  updatedAt: string;
}
