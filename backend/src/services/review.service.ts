import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { IReview, Review } from '../models/Review';

interface CreateReviewData {
  product: string;
  user: string;
  rating: number;
  comment?: string;
}

interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

class ReviewService {
  private async recalcProductRating(productId: string) {
    const reviews = await Review.find({ product: productId }).select('rating');
    const ratingCount = reviews.length;
    const averageRating =
      ratingCount === 0
        ? 0
        : reviews.reduce((s, r) => s + (r.rating || 0), 0) / ratingCount;

    await Product.findByIdAndUpdate(productId, {
      averageRating,
      ratingCount,
    });
  }

  async createReview(data: CreateReviewData): Promise<IReview> {
    // Validate product exists
    const product = await Product.findById(data.product);
    if (!product) {
      throw new Error('Product not found');
    }

    // Create review (unique index on product+user will prevent duplicates)
    const review = await Review.create({
      product: data.product,
      user: data.user,
      rating: data.rating,
      comment: data.comment,
    });

    // Recalculate product rating
    await this.recalcProductRating(data.product);

    await review.populate({ path: 'user', select: 'name email' });

    return review;
  }

  async getReviewsByProduct(
    productId: string,
    page = 1,
    limit = 10
  ): Promise<{
    reviews: IReview[];
    total: number;
    page: number;
    pages: number;
  }> {
    const query: any = { product: new mongoose.Types.ObjectId(productId) };

    const skip = (page - 1) * limit;
    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .populate({ path: 'user', select: 'name email' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return { reviews, total, page, pages: Math.ceil(total / limit) };
  }

  async getReviewById(id: string): Promise<IReview | null> {
    return Review.findById(id).populate({ path: 'user', select: 'name email' });
  }

  async updateReview(
    id: string,
    currentUserId: string,
    data: UpdateReviewData,
    isAdmin = false
  ): Promise<IReview> {
    const review = await Review.findById(id);
    if (!review) throw new Error('Review not found');

    if (review.user.toString() !== currentUserId && !isAdmin) {
      throw new Error('Not authorized to update this review');
    }

    const originalRating = review.rating;

    if (data.rating !== undefined) review.rating = data.rating;
    if (data.comment !== undefined) review.comment = data.comment as any;

    await review.save();

    // If rating changed, recalc product rating
    if (data.rating !== undefined && data.rating !== originalRating) {
      await this.recalcProductRating(review.product.toString());
    }

    await review.populate({ path: 'user', select: 'name email' });

    return review;
  }

  async deleteReview(id: string, currentUserId: string, isAdmin = false) {
    const review = await Review.findById(id);
    if (!review) throw new Error('Review not found');

    if (review.user.toString() !== currentUserId && !isAdmin) {
      throw new Error('Not authorized to delete this review');
    }

    const productId = review.product.toString();
    await review.remove();

    // Recalculate product rating
    await this.recalcProductRating(productId);
  }
}

const reviewService = new ReviewService();
export default reviewService;
