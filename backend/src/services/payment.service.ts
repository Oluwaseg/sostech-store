import axios from 'axios';
import logger from '../libs/logger';

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
      order = await Order.findOne({
        _id: orderId,
        user: userId,
        paymentStatus: 'payment_pending',
      });
      if (!order)
        throw new Error('Specific pending order not found or unauthorized.');
    } else {
      order = await Order.findOne({
        user: userId,
        paymentStatus: 'payment_pending',
      }).sort({ createdAt: -1 });
      if (!order)
        throw new Error('No pending order found. Please checkout first.');
    }

    const amountInKobo = Math.round(order.total * 100);
    const data = {
      email: user.email,
      amount: amountInKobo,
      callback_url: callbackUrl,
      metadata: {
        userId: user._id,
        orderId: order._id,
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

    const reference = response.data?.data?.reference;
    if (reference) {
      order.paymentIntentId = reference;
      await order.save();
    }

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

  private async restoreStock(order: any) {
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity } }
      );
    }
  }

  private async cancelOrder(order: any, reference: string) {
    if (order.paymentStatus === 'paid') return;

    order.paymentStatus = 'cancelled';
    order.paymentIntentId = reference;
    await order.save();
    await this.restoreStock(order);
  }

  async handlePaystackWebhook(event: any) {
    const payload = event.data || {};
    const reference = payload.reference;
    const status = payload.status;
    const metadata = payload.metadata;

    if (!reference || !metadata || !metadata.orderId) {
      logger.warn('Paystack webhook missing required metadata', { payload });
      return;
    }

    const order = await Order.findById(metadata.orderId);
    if (!order) {
      logger.warn('Paystack webhook for unknown order', {
        orderId: metadata.orderId,
      });
      return;
    }

    if (order.paymentStatus === 'paid' && order.paymentIntentId === reference) {
      logger.info('Paystack webhook received duplicate paid event', {
        orderId: order._id,
        reference,
      });
      return;
    }

    if (status === 'success' || status === 'completed') {
      try {
        const verification = await this.verifyTransaction(reference);
        const verifiedStatus = verification?.data?.status;
        if (verifiedStatus !== 'success') {
          logger.warn('Webhook payment verification did not return success', {
            reference,
            verifiedStatus,
          });
          return;
        }
      } catch (error: any) {
        logger.error('Error verifying webhook transaction', {
          reference,
          error: error.message || error,
        });
        throw error;
      }

      order.paymentStatus = 'paid';
      order.paymentIntentId = reference;
      await order.save();

      const cart = await Cart.findOne({ user: order.user });
      if (cart) {
        cart.items = [];
        cart.total = 0;
        await cart.save();
      }

      await orderService.sendOrderConfirmationEmail(order._id.toString());
      logger.info('Order marked paid via Paystack webhook', {
        orderId: order._id,
        reference,
      });
      return;
    }

    if (['failed', 'abandoned', 'cancelled'].includes(status)) {
      await this.cancelOrder(order, reference);
      logger.info('Order payment cancelled via Paystack webhook', {
        orderId: order._id,
        reference,
        status,
      });
      return;
    }

    logger.info('Paystack webhook received unsupported status', {
      orderId: order._id,
      reference,
      status,
    });
  }

  async reconcilePendingOrders(ageHours = 1) {
    const cutoff = new Date(Date.now() - ageHours * 60 * 60 * 1000);
    const pendingOrders = await Order.find({
      paymentStatus: 'payment_pending',
      paymentIntentId: { $exists: true, $ne: null },
      createdAt: { $lt: cutoff },
    });

    const summary = {
      checked: pendingOrders.length,
      paid: 0,
      cancelled: 0,
      untouched: 0,
      errors: 0,
    };

    for (const order of pendingOrders) {
      try {
        const verification = await this.verifyTransaction(
          order.paymentIntentId!
        );
        const status = verification?.data?.status;

        if (status === 'success') {
          order.paymentStatus = 'paid';
          await order.save();

          const cart = await Cart.findOne({ user: order.user });
          if (cart) {
            cart.items = [];
            cart.total = 0;
            await cart.save();
          }

          await orderService.sendOrderConfirmationEmail(order._id.toString());
          summary.paid += 1;
        } else if (['failed', 'abandoned', 'cancelled'].includes(status)) {
          await this.cancelOrder(order, order.paymentIntentId!);
          summary.cancelled += 1;
        } else {
          summary.untouched += 1;
        }
      } catch (error: any) {
        logger.error('Payment reconciliation failed', {
          orderId: order._id,
          reference: order.paymentIntentId,
          error: error.message || error,
        });
        summary.errors += 1;
      }
    }

    return summary;
  }
}

export default new PaymentService();
