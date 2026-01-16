import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discountPercent: number;
  maxUses: number;
  usedCount: number;
  expiresAt: Date;
  isActive: boolean;

  issuedTo?: mongoose.Types.ObjectId; // user-bound
  issuedReason?: 'referral' | 'admin' | 'promotion';

  createdAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },

    discountPercent: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },

    maxUses: {
      type: Number,
      default: 1, // single-use by default
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    issuedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    issuedReason: {
      type: String,
      enum: ['referral', 'admin', 'promotion'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent overuse
couponSchema.methods.isUsable = function () {
  return (
    this.isActive &&
    this.usedCount < this.maxUses &&
    this.expiresAt > new Date()
  );
};

export const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);
