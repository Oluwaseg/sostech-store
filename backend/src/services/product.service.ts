import mongoose from 'mongoose';
import { Category } from '../models/Category';
import { IProduct, Product } from '../models/Product';
import { Subcategory } from '../models/SubCategory';

export interface CreateProductData {
  name: string;
  description: string;
  sku: string;
  basePrice: number;
  stock: number;
  category: string;
  subcategory?: string;
  brand?: string;
  tags?: string[];
  isPublished?: boolean;
  visibility?: 'public' | 'private' | 'archived';
  images?: {
    url: string;
    publicId: string;
    isThumbnail: boolean;
  }[];
  createdBy: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  sku?: string;
  basePrice?: number;
  stock?: number;
  category?: string;
  subcategory?: string;
  brand?: string;
  tags?: string[];
  isPublished?: boolean;
  visibility?: 'public' | 'private' | 'archived';
  images?: {
    url: string;
    publicId: string;
    isThumbnail: boolean;
  }[];
}

interface FilterOptions {
  category?: string;
  subcategory?: string;
  isPublished?: boolean;
  visibility?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  search?: string;
}

interface PaginationOptions {
  page: number;
  limit: number;
}

class ProductService {
  async createProduct(data: CreateProductData): Promise<IProduct> {
    // Validate category exists
    const categoryExists = await Category.findById(data.category);
    if (!categoryExists) {
      throw new Error('Category not found');
    }

    // Validate subcategory if provided
    if (data.subcategory) {
      const subcategoryExists = await Subcategory.findById(data.subcategory);
      if (!subcategoryExists) {
        throw new Error('Subcategory not found');
      }
    }

    // Check if product with same SKU already exists
    const existingProduct = await Product.findOne({ sku: data.sku });
    if (existingProduct) {
      throw new Error('Product with this SKU already exists');
    }

    const product = await Product.create({
      ...data,
      tags: data.tags || [],
      images: data.images || [],
    });

    // Populate references
    await product.populate(['category', 'subcategory', 'createdBy']);

    return product;
  }

  async getProducts(
    filters?: FilterOptions,
    pagination?: PaginationOptions
  ): Promise<{
    products: IProduct[];
    total: number;
    page: number;
    pages: number;
  }> {
    const query: any = {};

    // Apply filters
    if (filters?.category) {
      query.category = new mongoose.Types.ObjectId(filters.category);
    }

    if (filters?.subcategory) {
      query.subcategory = new mongoose.Types.ObjectId(filters.subcategory);
    }

    if (filters?.isPublished !== undefined) {
      query.isPublished = filters.isPublished;
    }

    if (filters?.visibility) {
      query.visibility = filters.visibility;
    }

    if (filters?.brand) {
      query.brand = { $regex: filters.brand, $options: 'i' };
    }

    // Price range filter
    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      query.basePrice = {};
      if (filters?.minPrice !== undefined) {
        query.basePrice.$gte = filters.minPrice;
      }
      if (filters?.maxPrice !== undefined) {
        query.basePrice.$lte = filters.maxPrice;
      }
    }

    // Tags filter
    if (filters?.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    // Text search
    if (filters?.search) {
      query.$text = { $search: filters.search };
    }

    // Pagination
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate(['category', 'subcategory', 'createdBy'])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async getProductById(id: string): Promise<IProduct> {
    const product = await Product.findById(id).populate([
      'category',
      'subcategory',
      'createdBy',
    ]);

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async getProductBySlug(slug: string): Promise<IProduct> {
    const product = await Product.findOne({ slug }).populate([
      'category',
      'subcategory',
      'createdBy',
    ]);

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async getProductsBySku(sku: string): Promise<IProduct> {
    const product = await Product.findOne({ sku }).populate([
      'category',
      'subcategory',
      'createdBy',
    ]);

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async updateProduct(id: string, data: UpdateProductData): Promise<IProduct> {
    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    // Validate category if updating
    if (data.category) {
      const categoryExists = await Category.findById(data.category);
      if (!categoryExists) {
        throw new Error('Category not found');
      }
    }

    // Validate subcategory if updating
    if (data.subcategory) {
      const subcategoryExists = await Subcategory.findById(data.subcategory);
      if (!subcategoryExists) {
        throw new Error('Subcategory not found');
      }
    }

    // Check for duplicate SKU (excluding current product)
    if (data.sku && data.sku !== product.sku) {
      const existingProduct = await Product.findOne({
        sku: data.sku,
        _id: { $ne: id },
      });

      if (existingProduct) {
        throw new Error('Product with this SKU already exists');
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).populate(['category', 'subcategory', 'createdBy']);

    if (!updatedProduct) {
      throw new Error('Failed to update product');
    }

    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      throw new Error('Product not found');
    }
  }

  async updateProductRating(
    id: string,
    newRating: number,
    isNew: boolean
  ): Promise<void> {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    if (isNew) {
      product.averageRating =
        (product.averageRating * product.ratingCount + newRating) /
        (product.ratingCount + 1);
      product.ratingCount += 1;
    } else {
      product.averageRating = newRating;
    }

    await product.save();
  }

  async decrementStock(id: string, quantity: number): Promise<void> {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    product.stock -= quantity;
    await product.save();
  }

  async incrementStock(id: string, quantity: number): Promise<void> {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    product.stock += quantity;
    await product.save();
  }
}

const productService = new ProductService();
export default productService;
