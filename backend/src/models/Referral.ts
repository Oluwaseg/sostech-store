import mongoose, { Document, Schema } from 'mongoose';

export interface IReferral extends Document {
  referrer: mongoose.Types.ObjectId;
  referee: mongoose.Types.ObjectId;
  status: 'pending' | 'completed';
  createdAt: Date;
}

const referralSchema = new Schema<IReferral>(
  {
    referrer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    referee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one referral per user
    },

    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Referral = mongoose.model<IReferral>('Referral', referralSchema);
