import mongoose from 'mongoose';
import { Cart } from '../models/Cart';
import { Coupon } from '../models/Coupon';
import { IShippingInfo, Order } from '../models/Order';
import { Product } from '../models/Product';

export interface CheckoutPayload {
  shipping: Pick<
    IShippingInfo,
    'addressLine' | 'city' | 'state' | 'country' | 'postalCode' | 'method'
  >;
  couponCode?: string;
}

class CheckoutService {
  /**
   * Computes shipping fee in Naira (₦):
   * - pickup: ₦0 (free)
   * - standard: ₦6000
   * - express: ₦12500
   * The fee is the same for all states.
   */
  private computeShippingFee(shipping: CheckoutPayload['shipping']): number {
    if (shipping.method === 'pickup') return 0;
    if (shipping.method === 'express') return 12500;
    if (shipping.method === 'standard') return 6000;
    return 0;
  }

  async checkout(userId: string, payload: CheckoutPayload) {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const cart = await Cart.findOne({ user: userObjectId }).populate(
      'items.product'
    );
    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    const subtotal = cart.total;
    if (subtotal <= 0) {
      throw new Error('Cart total must be greater than zero');
    }

    // Stock validation
    for (const item of cart.items) {
      const product = item.product as any;
      if (product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${product.name}. Available: ${product.stock}`
        );
      }
    }

    let appliedCoupon: any = null;
    let discount = 0;

    if (payload.couponCode) {
      const code = payload.couponCode.trim().toUpperCase();
      const coupon = await Coupon.findOne({
        code,
        issuedTo: userObjectId,
        isActive: true,
      });

      if (!coupon) {
        throw new Error('Invalid or inactive coupon');
      }

      if (!coupon.isUsable()) {
        throw new Error('Coupon is no longer usable');
      }

      discount = (subtotal * coupon.discountPercent) / 100;
      if (discount < 0) discount = 0;

      appliedCoupon = coupon;
    }

    const shippingFee = this.computeShippingFee(payload.shipping);
    const total = Math.max(0, subtotal - discount + shippingFee);

    const orderItems = cart.items.map((item) => ({
      product: item.product as any,
      name: (item as any).product?.name ?? '',
      price: item.price,
      quantity: item.quantity,
    }));

    const order = await Order.create({
      user: userObjectId,
      items: orderItems,
      subtotal,
      discount,
      shippingFee,
      total,
      coupon: appliedCoupon ? appliedCoupon._id : undefined,
      paymentStatus: 'payment_pending',
      shippingStatus: 'processing',
      shipping: payload.shipping,
    });

    // Decrement stock atomically (without transaction)
    for (const item of cart.items) {
      const product = item.product as any;
      const result = await Product.updateOne(
        { _id: product._id, stock: { $gte: item.quantity } }, // Ensure sufficient stock
        { $inc: { stock: -item.quantity } }
      );
      if (result.modifiedCount === 0) {
        // Stock was insufficient or changed concurrently
        throw new Error(
          `Stock update failed for ${product.name}. Please try again.`
        );
      }
    }

    // Mark coupon used atomically
    if (appliedCoupon) {
      const couponResult = await Coupon.updateOne(
        { _id: appliedCoupon._id, usedCount: appliedCoupon.usedCount }, // Optimistic locking
        {
          $inc: { usedCount: 1 },
          $set: {
            isActive:
              appliedCoupon.usedCount + 1 >= appliedCoupon.maxUses
                ? false
                : appliedCoupon.isActive,
          },
        }
      );
      if (couponResult.modifiedCount === 0) {
        // Coupon was modified concurrently
        throw new Error('Coupon update failed. Please try again.');
      }
    }

    // Do NOT clear cart here - wait for payment success

    return order;
  }
}

export default new CheckoutService();
