import { Collection, ICollection } from '../models/Collection';

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

class CollectionService {
  async createCollection(data: CreateCollectionData): Promise<ICollection> {
    // Check if collection with same name or slug already exists
    const existingCollection = await Collection.findOne({
      $or: [{ name: data.name }, { slug: data.slug }],
    });

    if (existingCollection) {
      throw new Error('Collection with this name or slug already exists');
    }

    const collection = await Collection.create({
      name: data.name,
      slug: data.slug,
      description: data.description,
      productIds: data.productIds,
      isActive: data.isActive !== undefined ? data.isActive : true,
    });

    return collection;
  }

  async getCollections(filters?: {
    isActive?: boolean;
  }): Promise<ICollection[]> {
    const query: any = {};

    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const collections = await Collection.find(query)
      .populate('productIds')
      .sort({ createdAt: -1 });
    return collections;
  }

  async getCollectionById(id: string): Promise<ICollection | null> {
    const collection = await Collection.findById(id).populate('productIds');
    return collection;
  }

  async getCollectionBySlug(slug: string): Promise<ICollection | null> {
    const collection = await Collection.findOne({ slug }).populate(
      'productIds'
    );
    return collection;
  }

  async updateCollection(
    id: string,
    data: UpdateCollectionData
  ): Promise<ICollection | null> {
    // If updating slug or name, check for duplicates
    if (data.slug || data.name) {
      const query: any = { _id: { $ne: id } };

      if (data.slug) {
        query.slug = data.slug;
      }
      if (data.name) {
        query.name = data.name;
      }

      const existingCollection = await Collection.findOne(query);
      if (existingCollection) {
        throw new Error('Collection with this name or slug already exists');
      }
    }

    const collection = await Collection.findByIdAndUpdate(id, data, {
      new: true,
    }).populate('productIds');
    return collection;
  }

  async deleteCollection(id: string): Promise<boolean> {
    const result = await Collection.findByIdAndDelete(id);
    return !!result;
  }

  async addProductToCollection(
    collectionId: string,
    productId: string
  ): Promise<ICollection | null> {
    const collection = await Collection.findByIdAndUpdate(
      collectionId,
      {
        $addToSet: { productIds: productId },
      },
      { new: true }
    ).populate('productIds');
    return collection;
  }

  async removeProductFromCollection(
    collectionId: string,
    productId: string
  ): Promise<ICollection | null> {
    const collection = await Collection.findByIdAndUpdate(
      collectionId,
      {
        $pull: { productIds: productId },
      },
      { new: true }
    ).populate('productIds');
    return collection;
  }

  async getCollectionProducts(collectionId: string): Promise<any[]> {
    const collection =
      await Collection.findById(collectionId).populate('productIds');
    return collection?.productIds || [];
  }
}

export default new CollectionService();
