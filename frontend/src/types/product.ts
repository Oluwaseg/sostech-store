import { Category } from './category';
import { Subcategory } from './subcategory';

export type ProductVisibility = 'public' | 'private' | 'archived';

export interface ProductImage {
  url: string;
  publicId: string;
  isThumbnail: boolean;
}

export type FlashSaleDiscountType = 'percentage' | 'fixed';

export interface FlashSale {
  discountType: FlashSaleDiscountType;
  discountValue: number;
  startsAt: string; // ISO date string
  endsAt: string; // ISO date string
  isActive: boolean;
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
  reviewCount: number;

  flashSale?: FlashSale;
  isBestSeller: boolean;

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

/*
Anonymous — filter by category + search + price: GET /products?category=Electronics&search=smartphone&minPrice=100&maxPrice=2000&page=1&limit=10
Anonymous — filter by best sellers + flashSale active: GET /products?isBestSeller=true&flashSaleActive=true&page=1&limit=20
Any user — fetch by subcategory + tags: GET /products?subcategory=Smartphones&tags=flagship,android&page=1&limit=15
*/
