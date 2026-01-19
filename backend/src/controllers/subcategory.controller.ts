import { NextFunction, Request, Response } from 'express';
import subcategoryService from '../services/subcategory.service';

class SubcategoryController {
  async createSubcategory(req: Request, res: Response, next: NextFunction) {
    try {
      const subcategory = await subcategoryService.createSubcategory(req.body);
      return (res as any).success(
        subcategory,
        'Subcategory created successfully',
        null,
        201
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to create subcategory',
        'CREATE_SUBCATEGORY_ERROR',
        400
      );
    }
  }

  async getSubcategories(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, isPublished } = req.query;
      const filters: any = {};

      if (category) {
        filters.category = category;
      }

      if (isPublished !== undefined) {
        filters.isPublished = isPublished === 'true';
      }

      const subcategories = await subcategoryService.getSubcategories(filters);
      return (res as any).success(
        subcategories,
        'Subcategories retrieved successfully'
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to retrieve subcategories',
        'GET_SUBCATEGORIES_ERROR',
        500
      );
    }
  }

  async getSubcategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      if (Array.isArray(id)) {
        id = id[0];
      }
      const subcategory = await subcategoryService.getSubcategoryById(id);
      return (res as any).success(
        subcategory,
        'Subcategory retrieved successfully'
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to retrieve subcategory',
        'GET_SUBCATEGORY_ERROR',
        error.message.includes('not found') ? 404 : 500
      );
    }
  }

  async getSubcategoryBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      let { slug } = req.params;
      if (Array.isArray(slug)) {
        slug = slug[0];
      }
      const subcategory = await subcategoryService.getSubcategoryBySlug(slug);
      return (res as any).success(
        subcategory,
        'Subcategory retrieved successfully'
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to retrieve subcategory',
        'GET_SUBCATEGORY_ERROR',
        error.message.includes('not found') ? 404 : 500
      );
    }
  }

  async updateSubcategory(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      if (Array.isArray(id)) {
        id = id[0];
      }
      const subcategory = await subcategoryService.updateSubcategory(
        id,
        req.body
      );
      return (res as any).success(
        subcategory,
        'Subcategory updated successfully'
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to update subcategory',
        'UPDATE_SUBCATEGORY_ERROR',
        error.message.includes('not found') ? 404 : 400
      );
    }
  }

  async deleteSubcategory(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      if (Array.isArray(id)) {
        id = id[0];
      }
      await subcategoryService.deleteSubcategory(id);
      return (res as any).success(null, 'Subcategory deleted successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to delete subcategory',
        'DELETE_SUBCATEGORY_ERROR',
        error.message.includes('not found') ? 404 : 500
      );
    }
  }
}

const subcategoryController = new SubcategoryController();
export default subcategoryController;
