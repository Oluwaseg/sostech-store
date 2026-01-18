import { Router } from 'express';
import referralController from '../controllers/referral.controller';

const router = Router();

// Get referral stats for authenticated user
router.get('/stats', referralController.getStats);

export default router;
