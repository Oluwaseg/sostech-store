import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISubcategory extends Document {
  name: string;
  slug: string;
  category: Types.ObjectId;
  description?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subcategorySchema = new Schema<ISubcategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate subcategories under same category
subcategorySchema.index({ name: 1, category: 1 }, { unique: true });

export const Subcategory = mongoose.model<ISubcategory>(
  'Subcategory',
  subcategorySchema
);
