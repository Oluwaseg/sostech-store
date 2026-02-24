import { Router } from 'express';
import couponController from '../controllers/coupon.controller';
import auth from '../middlewares/auth.middleware';
import authorize from '../middlewares/authorize.middleware';

const router = Router();

// List active coupons for current user
router.get(
  '/my',
  auth,
  authorize('user', 'moderator', 'admin'),
  couponController.getMyCoupons
);

// Validate a coupon code for current user
router.get(
  '/validate/:code',
  auth,
  authorize('user', 'moderator', 'admin'),
  couponController.validateCoupon
);

export default router;

