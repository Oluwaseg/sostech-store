import { Router } from 'express';
import checkoutController from '../controllers/checkout.controller';
import auth from '../middlewares/auth.middleware';
import authorize from '../middlewares/authorize.middleware';

const router = Router();

// Perform checkout for authenticated users
router.post(
  '/',
  auth,
  authorize('user', 'moderator', 'admin'),
  checkoutController.checkout
);

export default router;

