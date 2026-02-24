import { Coupon, ICoupon } from '../models/Coupon';
import mongoose from 'mongoose';

class CouponService {
  async getUserCoupons(userId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const now = new Date();

    const coupons = await Coupon.find({
      issuedTo: userObjectId,
      isActive: true,
      expiresAt: { $gt: now },
    })
      .sort({ createdAt: -1 })
      .lean<ICoupon[]>();

    return coupons;
  }

  async validateCouponForUser(userId: string, code: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const normalizedCode = code.trim().toUpperCase();

    const coupon = await Coupon.findOne({
      code: normalizedCode,
      issuedTo: userObjectId,
    });

    if (!coupon) {
      throw new Error('Coupon not found for this user');
    }

    const usable =
      typeof (coupon as any).isUsable === 'function'
        ? (coupon as any).isUsable()
        : coupon.isActive &&
          coupon.usedCount < coupon.maxUses &&
          coupon.expiresAt > new Date();

    if (!usable) {
      throw new Error('Coupon is not usable');
    }

    return {
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      expiresAt: coupon.expiresAt,
      maxUses: coupon.maxUses,
      usedCount: coupon.usedCount,
      issuedReason: coupon.issuedReason,
    };
  }
}

export default new CouponService();

