import { Router } from 'express';
import authRoutes from './auth.route';
import categoryRoutes from './category.route';
import referralRoutes from './referral.route';
import subcategoryRoutes from './subcategory.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/referrals', referralRoutes);
router.use('/categories', categoryRoutes);
router.use('/subcategories', subcategoryRoutes);

export default router;
