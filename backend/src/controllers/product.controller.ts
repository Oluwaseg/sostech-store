import { NextFunction, Request, Response } from 'express';
import productService from '../services/product.service';

class ProductController {
  async getOtherProducts(req: Request, res: Response, next: NextFunction) {
    try {
      let { slug } = req.params;
      if (Array.isArray(slug)) {
        slug = slug[0];
      }
      // Find the main product by slug
      const mainProduct = await productService.getProductBySlug(slug);
      if (!mainProduct) {
        return (res as any).error('Product not found', 'GET_OTHER_PRODUCTS_ERROR', 404);
      }
      // Find other products in the same category, excluding the main product
      const otherProducts = await productService.getProducts({
        category: mainProduct.category?._id?.toString() || mainProduct.category?.toString(),
        isPublished: true,
      }, { page: 1, limit: 8 });
      // Filter out the main product
      const filtered = otherProducts.products.filter(p => p.slug !== slug);
      return (res as any).success(filtered, 'Other products retrieved successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to retrieve other products',
        'GET_OTHER_PRODUCTS_ERROR',
        500
      );
    }
  }
// ...existing code...
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.createProduct(req.body);
      return (res as any).success(
        product,
        'Product created successfully',
        null,
        201
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to create product',
        'CREATE_PRODUCT_ERROR',
        400
      );
    }
  }

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        category,
        subcategory,
        isPublished,
        visibility,
        brand,
        minPrice,
        maxPrice,
        tags,
        search,
        flashSaleActive,
        isBestSeller,
        page,
        limit,
      } = req.query;

      const filters: any = {};
      if (category) filters.category = category;
      if (subcategory) filters.subcategory = subcategory;
      if (isPublished !== undefined)
        filters.isPublished = isPublished === 'true';
      if (brand) filters.brand = brand;
      if (minPrice) filters.minPrice = parseFloat(minPrice as string);
      if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);
      if (tags)
        filters.tags = Array.isArray(tags) ? tags : (tags as string).split(',');
      if (search) filters.search = search;
      if (flashSaleActive !== undefined)
        filters.flashSaleActive = flashSaleActive === 'true';
      if (isBestSeller !== undefined)
        filters.isBestSeller = isBestSeller === 'true';

      // Determine user role (admin can see all, regular users see public only)
      const user = (req as any).user;
      const isAdmin = user && user.role === 'admin';

      // If visibility is explicitly requested and user is admin, allow it
      // Otherwise default to 'public' for non-admin users
      if (visibility && isAdmin) {
        filters.visibility = visibility;
      } else if (!isAdmin) {
        filters.visibility = 'public';
      }

      const pagination = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      };

      const result = await productService.getProducts(filters, pagination);
      return (res as any).success(result, 'Products retrieved successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to retrieve products',
        'GET_PRODUCTS_ERROR',
        500
      );
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      if (Array.isArray(id)) {
        id = id[0];
      }
      const product = await productService.getProductById(id);
      return (res as any).success(product, 'Product retrieved successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to retrieve product',
        'GET_PRODUCT_ERROR',
        error.message.includes('not found') ? 404 : 500
      );
    }
  }

  async getProductBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      let { slug } = req.params;
      if (Array.isArray(slug)) {
        slug = slug[0];
      }
      const product = await productService.getProductBySlug(slug);
      return (res as any).success(product, 'Product retrieved successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to retrieve product',
        'GET_PRODUCT_ERROR',
        error.message.includes('not found') ? 404 : 500
      );
    }
  }

  async getProductBySku(req: Request, res: Response, next: NextFunction) {
    try {
      let { sku } = req.params;
      if (Array.isArray(sku)) {
        sku = sku[0];
      }
      const product = await productService.getProductsBySku(sku);
      return (res as any).success(product, 'Product retrieved successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to retrieve product',
        'GET_PRODUCT_ERROR',
        error.message.includes('not found') ? 404 : 500
      );
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      if (Array.isArray(id)) {
        id = id[0];
      }
      const product = await productService.updateProduct(id, req.body);
      return (res as any).success(product, 'Product updated successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to update product',
        'UPDATE_PRODUCT_ERROR',
        error.message.includes('not found') ? 404 : 400
      );
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      if (Array.isArray(id)) {
        id = id[0];
      }
      await productService.deleteProduct(id);
      return (res as any).success(null, 'Product deleted successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to delete product',
        'DELETE_PRODUCT_ERROR',
        error.message.includes('not found') ? 404 : 500
      );
    }
  }
}

const productController = new ProductController();
export default productController;
