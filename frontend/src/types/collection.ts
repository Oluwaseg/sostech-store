import { Product } from './product';

export interface Collection {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  productIds: string[] | Product[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionData {
  name: string;
  slug: string;
  description?: string;
  productIds: string[];
  isActive?: boolean;
}

export interface UpdateCollectionData {
  name?: string;
  slug?: string;
  description?: string;
  productIds?: string[];
  isActive?: boolean;
}
