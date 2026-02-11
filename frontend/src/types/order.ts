export type OrderStatus =
  | 'pending'
  | 'payment_pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type ShippingMethod = 'standard' | 'express' | 'pickup';

export interface OrderItem {
  product: string; // Product _id
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
  carrier?: string;
  trackingNumber?: string;

  shippedAt?: string;
  deliveredAt?: string;
}

export interface Order {
  _id: string;

  user: string; // User _id

  items: OrderItem[];

  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;

  coupon?: string; // Coupon _id

  status: OrderStatus;

  shipping: ShippingInfo;

  paymentIntentId?: string;

  createdAt: string;
  updatedAt: string;
}
