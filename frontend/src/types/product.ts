export type ProductVisibility = 'public' | 'private' | 'archived';

export interface ProductImage {
  url: string;
  publicId: string;
  isThumbnail: boolean;
}

export interface Product {
  _id: string;

  name: string;
  slug: string;
  description: string;

  sku: string;

  basePrice: number;
  stock: number;

  images: ProductImage[];

  category: string;
  subcategory?: string;
  createdBy: string;

  brand?: string;
  tags: string[];

  isPublished: boolean;
  visibility: ProductVisibility;

  averageRating: number;
  ratingCount: number;

  createdAt: string;
  updatedAt: string;
}
