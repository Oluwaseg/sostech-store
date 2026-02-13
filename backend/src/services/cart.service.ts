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

  /**
   * Merge a client-side cart (local storage) into the user's server-side cart.
   * Accepts items in the shape produced by the frontend and attempts to
   * resolve them to products by _id, sku, or name. Quantities are summed
   * with existing cart quantities.
   */
  async mergeCart(userId: string, localItems: any[]) {
    if (!Array.isArray(localItems) || localItems.length === 0) {
      return this.getCart(userId);
    }

    // Resolve local items to product IDs and quantities
    const resolved: { productId: string; quantity: number }[] = [];

    for (const li of localItems) {
      const qty = Math.max(1, Number(li.quantity) || 1);
      const candidateId = li.id ?? li.productId ?? li._id;

      let product: any = null;

      // Try treat candidate as ObjectId string
      if (candidateId) {
        try {
          product = await Product.findById(candidateId).lean();
        } catch (e) {
          product = null;
        }
      }

      // Try sku match
      if (!product && candidateId != null) {
        product = await Product.findOne({ sku: String(candidateId) }).lean();
      }

      // Try name match
      if (!product && li.name) {
        product = await Product.findOne({ name: li.name }).lean();
      }

      if (!product) {
        // Skip items we can't resolve
        continue;
      }

      resolved.push({ productId: (product._id as any).toString(), quantity: qty });
    }

    if (resolved.length === 0) {
      return this.getCart(userId);
    }

    // Build a map of existing quantities
    const existingCart = await Cart.findOne({ user: userId }).lean();
    const qtyMap: Record<string, number> = {};

    if (existingCart && Array.isArray(existingCart.items)) {
      for (const it of existingCart.items) {
        const pid = (it.product as any)?._id ? (it.product as any)._id.toString() : (it.product ? it.product.toString() : undefined);
        if (pid) qtyMap[pid] = (qtyMap[pid] || 0) + (it.quantity || 0);
      }
    }

    // Merge resolved items into qtyMap
    for (const r of resolved) {
      qtyMap[r.productId] = (qtyMap[r.productId] || 0) + r.quantity;
    }

    // Build final items array for createCart
    const finalItems = Object.keys(qtyMap).map((pid) => ({ productId: pid, quantity: qtyMap[pid] }));

    // Reuse createCart to build items with prices and persist
    const mergedCart = await this.createCart(userId, finalItems);
    return mergedCart;
  }
}

export default new CartService();
