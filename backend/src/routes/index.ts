import { Router } from 'express';
import authRoutes from './auth.route';
import categoryRoutes from './category.route';
import productRoutes from './product.route';
import referralRoutes from './referral.route';
import subcategoryRoutes from './subcategory.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/referrals', referralRoutes);
router.use('/categories', categoryRoutes);
router.use('/subcategories', subcategoryRoutes);
router.use('/products', productRoutes);

export default router;
