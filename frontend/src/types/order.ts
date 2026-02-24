export type OrderStatus = 'pending' | 'paid' | 'cancelled';

export type ShippingMethod = 'standard' | 'express' | 'pickup';

export interface OrderItem {
  product: string; // product ID (or populated object if you later allow it)
  name: string;
  price: number;
  quantity: number;
}

export interface ShippingInfo {
  addressLine: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  method: ShippingMethod;
}

export interface Order {
  _id: string;
  user: string;

  items: OrderItem[];

  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;

  coupon?: string;
  status: OrderStatus;

  shipping: ShippingInfo;

  createdAt: string;
  updatedAt: string;
}
