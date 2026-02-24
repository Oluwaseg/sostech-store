import { Router } from 'express';
import authRoutes from './auth.route';
import cartRoutes from './cart.route';
import categoryRoutes from './category.route';
import productRoutes from './product.route';
import referralRoutes from './referral.route';
import reviewRoutes from './review.route';
import subcategoryRoutes from './subcategory.route';
import checkoutRoutes from './checkout.route';
import couponRoutes from './coupon.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/referrals', referralRoutes);
router.use('/categories', categoryRoutes);
router.use('/subcategories', subcategoryRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/reviews', reviewRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/coupons', couponRoutes);

export default router;
