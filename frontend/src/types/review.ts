import { Product } from './product';
import { User } from './user';

export interface Review {
  _id: string;

  product: string | Product; // Product _id
  user: string | User; // User _id

  rating: number;
  comment?: string;

  createdAt: string;
  updatedAt: string;
}

export interface ReviewListResponse {
  reviews: Review[];
  total: number;
  page: number;
  pages: number;
}
