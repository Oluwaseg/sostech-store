import { Router } from 'express';
import authRoutes from './auth.route';
import referralRoutes from './referral.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/referrals', referralRoutes);

export default router;
