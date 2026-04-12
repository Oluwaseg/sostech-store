import axios from 'axios';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL =
  process.env.PAYSTACK_BASE_URL || 'https://api.paystack.co';

import { Cart } from '../models/Cart';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { User } from '../models/User';
import orderService from './order.service';

class PaymentService {
  async initializeTransaction(
    userId: string,
    callbackUrl: string,
    orderId?: string
  ) {
    // Fetch user
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    let order;
    if (orderId) {
      // Fetch specific order
      order = await Order.findOne({
        _id: orderId,
        user: userId,
        paymentStatus: 'payment_pending',
      });
      if (!order)
        throw new Error('Specific pending order not found or unauthorized.');
    } else {
      // Fetch latest payment_pending order for user
      order = await Order.findOne({
        user: userId,
        paymentStatus: 'payment_pending',
      }).sort({ createdAt: -1 });
      if (!order)
        throw new Error('No pending order found. Please checkout first.');
    }

    // Use order's shipping info and total
    const shippingInfo = order.shipping;
    const amountInKobo = Math.round(order.total * 100);

    // Prepare Paystack data
    const data = {
      email: user.email,
      amount: amountInKobo,
      callback_url: callbackUrl,
      metadata: {
        userId: user._id,
        orderId: order._id,
        shippingInfo,
      },
    };

    const headers = {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      data,
      { headers }
    );

    return { paystack: response.data, order };
  }

  async verifyTransaction(reference: string) {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  }

  async handlePaystackWebhook(event: any) {
    // event.data.reference, event.data.status, event.data.metadata
    const { reference, status, metadata } = event.data || {};
    if (!reference || !metadata || !metadata.orderId) return;

    const order = await Order.findById(metadata.orderId);
    if (!order) return;

    // Idempotency check
    if (order.paymentStatus === 'paid') return;

    if (status === 'success' || status === 'completed') {
      // Verify transaction again
      try {
        const verification = await this.verifyTransaction(reference);
        if (verification.data.status !== 'success') {
          // Log error but don't fail
          console.error(
            'Webhook verification failed for reference:',
            reference
          );
          return;
        }
      } catch (error) {
        console.error('Error verifying transaction in webhook:', error);
        return;
      }

      order.paymentStatus = 'paid';
      order.paymentIntentId = reference;
      await order.save();

      // Clear cart after successful payment
      const cart = await Cart.findOne({ user: order.user });
      if (cart) {
        cart.items = [];
        cart.total = 0;
        await cart.save();
      }

      // Send order confirmation email after successful payment
      await orderService.sendOrderConfirmationEmail(order._id.toString());
    } else {
      order.paymentStatus = 'cancelled';
      order.paymentIntentId = reference;
      await order.save();

      // Restore stock if payment cancelled
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.quantity } }
        );
      }
    }
  }
}

export default new PaymentService();
