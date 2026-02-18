import { NextFunction, Request, Response } from 'express';
import reviewService from '../services/review.service';

class ReviewController {
  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      if (!user) {
        return (res as any).error(
          'Authentication required',
          'AUTH_REQUIRED',
          401
        );
      }

      const userId = user._id || user.userId;

      const { product } = req.params;
      const { rating, comment } = req.body;

      const review = await reviewService.createReview({
        product: product || req.body.product,
        user: userId,
        rating,
        comment,
      });

      // the service handles both creation and updates
      const msg =
        review.createdAt.getTime() === review.updatedAt.getTime()
          ? 'Review created successfully'
          : 'Review updated successfully';

      return (res as any).success(review, msg, null, 201);
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to create review',
        'CREATE_REVIEW_ERROR',
        400
      );
    }
  }

  async getReviewsByProduct(req: Request, res: Response, next: NextFunction) {
    try {
      let { product } = req.params;
      if (Array.isArray(product)) product = product[0];

      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const result = await reviewService.getReviewsByProduct(
        product,
        page,
        limit
      );
      return (res as any).success(result, 'Reviews retrieved successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to retrieve reviews',
        'GET_REVIEWS_ERROR',
        500
      );
    }
  }

  async getReviewById(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      if (Array.isArray(id)) id = id[0];

      const review = await reviewService.getReviewById(id);
      if (!review) {
        return (res as any).error('Review not found', 'REVIEW_NOT_FOUND', 404);
      }

      return (res as any).success(review, 'Review retrieved successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to retrieve review',
        'GET_REVIEW_ERROR',
        500
      );
    }
  }

  async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      if (!user) {
        return (res as any).error(
          'Authentication required',
          'AUTH_REQUIRED',
          401
        );
      }

      const userId = user._id || user.userId;

      let { id } = req.params;
      if (Array.isArray(id)) id = id[0];

      const isAdmin = user.role === 'admin';

      const review = await reviewService.updateReview(
        id,
        userId,
        req.body,
        isAdmin
      );
      return (res as any).success(review, 'Review updated successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to update review',
        'UPDATE_REVIEW_ERROR',
        error.message.includes('not authorized') ? 403 : 400
      );
    }
  }

  async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      if (!user) {
        return (res as any).error(
          'Authentication required',
          'AUTH_REQUIRED',
          401
        );
      }

      const userId = user._id || user.userId;

      let { id } = req.params;
      if (Array.isArray(id)) id = id[0];

      const isAdmin = user.role === 'admin';

      await reviewService.deleteReview(id, userId, isAdmin);
      return (res as any).success(null, 'Review deleted successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to delete review',
        'DELETE_REVIEW_ERROR',
        error.message.includes('not authorized') ? 403 : 400
      );
    }
  }
}

const reviewController = new ReviewController();
export default reviewController;
