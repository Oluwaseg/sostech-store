export interface CheckoutRequest {
  shipping: {
    addressLine: string;
    city: string;
    country: string;
    method: 'standard' | 'express' | 'pickup';
    state?: string;
    postalCode?: string;
  };
  couponCode?: string;
}
