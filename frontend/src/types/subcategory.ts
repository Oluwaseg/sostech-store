export interface Subcategory {
  _id: string;

  name: string;
  slug: string;

  // Relation
  category: string; // Category _id

  description?: string;
  isPublished: boolean;

  createdAt: string;
  updatedAt: string;
}
