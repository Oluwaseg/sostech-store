import { NextFunction, Request, Response } from 'express';
import categoryService from '../services/category.service';

class CategoryController {
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.createCategory(req.body);
      return (res as any).success(
        category,
        'Category created successfully',
        null,
        201
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to create category',
        'CREATE_CATEGORY_ERROR',
        400
      );
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const { isPublished } = req.query;
      const filters: any = {};

      if (isPublished !== undefined) {
        filters.isPublished = isPublished === 'true';
      }

      const categories = await categoryService.getCategories(filters);
      return (res as any).success(
        categories,
        'Categories retrieved successfully'
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to retrieve categories',
        'GET_CATEGORIES_ERROR',
        500
      );
    }
  }

  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      if (Array.isArray(id)) {
        id = id[0];
      }

      const category = await categoryService.getCategoryById(id);
      return (res as any).success(category, 'Category retrieved successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to retrieve category',
        'GET_CATEGORY_ERROR',
        error.message.includes('not found') ? 404 : 500
      );
    }
  }

  async getCategoryBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      let { slug } = req.params;
      if (Array.isArray(slug)) {
        slug = slug[0];
      }
      const category = await categoryService.getCategoryBySlug(slug);
      return (res as any).success(category, 'Category retrieved successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to retrieve category',
        'GET_CATEGORY_ERROR',
        error.message.includes('not found') ? 404 : 500
      );
    }
  }

  async getProductsBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      let { slug } = req.params;
      if (Array.isArray(slug)) {
        slug = slug[0];
      }

      const {
        subcategory,
        brand,
        tags,
        search,
        minPrice,
        maxPrice,
        flashSaleActive,
        isBestSeller,
        isPublished,
        visibility,
        page,
        limit,
      } = req.query;

      const filters: any = {};
      if (subcategory) filters.subcategory = subcategory;
      if (brand) filters.brand = brand;
      if (tags)
        filters.tags = Array.isArray(tags) ? tags : (tags as string).split(',');
      if (search) filters.search = search;
      if (minPrice) filters.minPrice = parseFloat(minPrice as string);
      if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);
      if (flashSaleActive !== undefined)
        filters.flashSaleActive = flashSaleActive === 'true';
      if (isBestSeller !== undefined)
        filters.isBestSeller = isBestSeller === 'true';
      if (isPublished !== undefined)
        filters.isPublished = isPublished === 'true';

      const user = (req as any).user;
      const isAdmin = user && user.role === 'admin';
      if (visibility && isAdmin) {
        filters.visibility = visibility;
      } else {
        filters.visibility = 'public';
      }

      const pagination = {
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 10,
      };

      const result = await categoryService.getProductsByCategorySlug(
        slug,
        filters,
        pagination
      );

      return (res as any).success(
        result,
        'Category products retrieved successfully'
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to retrieve category products',
        'GET_CATEGORY_PRODUCTS_ERROR',
        500
      );
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;

      if (Array.isArray(id)) {
        id = id[0];
      }

      const category = await categoryService.updateCategory(id, req.body);
      return (res as any).success(category, 'Category updated successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to update category',
        'UPDATE_CATEGORY_ERROR',
        error.message.includes('not found') ? 404 : 400
      );
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      if (Array.isArray(id)) {
        id = id[0];
      }
      await categoryService.deleteCategory(id);
      return (res as any).success(null, 'Category deleted successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to delete category',
        'DELETE_CATEGORY_ERROR',
        error.message.includes('not found') ? 404 : 500
      );
    }
  }
}

const categoryController = new CategoryController();
export default categoryController;
