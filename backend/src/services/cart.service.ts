import mongoose from 'mongoose';
import { Cart, ICartItem } from '../models/Cart';
import { Product } from '../models/Product';

class CartService {
  async getCart(userId: string) {
    return Cart.findOne({ user: userId }).populate('items.product').lean();
  }

  async createCart(
    userId: string,
    items: { productId: string; quantity: number }[]
  ) {
    // Build items with current product prices
    const builtItems: ICartItem[] = [] as any;
    let total = 0;

    for (const it of items) {
      const product = await Product.findById(it.productId).lean();
      if (!product) throw new Error('Product not found: ' + it.productId);

      const price = (product as any).basePrice ?? 0;
      const qty = Math.max(1, Math.floor(it.quantity || 1));
      const subtotal = price * qty;
      total += subtotal;

      builtItems.push({
        product: new mongoose.Types.ObjectId(it.productId),
        quantity: qty,
        price,
        subtotal,
      } as any);
    }

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: builtItems, total } },
      { upsert: true, new: true }
    ).populate('items.product');

    return cart;
  }

  async updateCart(
    userId: string,
    items: { productId: string; quantity: number }[]
  ) {
    // Replace items similarly to createCart
    return this.createCart(userId, items);
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error('Cart not found');

    const before = cart.items.length;
    cart.items = cart.items.filter((i) => i._id?.toString() !== itemId);

    if (cart.items.length === before) throw new Error('Item not found in cart');

    // Recalculate total
    cart.total = cart.items.reduce((s, it) => s + it.subtotal, 0);
    await cart.save();
    return cart;
  }

  async clearCart(userId: string) {
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [], total: 0 } },
      { new: true, upsert: true }
    );
    return cart;
  }
}

export default new CartService();
