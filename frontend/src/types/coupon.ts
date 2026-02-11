export type CouponIssuedReason = 'referral' | 'admin' | 'promotion';

export interface Coupon {
  _id: string;

  code: string;
  discountPercent: number;

  maxUses: number;
  usedCount: number;

  expiresAt: string;
  isActive: boolean;

  issuedTo?: string; // user _id
  issuedReason?: CouponIssuedReason;

  createdAt: string;
  updatedAt: string;
}
