import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICartItem {
  _id?: Types.ObjectId;
  product: Types.ObjectId;
  quantity: number;
  price: number; // price at time added
  subtotal: number;
}

export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: { type: [cartItemSchema], default: [] },
    total: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>('Cart', cartSchema);
