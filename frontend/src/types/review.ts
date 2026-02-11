export interface Review {
  _id: string;

  product: string; // Product _id
  user: string; // User _id

  rating: number;
  comment?: string;

  createdAt: string;
  updatedAt: string;
}
