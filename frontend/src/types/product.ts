import { Category } from './category';
import { Subcategory } from './subcategory';

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

  category: Category;
  subcategory?: Subcategory;
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

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string; // e.g., 'price_asc', 'price_desc', 'latest'
  search?: string;
}

// Paginated payload from API
export interface ProductListPayload {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}
