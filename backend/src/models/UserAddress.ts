import mongoose, { Document, Schema } from 'mongoose';

export interface IUserAddress extends Document {
  user: mongoose.Types.ObjectId;
  addressLine: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  isDefault: boolean;
}

const userAddressSchema = new Schema<IUserAddress>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  addressLine: { type: String, required: true },
  city: { type: String, required: true },
  state: String,
  country: { type: String, required: true },
  postalCode: String,
  isDefault: { type: Boolean, default: false },
});

export const UserAddress = mongoose.model<IUserAddress>(
  'UserAddress',
  userAddressSchema
);
