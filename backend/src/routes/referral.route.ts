import { Router } from 'express';
import referralController from '../controllers/referral.controller';
import auth from '../middlewares/auth.middleware';
import authorize from '../middlewares/authorize.middleware';

const router = Router();

// Get referral stats for authenticated user (allowed roles: user, moderator, admin)
router.get(
  '/stats',
  auth,
  authorize('user', 'moderator', 'admin'),
  referralController.getStats
);

export default router;
