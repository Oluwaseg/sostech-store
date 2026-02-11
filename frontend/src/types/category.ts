export interface Category {
  _id: string;

  name: string;
  slug: string;
  description?: string;
  isPublished: boolean;

  createdAt: string;
  updatedAt: string;
}
